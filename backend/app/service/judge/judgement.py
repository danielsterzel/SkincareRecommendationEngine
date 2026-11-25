import json

from anthropic import Anthropic
from openai import OpenAI
from pydantic import BaseModel, Field

from app.core.settings import settings
from app.schemas.initial_analysis import (
    UserSkinInformationInput,
    CurrentRoutineItem,
)
from app.schemas.initial_analysis import SkinProblemMock
from typing import Annotated, Literal

from app.service.decision.dataset_queries import products_by_key
from app.service.decision.desicion_engine import wsm_pipeline
from app.service.decision.schemas import (
    SkinConcern,
    SkinType,
    SensitivityLevels,
    AllergenInciTerms,
    PreviousReactionToProduct,
)
from app.service.decision.schemas import UserSkinContext
from app.service.decision.llm_utils import _parse_with_usage
from pathlib import Path
from app.schemas.initial_analysis import CompletedEvent

EXTRACTION_EVALUATION_PROMPT = (
    Path(__file__).resolve().parent / "prompt" / "extract_eval_prompt.txt"
).read_text(encoding="utf-8")
RECOMMENDED_PRODUCTS_PROMPT = (
    Path(__file__).resolve().parent / "prompt" / "recommended_products_prompt.txt"
).read_text(encoding="utf-8")


class ConcernPair(BaseModel):
    selected: list[SkinProblemMock]
    mapped: list[SkinConcern]
    mapped_goals: list[str]


class SkinProfilePair(BaseModel):
    selected_skin_type: str | None
    mapped_skin_type: SkinType | None
    mapped_sensitivity: SensitivityLevels


class RoutineAndAllergensPair(BaseModel):
    mapped_allergens: list[AllergenInciTerms]
    mapped_previous_reactions_to_products: list[str]
    mapped_routine: list[CurrentRoutineItem]


class ExtractionJudgeCase(BaseModel):
    selected_additional_detail: str | None
    concerns: ConcernPair
    skin_profile_pair: SkinProfilePair
    routine_and_allergens: RoutineAndAllergensPair


Percent = Annotated[float, Field(ge=0.0, le=100.0)]


class ExtractionJudgeResult(BaseModel):
    score_category: Annotated[
        Literal[0, 1, 2],
        Field(description="0: incorrect, 1: partially correct, 2: correct"),
    ]
    percent_match: Percent
    evaluation_rapport: str


class ProductJudgement(BaseModel):
    brand: str
    product_name: str
    score_category: Annotated[
        Literal[0, 1, 2],
        Field(
            description="0: not relevant or harmful, 1: relevant but introduces a conflict or only indirectly supports the concern, 2: relevant and safe for this user"
        ),
    ]
    percent_match: Annotated[
        Percent,
        Field(description="How well the product matches the user's concerns and goals"),
    ]
    reason: str = Field(description="1-2 sentences explaining the score")


class ProductRecommendationJudgeResult(BaseModel):
    products: list[ProductJudgement]
    evaluation_rapport: str


class JudgeRun[T: BaseModel](BaseModel):
    result: T
    model: str
    input_tokens: int | None
    output_tokens: int | None
    latency_ms: float


PRODUCT_FIELDS_FOR_JUDGE = {
    "brand",
    "product_name",
    "ingredients",
    "category",
    "sub_category",
    "application_area",
    "concentration_ingredient",
    "concentration",
    "targets",
    "suited_for",
    "ph",
}


def pair_context_input(
    ctx: UserSkinContext, user_input: UserSkinInformationInput
) -> ExtractionJudgeCase:
    """returns mapping of input vs context derived by the llm"""

    def extract_relevant_product_attributes(
        allergen_products: list[PreviousReactionToProduct],
    ) -> list[str]:
        return [
            product.model_dump_json(exclude={"source_url"}, indent=0)
            for product in allergen_products
        ]

    return ExtractionJudgeCase(
        selected_additional_detail=user_input.additional_detail,
        concerns=ConcernPair(
            selected=user_input.concerns,
            mapped=ctx.skin_concerns,
            mapped_goals=ctx.goals,
        ),
        skin_profile_pair=SkinProfilePair(
            selected_skin_type=user_input.skin_type,
            mapped_skin_type=ctx.skin_type,
            mapped_sensitivity=ctx.skin_sensitivity,
        ),
        routine_and_allergens=RoutineAndAllergensPair(
            mapped_allergens=ctx.allergens,
            mapped_routine=ctx.current_routine,
            mapped_previous_reactions_to_products=extract_relevant_product_attributes(
                ctx.previous_reactions_to_products
            ),
        ),
    )

class Judge:
    model: str
    client: Anthropic | OpenAI

    def judge_extraction(
        self, case: ExtractionJudgeCase
    ) -> JudgeRun[ExtractionJudgeResult]:
        return self._run(
            prompt=EXTRACTION_EVALUATION_PROMPT,
            model_input=case.model_dump_json(exclude_none=True),
            structured_output=ExtractionJudgeResult,
        )

    def judge_negative_label_assignment(self): ...

    async def judge_products(
        self,
        user_input: UserSkinInformationInput,
        extraction_case: ExtractionJudgeCase,
        client: OpenAI,
    ) -> JudgeRun[ProductRecommendationJudgeResult] | None:

        async for event in wsm_pipeline(user_input=user_input, client=client):
            if isinstance(event, CompletedEvent):
                extraction_judgement = self.judge_extraction(extraction_case).result
                model_input = json.dumps(
                    {
                        "extraction_judgement": extraction_judgement.model_dump(),
                        "raw_user_input": user_input.model_dump(),
                        "recommended_products": [
                            {
                                **products_by_key()[(p.brand, p.name)].model_dump(
                                    mode="json", include=PRODUCT_FIELDS_FOR_JUDGE
                                ),
                                "wsm_score": p.wsm_score,
                            }
                            for p in event.data
                        ],
                    }
                )
                return self._run(
                    prompt=RECOMMENDED_PRODUCTS_PROMPT,
                    model_input=model_input,
                    structured_output=ProductRecommendationJudgeResult,
                )
        return None

    def _run[T: BaseModel](
        self, prompt: str, model_input: str, structured_output: type[T]
    ) -> JudgeRun[T]:
        call = _parse_with_usage(
            self.client,
            model=self.model,
            input_=model_input,
            instructions=prompt,
            text_format=structured_output,
        )
        return JudgeRun[structured_output](
            result=call.parsed,
            model=call.model,
            input_tokens=call.input_tokens,
            output_tokens=call.output_tokens,
            latency_ms=call.latency_ms,
        )


class ClaudeJudge(Judge):
    def __init__(self, *, client: Anthropic, model: str = "claude-haiku-5-5"):
        self.model = model
        self.client = client


class OpenAIJudge(Judge):
    def __init__(self, *, client: OpenAI, model: str = settings.open_ai_model):
        self.model = model
        self.client = client


# user input prefixed with "selected", llm inference prefixed with mapped
