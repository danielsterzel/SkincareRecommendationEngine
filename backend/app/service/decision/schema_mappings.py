from app.service.decision.dataset_schemas import SuitedForValue
from typing import get_args
from app.domain.skin import SensitivityLevel, SkinType

PRODUCT_SUITED_FOR_TO_SKIN_TYPE: dict[SuitedForValue, set[SkinType]] = {
    SuitedForValue.ALL_SKIN_TYPES: set(get_args(SkinType)),
    SuitedForValue.DRY_SKIN: {"dry"},
    SuitedForValue.OILY_SKIN: {"oily"},
    SuitedForValue.COMBINATION_SKIN: {"combination"},
    SuitedForValue.SENSITIVE_SKIN: set(get_args(SkinType)),
}

SKIN_TYPE_NEGATIVE_EFFECTS: dict[SkinType, set[str]] = {
    "dry": {"dryness", "irritation"},
    "oily": {"comedogenicity"},
    "combination": {"dryness", "comedogenicity"},
    "normal": set(),
}

SKIN_TYPE_IRRITATION_MAPPING: dict[SensitivityLevel, float] = {
    "very_high": 0.0,
    "high": 0.25,
    "mild": 0.5,
    "low": 0.75,
    "unknown": 0.5,
}


# later map active ingredients typical concentrations
RETINOL_STRENGTH_MAPPING = {}

AZALEIC_ACID_MAPPING = {}
