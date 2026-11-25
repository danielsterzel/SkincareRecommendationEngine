from enum import StrEnum
from pydantic import BaseModel, Field
from typing import Mapping, Annotated

# https://skintypesolutions.com/blogs/skincare/retinol-percentages

# Cerave product: Resurfacing Retinol Serum with Ceramides & Niacinamide
# has incorrect ingredient list: does not contain retinol in it
# which becomes a problem because my dataset...

RetinolConcentration = Annotated[float, Field(ge=0.01, le=1.0)]


class RetinolType(StrEnum):
    RETINYL_PALMITE = "retinyl_palmite"
    RETINOL = "retinol"
    RETINALDEHYDE = "retinaldehyde"
    RETINAL_ACETATE = ""


RetinolTypeToConcentration: Mapping[RetinolType, RetinolConcentration] = {}
