from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ARRAY, JSONB, TEXT
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, ForeignKey, Enum, DateTime, func
from app.db.base import Base
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Any, get_args
from app.domain.skin import (
    SkinType,
    SkinTone,
    SkinTexture,
    SensitivityLevel,
)
from datetime import datetime
from app.models.history_decorator import HistoryList
from app.domain.skin_profile import SkinHistoryEntry

if TYPE_CHECKING:
    from app.models.user import User


# TODO:
#  - Allergens from Eu that are actual ingredient allergens and not fragrance allergens
#  -json category: allergens INCI,
#  -AllergenCategory
#  -Allergen key


class SkinProfile(Base):
    __tablename__ = "skin_profiles"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey(column="users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    skin_type: Mapped[SkinType | None] = mapped_column(
        Enum(
            *get_args(SkinType),
            name="skin_type",
            native_enum=False,
            create_constraint=True
        ),
        nullable=True,
    )
    skin_tone: Mapped[SkinTone | None] = mapped_column(
        Enum(
            *get_args(SkinTone),
            name="skin_tone",
            native_enum=False,
            create_constraint=True
        ),
        nullable=True,
    )
    skin_texture: Mapped[SkinTexture | None] = mapped_column(
        Enum(
            *get_args(SkinTexture),
            name="skin_texture",
            native_enum=False,
            create_constraint=True
        ),
        nullable=True,
    )
    skin_sensitivity: Mapped[SensitivityLevel] = mapped_column(
        Enum(
            *get_args(SensitivityLevel),
            name="skin_sensitivity",
            native_enum=False,
            create_constraint=True
        ),
        nullable=False,
        default="unknown",
    )
    allergic_to: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=False, default=list
    )
    skin_concerns: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=False, default=list
    )
    skin_goals: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=False, default=list
    )
    product_reactions: Mapped[list[dict[str, Any]]] = mapped_column(
        MutableList.as_mutable(JSONB), nullable=False, default=list
    )
    history: Mapped[list[SkinHistoryEntry]] = mapped_column(
        MutableList.as_mutable(HistoryList(SkinHistoryEntry)),
        nullable=False,
        default=list,
        deferred=True,
    )
    summary: Mapped[str | None] = mapped_column(TEXT, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["User"] = relationship(back_populates="skin_profile")
