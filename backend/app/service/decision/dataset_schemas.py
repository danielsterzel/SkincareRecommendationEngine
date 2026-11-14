from decimal import Decimal
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, field_validator, computed_field, Field
from typing import Literal
from uuid import UUID
from datetime import datetime
from app.service.decision.domain_types import OptString


class NormalizedSkinTarget(BaseModel):
    original_name: str
    normalized_name: str
    category: Literal["SKIN_CONCERN", "SKIN_GOAL", "PRODUCT_FUNCTION", "OTHER"]
    needs_review: bool


class NormalizedSkinOutput(BaseModel):
    normalized_targets: list[NormalizedSkinTarget]


# ['brand', 'product-name', 'ingredients', 'category', 'sub-category', 'application-area',
#  'inci', 'size[ml]', 'price[euro]', 'source-url', 'last-verified', 'features', 'concentration-ingredient',
#  'concentration', 'targets', 'sutied-for', 'ph', 'rating', 'review-count']

# print(df['product-name'].isna().any())
# print(df['product-name'].str.strip().eq("").fillna(False))

# print(df['ingredients'].isna().any())
# print(df['ingredients'].apply(lambda l: isinstance(l, list) and len(l) == 0).any())

# print(df['category'].isna().any())
# print(df['category'].isna().sum())
# print(df['sub-category'].isna().sum())
# print(df['application-area'].isna().sum())

# print(df['inci'].isna().sum())
# print(df['size[ml]'].isna().sum())
# print(df['price[euro]'].isna().sum())
# print(df['source-url'].isna().sum())
# print(df['targets'].dtype)

# <ArrowStringArray>
# [  'all-skin-types',        'oily-skin',         'dry-skin',
#    'all-hair-types',   'sensitive-skin', 'combination-skin']
# Length: 6, dtype: str


class SuitedForValue(StrEnum):
    ALL_SKIN_TYPES = "all-skin-types"
    OILY_SKIN = "oily-skin"
    DRY_SKIN = "dry-skin"
    ALL_HAIR_TYPES = "all-hair-types"
    SENSITIVE_SKIN = "sensitive-skin"
    COMBINATION_SKIN = "combination-skin"


class Product(BaseModel):
    model_config = ConfigDict(frozen=True)  # do not modify fields
    id: UUID
    brand: str
    product_name: str  # not null
    ingredients: list[str] | None
    category: OptString = None  # some nulls 172 out of 1930 records
    sub_category: OptString = None  # 751 nulls out of 1930
    application_area: OptString = None  # 657 nulls
    inci: OptString = None  # 1054 nulls...
    size: float | None = None  # in ml, 503 nulls
    price: Decimal | None = None  # 1712 nulls
    source_url: str  # no nulls
    last_verified: datetime | None = None
    features: list[str] | None = None
    concentration_ingredient: OptString = None
    concentration: float | None = None
    targets: OptString = None
    suited_for: set[SuitedForValue] = Field(default_factory=set)
    ph: list[float] | None = None
    rating: float | None = None
    review_count: int | None = None

    @computed_field
    @property
    def ingredients_unknown(self) -> bool:
        return self.ingredients is None

    @field_validator("ingredients", mode="after")
    @classmethod
    def empty_means_unknown(cls, v):
        if v is None:
            return None
        return [t.rstrip(".").strip() for t in v] or None

    @field_validator("last_verified", mode="before")
    @classmethod
    def parse_last_verified(cls, v):
        if isinstance(v, str) and len(v) == 10 and v[2] == "-" and v[5] == "-":
            return datetime.strptime(v, "%d-%m-%Y")
        return v

    @field_validator("suited_for", mode="before")
    @classmethod
    def parse_suited_for(cls, v):
        if v is None:
            return set()
        if isinstance(v, str):
            return {s.strip() for s in v.split(",") if s.strip()}
        return v
