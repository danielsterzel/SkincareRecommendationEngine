from openai import OpenAI
from functools import cache

from pydantic import BaseModel

from app.core.settings import settings
from app.service.decision.domain_exceptions import LLMOutputParseException
from app.service.decision.schemas import (
    IdentifiedSkinConcerns,
    ProductNegativeLabelModelOutput,
    UserSkinContext,
    NEGATIVE_EFFECT_LABELS,
    AllergenInciTerms,
)
from app.service.decision.dataset_schemas import Product
import json
from pathlib import Path
from logging import getLogger
import time

logger = getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"
NORMALIZED_NAMES_JSON_PATH = (
    Path(__file__).resolve().parent / "data" / "normalized-targets.json"
)


@cache
def load_prompt(name: str) -> str:
    return (PROMPTS_DIR / name).read_text(encoding="utf-8")


@cache
def load_normalized_targets() -> list[dict]:
    return json.loads(NORMALIZED_NAMES_JSON_PATH.read_text(encoding="utf-8"))


def parse_with_logging[T: BaseModel](
    client: OpenAI,
    *,
    model: str,
    input_: str,
    instructions: str,
    text_format: type[T],
) -> T:

    start = time.perf_counter()
    response = client.responses.parse(
        model=model,
        input=input_,
        instructions=instructions,
        text_format=text_format,
        temperature=0,
    )

    latency_ms = (time.perf_counter() - start) * 1000

    usage = response.usage
    logger.info(
        "llm call model=%s input_tokens=%s output_tokens=%s latency_ms=%0.f",
        model,
        usage.input_tokens if usage else None,
        usage.output_tokens if usage else None,
        latency_ms,
    )
    if response.output_parsed is None:
        raise LLMOutputParseException("LLM returned no parsed output")
    return response.output_parsed


def assign_negative_labels_to_products(
    client: OpenAI, products: list[Product], user_skin_context: UserSkinContext
) -> ProductNegativeLabelModelOutput:

    products_payload = [product.model_dump(mode="json") for product in products]
    prompt = load_prompt("prompt_negative_product_labels.txt")
    return parse_with_logging(
        client,
        model=settings.open_ai_model,
        input_=json.dumps(
            {
                "product_jsons": products_payload,
                "negative_labels": NEGATIVE_EFFECT_LABELS,
                "user_skin_context": user_skin_context.model_dump(mode="json"),
            }
        ),
        instructions=prompt,
        text_format=ProductNegativeLabelModelOutput,
    )


def openai_user_skin_context_inference(
    client: OpenAI, user_input: str
) -> UserSkinContext:

    return parse_with_logging(
        client=client,
        model=settings.open_ai_model,
        input_=user_input,
        instructions=load_prompt("prompt_user_skin_context.txt"),
        text_format=UserSkinContext,
    )


def infer_skin_concerns(client: OpenAI, user_input: str) -> list[str]:

    result = parse_with_logging(
        client=client,
        model=settings.open_ai_model,
        input_=json.dumps(
            {
                "user_prompt": user_input,
                "normalized-targets.json": load_normalized_targets(),
            }
        ),
        instructions=(
            "Your task is to identify any skin concerns in user's prompt. "
            "Map any skin concern found through your reasoning to one of the values "
            "visible in normalized-targets.json"
        ),
        text_format=IdentifiedSkinConcerns,
    )
    return result.skin_concerns


def expand_allergens_to_inci_terms(client: OpenAI, allergen: str) -> list[str]:
    """include Polish, English and Latin names of INCI labels.
    All products in UE require INCI names for products"""
    result = parse_with_logging(
        client=client,
        input_=allergen,
        model=settings.open_ai_model,
        instructions=load_prompt("prompt_allergen_inci_terms.txt"),
        text_format=AllergenInciTerms,
    )
    return [t.strip().lower() for t in result.inci_terms]
