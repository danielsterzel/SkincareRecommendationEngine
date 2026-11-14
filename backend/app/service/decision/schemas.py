from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, Field
from app.service.decision.domain_types import OptString, SeverityLabels

from app.service.decision.dataset_schemas import Product

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
SkinConcern = Literal[
    "redness",
    "dryness",
    "barrier_support",
    "blemishes",
    "hyperpigmentation",
    "uneven_skin_tone",
    "uv_protection",
    "signs_of_congestion",
    "visible_shine",
    "crow's_feet",
    "dehydration",
    "early_signs_of_aging",
    "advanced_signs_of_aging",
    "dark_circles",
    "puffiness",
    "dullness",
    "texture_irregularities",
    "antioxidant_support",
    "cleansing",
    "wrinkles",
    "lip_plumpness",
    "hair",
]

class ProductNegativeLabel(BaseModel):
    product: Product
    label: Literal[
        "dryness",
        "redness",
        "irritation",
        "comedogenicity",
        "allergic_reaction",
        "photosensitivity",
        "pigmentation_changes",
        "other",
        "unknown",
    ]
    reasoning: str
    evidence_source: OptString = None


class ProductNegativeLabelModelOutput(BaseModel):
    mapped: list[ProductNegativeLabel]


class IdentifiedSkinConcerns(BaseModel):
    skin_concerns: list[str]


class PreviousReactionToProduct(BaseModel):
    brand: OptString = None
    product_name: OptString = None
    concentration_ingredient: OptString = None
    concentration: float | None = None
    suited_for: OptString = None
    ph: list[float] | None = None
    source_url: OptString
    effect: str
    severity: SeverityLabels
    original_text: str


class AllergenInciTerms(BaseModel):
    allergen: str
    inci_terms: list[str]


class SkinType(StrEnum):
    OILY = "oily"
    COMBINATION = "combination"
    NORMAL = "normal"
    DRY = "dry"


class SensitivityLevels(StrEnum):
    VERY_HIGH = "very_high"
    HIGH = "high"
    MILD = "mild"
    LOW = "low"
    UNKNOWN = "unknown"


class UserSkinContext(BaseModel):
    skin_concerns: list[SkinConcern]
    allergens: list[AllergenInciTerms]
    skin_sensitivity: SensitivityLevels
    previous_reactions_to_products: list[PreviousReactionToProduct] = Field(
        default_factory=list
    )
    skin_type: SkinType | None = None
