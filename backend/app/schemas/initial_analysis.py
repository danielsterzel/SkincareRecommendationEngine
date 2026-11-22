from typing import Annotated, Literal

from pydantic import Field, ConfigDict
from app.schemas.configured_schema import ConfiguredSchema
from pydantic.alias_generators import to_camel

SkinProblemMock = Literal["redness", "dryness", "acne", "dark-spots", "clogged-pores", "other"]
SkinType = Literal["dry", "normal", "combination", "oily", "not-sure"]


class MockProductSchema(ConfiguredSchema):
    """This is not the dataset Product model, rather the app Product representation"""

    brand: str
    name: str
    wsm_score: float = Field(le=1.0, gt=0.0)


class CurrentRoutineItem(ConfiguredSchema):
    brand: str | None = Field(description="Brand if mentioned, else None")
    product_name: str | None = Field(description="Product name if mentioned else None")
    active_ingredient: str | None = Field(description="Key active ingredient like 'retinol', 'niacinamide' and other similar ones else None")
    time_of_day: Literal['morning', 'evening', 'both', 'unknown'] = Field(description="What time of day the cosmetic is used")

class QuickSummary(ConfiguredSchema):
    identified_concerns: list[str]
    goals: list[str]
    avoid: list[str]
    current_routine: list[CurrentRoutineItem]
    note: str



class UserSkinInformationInput(ConfiguredSchema):
    model_config = ConfigDict(
        from_attributes=True,
        frozen=True,
        alias_generator=to_camel,
        validate_by_alias=True,
        validate_by_name=True,
    )

    concerns: list[SkinProblemMock]
    skin_type: SkinType | None = None
    additional_detail: str | None = Field(default="")


class StatusEvent(ConfiguredSchema):
    type: Literal["status"] = "status"
    message: str


class ContextEvent(ConfiguredSchema):
    type: Literal["context"] = "context"
    message: str


class NegativeEffectsEvent(ConfiguredSchema):
    type: Literal["negative_effects"] = "negative_effects"
    message: str


class CompletedEvent(ConfiguredSchema):
    type: Literal["completed"] = "completed"
    message: str
    data: list[MockProductSchema]


AnalysisEvent = Annotated[
    StatusEvent | ContextEvent | NegativeEffectsEvent | CompletedEvent,
    Field(discriminator="type"),
]
