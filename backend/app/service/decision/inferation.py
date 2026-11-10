from openai import OpenAI

from app.core.settings import settings
from app.service.decision.schemas import (
    IdentifiedSkinConcerns,
    ProductNegativeLabelModelOutput,
    UserSkinContext,
    NEGATIVE_EFFECT_LABELS,
)
from app.service.decision.dataset_schemas import Product
import json
from pathlib import Path

PROMPT_NEGATIVE_PRODUCT_LABELS = Path(
    "prompts/prompt_negative_product_labels.txt"
).read_text(encoding="utf-8")
PROMPT_USER_SKIN_CONTEXT = Path("prompts/prompt_user_skin_context.txt").read_text(
    encoding="utf-8"
)
NORMALIZED_NAMES_JSON_PATH = "data/normalized-targets.json"


def assign_negative_labels_to_products(
    products: list[Product], user_skin_context: UserSkinContext
) -> ProductNegativeLabelModelOutput:
    client = OpenAI(api_key=settings.open_ai_key)

    products_payload = [product.model_dump(mode="json") for product in products]

    labeled_products = client.responses.parse(
        model=settings.open_ai_model,
        input=json.dumps(
            {
                "product_jsons": products_payload,
                "negative_labels": NEGATIVE_EFFECT_LABELS,
                "user_skin_context": UserSkinContext.model_dump_json(user_skin_context),
            }
        ),
        instructions=PROMPT_NEGATIVE_PRODUCT_LABELS,
        text_format=ProductNegativeLabelModelOutput,
    )
    return labeled_products.output_parsed


def openai_user_skin_context_inference(user_input: str) -> UserSkinContext:

    client = OpenAI(api_key=settings.open_ai_key)

    user_skin_context = client.responses.parse(
        model=settings.open_ai_model,
        input=user_input,
        instructions=PROMPT_USER_SKIN_CONTEXT,
        text_format=UserSkinContext,
    )
    return user_skin_context.output_parsed


def infer_skin_concerns(user_input: str) -> list[str]:

    client = OpenAI(api_key=settings.open_ai_key)
    with open(NORMALIZED_NAMES_JSON_PATH, "r") as f:
        normalized_names = json.load(f)

    identify_concern = client.responses.parse(
        model=settings.open_ai_model,
        input=json.dumps(
            {"users_prompt": user_input, "normalized-targets.json": normalized_names}
        ),
        instructions="Your task is to identify any skin concerns in user's prompt. "
        "Map any skin concern found through your reasoning to one of the values"
        "visible in normalized-targets.json",
        text_format=IdentifiedSkinConcerns,
    )

    skin_concerns = identify_concern.output_parsed

    return skin_concerns.skin_concerns
