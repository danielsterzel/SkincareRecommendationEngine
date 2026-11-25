import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from openai import OpenAI

from app.core.settings import settings
from app.service.decision.domain_exceptions import LLMOutputParseException
from app.service.decision.llm_utils import _load_prompt, _parse_with_usage
from app.service.decision.schemas import UserSkinContext

DATA = Path(__file__).resolve().parent / "generated_user_concerns.json"
BENCHMARK = Path(__file__).resolve().parent / "benchmark_gpt_5_4_mini.jsonl"


def benchmark(limit: int | None = None, workers: int = 8) -> None:
    client = OpenAI(api_key=settings.open_ai_key)
    instructions = _load_prompt("prompt_user_skin_context.txt")
    nodes = json.loads(DATA.read_text(encoding="utf-8"))["nodes"][:limit]

    def run(node: dict) -> dict:
        try:
            call = _parse_with_usage(
                client,
                model=settings.open_ai_model,
                input_=node["text"],
                instructions=instructions,
                text_format=UserSkinContext,
            )
        except LLMOutputParseException as e:
            return {**node, "output": None, "error": str(e)}
        return {
            **node,
            "output": call.parsed.model_dump(mode="json"),
            "model": call.model,
            "input_tokens": call.input_tokens,
            "output_tokens": call.output_tokens,
            "latency_ms": call.latency_ms,
        }

    with BENCHMARK.open("w", encoding="utf-8") as f, ThreadPoolExecutor(workers) as pool:
        for i, row in enumerate(pool.map(run, nodes), start=1):
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
            f.flush()
            print(f"{i}/{len(nodes)}")


if __name__ == "__main__":
    benchmark()
