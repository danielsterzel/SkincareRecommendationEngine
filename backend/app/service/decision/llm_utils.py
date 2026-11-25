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
from anthropic import Anthropic

logger = getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"
NORMALIZED_NAMES_JSON_PATH = (
    Path(__file__).resolve().parent / "data" / "normalized-targets.json"
)


@cache
def _load_prompt(name: str) -> str:
    return (PROMPTS_DIR / name).read_text(encoding="utf-8")


@cache
def _load_normalized_targets() -> list[dict]:
    return json.loads(NORMALIZED_NAMES_JSON_PATH.read_text(encoding="utf-8"))


class LLMCallResult[T: BaseModel](BaseModel):
    parsed: T
    model: str
    input_tokens: int | None
    output_tokens: int | None
    latency_ms: float


def _parse_openai[T: BaseModel](
    client: OpenAI, *, model: str, input_: str, instructions: str, text_format: type[T]
) -> tuple[T | None, int | None, int | None]:
    response = client.responses.parse(
        model=model,
        input=input_,
        instructions=instructions,
        text_format=text_format,
        temperature=0,
    )
    usage = response.usage
    return (
        response.output_parsed,
        usage.input_tokens if usage else None,
        usage.output_tokens if usage else None,
    )


def _parse_anthropic[T: BaseModel](
    client: Anthropic,
    *,
    model: str,
    input_: str,
    instructions: str,
    text_format: type[T],
) -> tuple[T | None, int | None, int | None]:
    response = client.messages.parse(
        model=model,
        max_tokens=16000,
        system=instructions,
        messages=[{"role": "user", "content": input_}],
        output_format=text_format,
    )
    if response.stop_reason in ("refusal", "max_tokens"):
        raise LLMOutputParseException(
            f"LLM stopped without a full answer: {response.stop_reason}"
        )
    return (
        response.parsed_output,
        response.usage.input_tokens,
        response.usage.output_tokens,
    )


def _parse_with_usage[T: BaseModel](
    client: OpenAI | Anthropic,
    *,
    model: str,
    input_: str,
    instructions: str,
    text_format: type[T],
) -> LLMCallResult[T]:
    start = time.perf_counter()
    if isinstance(client, OpenAI):
        parsed, input_tokens, output_tokens = _parse_openai(
            client,
            model=model,
            input_=input_,
            instructions=instructions,
            text_format=text_format,
        )
    elif isinstance(client, Anthropic):
        parsed, input_tokens, output_tokens = _parse_anthropic(
            client,
            model=model,
            input_=input_,
            instructions=instructions,
            text_format=text_format,
        )
    else:
        raise TypeError(f"Unsupported LLM client: {type(client).__name__}")
    latency_ms = (time.perf_counter() - start) * 1000

    logger.info(
        "llm call model=%s input_tokens=%s output_tokens=%s latency_ms=%.0f",
        model,
        input_tokens,
        output_tokens,
        latency_ms,
    )
    if parsed is None:
        raise LLMOutputParseException("LLM returned no parsed output")
    return LLMCallResult[text_format](
        parsed=parsed,
        model=model,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        latency_ms=latency_ms,
    )


def parse_llm[T: BaseModel](
    client: OpenAI | Anthropic,
    *,
    model: str,
    input_: str,
    instructions: str,
    text_format: type[T],
) -> T:
    return _parse_with_usage(
        client,
        model=model,
        input_=input_,
        instructions=instructions,
        text_format=text_format,
    ).parsed


def assign_negative_labels_to_products(
    client: OpenAI, products: list[Product], user_skin_context: UserSkinContext
) -> ProductNegativeLabelModelOutput:

    products_payload = [product.model_dump(mode="json") for product in products]
    prompt = _load_prompt("prompt_negative_product_labels.txt")
    return parse_llm(
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

    return parse_llm(
        client=client,
        model=settings.open_ai_model,
        input_=user_input,
        instructions=_load_prompt("prompt_user_skin_context.txt"),
        text_format=UserSkinContext,
    )


def infer_skin_concerns(client: OpenAI, user_input: str) -> list[str]:

    result = parse_llm(
        client=client,
        model=settings.open_ai_model,
        input_=json.dumps(
            {
                "user_prompt": user_input,
                "normalized-targets.json": _load_normalized_targets(),
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
    result = parse_llm(
        client=client,
        input_=allergen,
        model=settings.open_ai_model,
        instructions=_load_prompt("prompt_allergen_inci_terms.txt"),
        text_format=AllergenInciTerms,
    )
    return [t.strip().lower() for t in result.inci_terms]
