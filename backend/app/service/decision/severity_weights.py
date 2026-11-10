from enum import Enum


class SeverityWeights(Enum):
    LOW = -0.1
    MODERATE = -0.3
    HIGH = -0.6
    UNKNOWN = None
