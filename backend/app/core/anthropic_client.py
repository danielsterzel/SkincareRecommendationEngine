from functools import lru_cache

from typing import Annotated
from fastapi import Depends
from anthropic import Anthropic
from app.core.settings import settings


@lru_cache
def get_anthropic_client() -> Anthropic:
    return Anthropic(api_key=settings.claude_api_key, timeout=30, max_retries=2)


AnthropicClient = Annotated[Anthropic, Depends(get_anthropic_client)]
