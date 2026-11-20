from typing import Literal

from pydantic import Field, ConfigDict
from app.schemas.configured_schema import ConfiguredSchema
from pydantic.alias_generators import to_camel

SkinProblemMock = Literal["redness", "dryness", "acne", "dark-spots", "clogged-pores"]
SkinType = Literal["dry", "normal", "combination", "oily"]


class MockProductSchema(ConfiguredSchema):
    """This is not the dataset Product model, rather the app Product representation"""

    brand: str
    name: str
    wsm_score: float = Field(le=1.0, gt=0.0)


class SkinConcerns(ConfiguredSchema):
    concerns: list[SkinProblemMock]


class UserSkinInformationInput(ConfiguredSchema):
    model_config = ConfigDict(
        from_attributes=True,
        frozen=True,
        alias_generator=to_camel,
        validate_by_alias=True,
        validate_by_name=True,
    )

    concerns: SkinConcerns
    skin_type: SkinType | None = None
    additional_detail: str | None = Field(default="")
