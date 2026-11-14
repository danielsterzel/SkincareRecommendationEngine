class SeverityLabelWeightsException(ValueError):
    """Raised when SeverityLabels and negative_effect_labels have different lengths"""


class LLMOutputParseException(ValueError):
    """Raised when llm returns invalid parsed output"""
