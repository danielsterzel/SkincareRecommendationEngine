from app.service.decision.dataset_schemas import SuitedForValue
from app.service.decision.schemas import SkinType, SensitivityLevels

PRODUCT_SUITED_FOR_TO_SKIN_TYPE: dict[SuitedForValue, set[SkinType]] = {
    SuitedForValue.ALL_SKIN_TYPES: set(SkinType),
    SuitedForValue.DRY_SKIN: {SkinType.DRY},
    SuitedForValue.OILY_SKIN: {SkinType.OILY},
    SuitedForValue.COMBINATION_SKIN: {SkinType.COMBINATION},
    SuitedForValue.SENSITIVE_SKIN: set(SkinType),
}

SKIN_TYPE_NEGATIVE_EFFECTS: dict[SkinType, set[str]] = {
    SkinType.DRY: {"dryness", "irritation"},
    SkinType.OILY: {"comedogenicity"},
    SkinType.COMBINATION: {"dryness", "comedogenicity"},
    SkinType.NORMAL: set(),
}

SKIN_TYPE_IRRITATION_MAPPING = {
    SensitivityLevels.VERY_HIGH: 0.0,
    SensitivityLevels.HIGH: 0.25,
    SensitivityLevels.MILD: 0.5,
    SensitivityLevels.LOW: 0.75,
    SensitivityLevels.UNKNOWN: 0.5,
}


# later map active ingredients typical concentrations
RETINOL_STRENGTH_MAPPING = {}

AZALEIC_ACID_MAPPING = {}
