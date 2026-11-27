from typing import Any

from pydantic import BaseModel
from sqlalchemy import Dialect
from sqlalchemy.types import TypeDecorator
from sqlalchemy.dialects.postgresql import JSONB


class HistoryList(TypeDecorator):
    impl = JSONB
    cache_ok = True

    def __init__(self, model: type[BaseModel]):
        super().__init__()
        self.model = model

    def process_bind_param(
        self, value: list[BaseModel] | None, dialect: Dialect
    ) -> Any:
        if value is None:
            return None
        return [item.model_dump(mode="json") for item in value]

    def process_result_value(
        self, value: Any, dialect: Dialect
    ) -> list[BaseModel] | None:
        if value is None:
            return None
        return [self.model.model_validate(item) for item in value]
