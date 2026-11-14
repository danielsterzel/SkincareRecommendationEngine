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
from app.service.decision.dataset_schemas import Product
from app.service.decision.llm_utils import (
    assign_negative_labels_to_products,
    openai_user_skin_context_inference,
)
from app.service.decision.dataset_queries import load_products, load_allergen_terms
from app.service.decision.schemas import UserSkinContext, ProductNegativeLabel
from annotated_types import Gt, Lt
from functools import cache
from pathlib import Path
import json
from app.service.decision.schema_mappings import (
    PRODUCT_SUITED_FOR_TO_SKIN_TYPE,
    SKIN_TYPE_NEGATIVE_EFFECTS,
    SKIN_TYPE_IRRITATION_MAPPING,
)
from app.service.decision.dataset_queries import DatasetStats
from app.service.decision.dataset_queries import dataset_stats

# Score assesment:
# positive_score: num of concerns product helps with / user skin_concerns
# negative_score: num of negative labels / skin_concerns?
# price_score: beats me tbh...
# rating_score: (num_of_ratings + rating) / (... tutaj scisnac to do  0, 1)
#

# Introduce later on "bias" -> input from user how well product
# helps with skin_concern


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

NORMALIZED_TARGETS_PATH = (
    Path(__file__).resolve().parent / "data" / "normalized-targets.json"
)
POTENTIALLY_IRRITATING_INGREDIENTS = (
    Path(__file__).resolve().parent / "data" / "potentially-irritating-ingredients.json"
)


@cache
def load_irritating_ingredients() -> set[str]:
    raw = json.loads(POTENTIALLY_IRRITATING_INGREDIENTS.read_text(encoding="utf-8"))
    return set(raw)


@cache
def target_map() -> dict[str, str]:
    raw = json.loads(NORMALIZED_TARGETS_PATH.read_text(encoding="utf-8"))
    return {t["original_name"]: t["normalized_name"] for t in raw["normalized_targets"]}


ScoreAnnotation = Annotated[float, Gt(0.0), Lt(1.0)]


class Scores(BaseModel):
    model_config = ConfigDict(frozen=True)

    positive_effect: float = Field(ge=0.0, le=1.0)  # 1 - best
    negative_effect: float = Field(ge=0.0, le=1.0)  # 1 - lowest risk
    # price_effect: float | None = Field(ge=0.0, le=1.0)
    ratings_effect: float | None = Field(ge=0.0, le=1.0)


CRITERIA = tuple(Scores.model_fields.keys())
WEIGHTS = {"positive_effect": 0.5, "negative_effect": 0.3, "ratings_effect": 0.2}


assert len(CRITERIA) == len(WEIGHTS)


def normalize(weights: dict[str, float]) -> dict[str, float]:

    total = sum(weights.values())
    return {name: w / total for name, w in weights.items()}

def parse_targets(raw: str | None) -> set[str]:
    if not raw:
        return set()
    names = (t.strip().lower().replace("-", " ") for t in raw.split(","))
    return {target_map()[n] for n in names if n in target_map()}


def rate_positive_effect(product: Product, concerns: list[str]) -> float:
    if not concerns:
        return 0.0
    matched = parse_targets(product.targets) & set(concerns)
    return len(matched) / len(concerns)

def rate_negative_effect(
    product: Product, ctx: UserSkinContext, negative_labels: set[str]
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

    def irritates(p: Product, ctx: UserSkinContext) -> float:

        if p.concentration_ingredient in load_irritating_ingredients():
            return SKIN_TYPE_IRRITATION_MAPPING.get(ctx.skin_sensitivity, 0.7)

        return 1.0

    good_fit = matches_to_skin(product, ctx)
    fit = 1.0 if good_fit else 0.0

    unsuited = unsuited_for_skin(ctx, negative_labels=negative_labels)
    skin_sensitivity = SKIN_TYPE_IRRITATION_MAPPING[ctx.skin_sensitivity]
    irritation_score = irritates(product, ctx)

    return (fit + unsuited + skin_sensitivity + irritation_score) / 4.0

def rate_product_on_ratings(product: Product, stats: DatasetStats) -> float | None:
    if product.rating is None or product.review_count is None:
        return None
    v, m = product.review_count, stats.prior_weight
    bayes = (v * product.rating + m * stats.rating_mean) / (v + m)
    return (bayes - 1) / 4

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


def build_matrix(
    products: list[Product],
    ctx: UserSkinContext,
    stats: DatasetStats,
    negative_labels: list[ProductNegativeLabel],
) -> np.ndarray:
    rows = []

    for p in products:
        product_labels = {
            item.label
            for item in negative_labels
            if item.product == p
        }

        s = Scores(
            positive_effect=rate_positive_effect(p, ctx.skin_concerns),
            negative_effect=rate_negative_effect(p, ctx, product_labels),
            ratings_effect=rate_product_on_ratings(p, stats),
        )

        row = [
            np.nan if (value := getattr(s, c)) is None else value
            for c in CRITERIA
        ]

        rows.append(row)

    return np.array(rows, dtype=float)


def wsm(scores: np.ndarray, weights: np.ndarray) -> np.ndarray:
    return scores @ weights


def wsm_pipeline(user_input: str):
    client = OpenAI(api_key=settings.open_ai_key)
    ctx = openai_user_skin_context_inference(client, user_input)

    products = [
        p for p in load_products()
        if parse_targets(p.targets) & set(ctx.skin_concerns)
    ]

    products = exclude_negative_products(products, ctx)

    if not products:
        return []

    negative_labels = assign_negative_labels_to_products(
        client=client,
        products=products,
        user_skin_context=ctx,
    )

    matrix = build_matrix(
        products,
        ctx,
        stats,
        negative_labels.mapped,
    )

    weights = np.array([WEIGHTS[c] for c in CRITERIA])
    scores = wsm(np.nan_to_num(matrix, nan=0.0), weights)

    return sorted(
        zip(products, scores),
        key=lambda x: x[1],
        reverse=True,
    )



print(parse_targets("dryness, dehydration"))

TEST_DATA = Path("data/test_data")

def main() -> None:
    client = OpenAI(api_key=settings.open_ai_key)

    users = json.loads(
        (TEST_DATA / "aurelia_user_texts_20.json").read_text()
    )

    expected = {
        item["user_id"]: item
        for item in json.loads(
            (TEST_DATA / "aurelia_user_texts_20_gold.json").read_text()
        )
    }

    for user in users:
        ctx = openai_user_skin_context_inference(client, user["text"])

        predicted = set(ctx.skin_concerns)
        gold = expected[user["user_id"]]

        missing = set(gold["expected_targets"]) - predicted
        forbidden = set(gold["negated_targets"]) & predicted

        print(f"\nPredicted: {predicted}")
        print(f"Expected: {gold['expected_targets']}")
        print(f"Missing: {missing}")
        print(f"Forbidden: {forbidden}")

        stats = DatasetStats(
            rating_mean=4.0,
        )

        user = users[0]

        results = wsm_pipeline(
            user_input=user["text"],
            stats=stats,
        )

        print(f"\nUSER: {user['text']}")
        print("\nTOP 10 RECOMMENDED PRODUCTS:")

        for rank, (product, score) in enumerate(results[:10], start=1):
            print(f"{rank}. {product.brand} - {product.product_name}")
            print(f"   WSM score: {score:.4f}")
            print(f"   Targets: {product.targets}")
            print()
if __name__ == "__main__":
    main()