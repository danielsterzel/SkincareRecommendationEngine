"""algorithms to research
- WSM
- TOPSIS
- AHP
- VIKOR
- ELECTRE
- PROMETHEE
- Bayesian decision theory
- Contextual Bandits
- Bayesian Optimization

FOR NOW WE SKIP ALL PRODUCTS WITH TARGETS == NONE
"""

from typing import Annotated

# optimization algorithms (routine making):
#  Greedy
#  Beam Search
#  Constraint programming
#  MILP
#  NSGA-II


# first approach wsm:
import numpy as np
from openai import OpenAI
from pydantic import BaseModel, Field, ConfigDict

from app.core.settings import settings
from app.service.decision.dataset_schemas import Product, SuitedForValue
from app.service.decision.llm_utils import (
    assign_negative_labels_to_products,
    openai_user_skin_context_inference,
)
from app.service.decision.dataset_queries import load_products, load_allergen_terms
from app.service.decision.schemas import UserSkinContext
from annotated_types import Gt, Lt
from functools import cache
from pathlib import Path
import json
from app.service.decision.schema_mappings import PRODUCT_SUITED_FOR_TO_SKIN_TYPE, SKIN_TYPE_NEGATIVE_EFFECTS
from app.service.decision.domain_types import OptString

NEGATIVE_EFFECT_LABELS = {
    "dryness": "Skin dryness, flaking, peeling, tightness, or loss of moisture caused or worsened by a product.",
    "redness": "Skin redness, flushing, or worsening of existing erythema associated with product use.",
    "irritation": "Non-allergic skin irritation, including burning, stinging, itching, discomfort, or irritant contact dermatitis.",
    "comedogenicity": "Potential development or worsening of clogged pores, blackheads, whiteheads, or acne breakouts.",
    "allergic_reaction": "Allergic skin reactions, including allergic contact dermatitis, rash, swelling, or itching caused by sensitivity to an ingredient.",
    "photosensitivity": "Increased sensitivity to ultraviolet radiation, potentially resulting in exaggerated skin reactions following sun exposure.",
    "pigmentation_changes": "Undesirable changes in skin pigmentation, including hyperpigmentation or hypopigmentation associated with product use.",
    "other": "A documented adverse skin effect that does not fit any of the predefined categories.",
    "unknown": "Insufficient reliable information to identify potential adverse effects. This does not imply that the product is risk-free.",
}

NORMALIZED_TARGETS_PATH = Path(__file__).resolve().parent / "data" / "normalized-targets.json"

@cache
def target_map() -> dict[str, str]:
    raw = json.loads(NORMALIZED_TARGETS_PATH.read_text(encoding='utf-8'))
    return {t['original_name'] : t['normalized_name'] for t in raw['normalized_targets']}

ScoreAnnotation = Annotated[float, Gt(0.0), Lt(1.0)]

class Scores(BaseModel):
    model_config = ConfigDict(frozen=True)

    positive_effect: float = Field(ge=0.0, le=1.0)  # 1 - best
    negative_effect: float = Field(ge=0.0, le=1.0)  # 1 - lowest risk
    price_effect: float | None = Field(ge=0.0, le=1.0)
    ratings_effect: float | None = Field(ge=0.0, le=1.0)


CRITERIA = tuple(Scores.model_fields.keys())
WEIGHTS = {
    "positive_effect": 0.7,
    "negative_effect": 0.3,
}


assert len(CRITERIA) == len(WEIGHTS)


def normalize(weights: dict[str, float]) -> dict[str, float]:

    total = sum(weights.values())
    return {name: w / total for name, w in weights.items()}

def rate_positive_effect(
    product: Product, concerns: list[str]
) -> ScoreAnnotation:

    num_concerns = len(concerns)
    num_targets = len(product.targets)
    return num_targets / num_concerns

def rate_negative_effect(
        product: Product,
        ctx: UserSkinContext,
        negative_labels: set[str]
) -> ScoreAnnotation:

    def matches_to_skin(p: Product, ctx: UserSkinContext) -> bool:
        suited_for = p.suited_for
        for fit in suited_for:
            if PRODUCT_SUITED_FOR_TO_SKIN_TYPE[fit] == ctx.skin_type:
                return True
        return False


    def unsuited_for_skin(ctx: UserSkinContext, negative_labels: set[str]) -> float:
        if ctx.skin_type is None:
            return 0.5
        relevant = SKIN_TYPE_NEGATIVE_EFFECTS[ctx.skin_type]

        if relevant & negative_labels:
            return 0.0

        return 1.0


    good_fit = matches_to_skin(product, ctx)
    bias = 0.5
    if not good_fit:
        bias = 0.0

    unsuited = unsuited_for_skin(ctx, negative_labels=negative_labels)


    return (bias + unsuited + 0.8) / (???)

# Score assesment:
# positive_score: num of concerns product helps with / user skin_concerns
# negative_score: num of negative labels / skin_concerns?
# price_score: beats me tbh...
# rating_score: (num_of_ratings + rating) / (... tutaj scisnac to do  0, 1)
#

# Introduce later on "bias" -> input from user how well product
# helps with skin_concern


# TODO: call llm inferences for negative labels, Match them to the heuristics
#  -test the weights and proposed routines against user input tests
#
def wsm(scores: np.ndarray, weights: np.ndarray) -> np.ndarray:
    return scores @ weights


def exclude_negative_products(
    products: list[Product], user_skin_context: UserSkinContext
) -> list[Product]:

    norm = lambda s: s.strip().lower()

    Brand = str
    ProductName = str
    Allergen = str

    def high_severity_reactions(ctx: UserSkinContext) -> set[tuple[Brand, ProductName]]:

        return {
            (norm(p.brand), norm(p.product_name))
            for p in ctx.previous_reactions_to_products
            if norm(p.severity) == "high"
        }

    def terms_for_allergens(allergens: list[Allergen]) -> set[Allergen]:
        table = load_allergen_terms()
        terms = set()
        for a in allergens:
            terms.update(table.get(norm(a), ()))
        return terms

    def contains_any_term(ingredients: list[str], terms: set[str]) -> bool:
        return any(term in ing for ing in ingredients for term in terms)

    terms = terms_for_allergens(
        [norm(a.inci_terms) for a in user_skin_context.allergens]
    )
    bad = high_severity_reactions(user_skin_context)
    safe = []
    for p in products:
        if (norm(p.brand), norm(p.product_name)) in bad:
            continue
        if terms:
            if p.ingredients_unknown:
                continue
            if contains_any_term(p.ingredients, terms):
                continue
        safe.append(p)
    return safe


def wsm_pipeline(user_input: str):

    client = OpenAI(api_key=settings.open_ai_key)
    user_skin_context = openai_user_skin_context_inference(client, user_input)
    products = load_products()

    negative_labels = assign_negative_labels_to_products(
        client=client, products=products, user_skin_context=user_skin_context
    )

    cleaned_products = exclude_negative_products(products, user_skin_context)

    # TODO:
    #  -create product criteria matrix
    #  -learn what the above point means
    #  -add weights or something idk it's 02:49

    ...


rng = np.random.default_rng(42)
scores = np.array([...])

weights = rng.dirichlet(np.ones(3))

results = wsm(scores, weights)

print(weights)
print(results)
print(f"Best: {np.argmax(results)}")
