import json

from anthropic import Anthropic
from pydantic import BaseModel, Field

from app.domain.skin import SkinProblemOption, SkinTypeOption
from app.core.settings import settings
from pathlib import Path
from typing import get_args
import random
from uuid import UUID, uuid4

from app.service.decision.llm_utils import parse_llm

GENERATE_DATA_PROMPT = (
    Path(__file__).resolve().parent / "prompts" / "generate_data_prompt.txt"
).read_text(encoding="utf-8")


POSSIBLE_CONCERN_VALUES = get_args(SkinProblemOption)
POSSIBLE_SKIN_TYPE = get_args(SkinTypeOption)

DATA_SAVE_PATH = Path(__file__).resolve().parent / "generated_user_concerns.json"


class GeneratedSkinConcernData(BaseModel):
    user_id: UUID = Field(default_factory=uuid4)
    text: str
    concerns: list[SkinProblemOption]
    skin_type: SkinTypeOption | None


class GeneratedBatch(BaseModel):
    items: list[GeneratedSkinConcernData]


class GenerateDataNode(BaseModel):
    skin_type: SkinTypeOption | None
    concerns: tuple[SkinProblemOption, ...]


class GenerateDataInput(BaseModel):
    nodes: dict[int, GenerateDataNode]


def generate(limit: int = 500, batch_size: int = 10) -> None:
    client = Anthropic(api_key=settings.claude_api_key)

    input_ = {}

    for event in range(limit):
        skin_concerns = random.sample(
            POSSIBLE_CONCERN_VALUES, k=random.randint(0, len(POSSIBLE_CONCERN_VALUES))
        )

        skin_type = random.choice((*POSSIBLE_SKIN_TYPE, None))

        input_[event] = GenerateDataNode(
            skin_type=skin_type, concerns=tuple(skin_concerns)
        )

    results = []
    keys = list(input_)
    for i in range(0, len(keys), batch_size):
        batch = GenerateDataInput(
            nodes={k: input_[k] for k in keys[i : i + batch_size]}
        )
        response = parse_llm(
            client,
            model="claude-sonnet-5-5",
            input_=batch.model_dump_json(),
            instructions=GENERATE_DATA_PROMPT,
            text_format=GeneratedBatch,
        )
        results.extend(item.model_dump(mode="json") for item in response.items)

    DATA_SAVE_PATH.write_text(
        json.dumps({"nodes": results}, ensure_ascii=False, indent=2), encoding="utf-8"
    )


if __name__ == "__main__":
    generate()
