from datetime import datetime

from pydantic import ConfigDict

from app.domain.skin import SkinConcern
from app.schemas.configured_schema import ConfiguredSchema


class SkinHistoryEntry(ConfiguredSchema):
    model_config = ConfigDict(**ConfiguredSchema.model_config, frozen=True)

    recorded_at: datetime
    skin_concerns: tuple[SkinConcern, ...]
    skin_goals: tuple[str, ...]
