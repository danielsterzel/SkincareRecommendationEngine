from functools import lru_cache
from typing import Annotated

from fastapi import Depends
from openai import OpenAI

from app.core.settings import settings


@lru_cache
def get_openai_client() -> OpenAI:
    return OpenAI(api_key=settings.open_ai_key, timeout=30, max_retries=2)


OpenAICLient = Annotated[OpenAI, Depends(get_openai_client)]
