from app.domain.skin_profile import SkinHistoryEntry
from app.schemas.configured_schema import ConfiguredSchema
from app.domain.skin import (
    SkinType,
    SkinTone,
    SkinTexture,
    SkinConcern,
    SensitivityLevel,
)
from app.service.decision.schemas import PreviousReactionToProduct
from datetime import datetime


class SkinProfileResponse(ConfiguredSchema):
    skin_type: SkinType | None
    skin_tone: SkinTone | None
    skin_texture: SkinTexture | None
    skin_sensitivity: SensitivityLevel
    allergic_to: list[str]
    skin_concerns: list[SkinConcern]
    skin_goals: list[str]
    product_reactions: list[PreviousReactionToProduct]
    summary: str | None
    created_at: datetime
    updated_at: datetime


class SkinProfileHistoryResponse(ConfiguredSchema):
    history: list[SkinHistoryEntry]
