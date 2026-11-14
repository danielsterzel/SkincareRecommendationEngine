from app.service.decision.dataset_schemas import SuitedForValue
from app.service.decision.schemas import SkinType

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
