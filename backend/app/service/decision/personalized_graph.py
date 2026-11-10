from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, Field

SkinTargetKey = Literal[
    "advanced_signs_of_aging",
    "antioxidant_support",
    "barrier_support",
    "blemishes",
    "cleansing",
    "crow's_feet",
    "dark_circles",
    "dehydration",
    "dryness",
    "dullness",
    "early_signs_of_aging",
    "hair",
    "hyperpigmentation",
    "lip_plumpness",
    "puffiness",
    "redness",
    "signs_of_aging",
    "signs_of_congestion",
    "texture_irregularities",
    "uneven_skin_tone",
    "uv_protection",
    "visible_shine",
    "wrinkles",
]

Weight = Annotated[float, Field(ge=0, le=1)]


class PersonalGraph(BaseModel):
    """
    Represents the personalized state of a single user.

    Stores user-specific skin concerns and their associated weights.
    Product recommendations are retrieved from the Global Knowledge Graph
    in Neo4j based on these concerns.
    """

    user_id: UUID
    concerns: dict[SkinTargetKey, Weight] = Field(default_factory=dict)
