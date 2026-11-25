import asyncio
import json
from datetime import datetime
from pathlib import Path

from anthropic import Anthropic

from app.core.openai_client import get_openai_client
from app.core.settings import settings
from app.schemas.initial_analysis import UserSkinInformationInput
from app.service.decision.llm_utils import openai_user_skin_context_inference
from app.service.judge.judgement import ClaudeJudge, JudgeRun, pair_context_input

LIMIT = 3
TEST_DATA = (
    Path(__file__).resolve().parent.parent
    / "decision"
    / "data"
    / "test_data"
    / "aurelia_user_texts_20.json"
)
RESULTS_DIR = Path(__file__).resolve().parent / "results"


def print_run(title: str, run: JudgeRun) -> None:
    print(f"\n--- {title} ---")
    print(
        f"model: {run.model} | tokens: {run.input_tokens} in / {run.output_tokens} out"
        f" | latency: {run.latency_ms:.0f} ms"
    )
    print(json.dumps(run.result.model_dump(), indent=2, ensure_ascii=False))


async def main() -> None:
    openai = get_openai_client()
    judge = ClaudeJudge(client=Anthropic(api_key=settings.claude_api_key))
    users = json.loads(TEST_DATA.read_text(encoding="utf-8"))[:LIMIT]
    results = []

    for i, user in enumerate(users, start=1):
        print(f"\n{'=' * 60}\nCASE {i}/{len(users)}\n{user['text']}\n{'=' * 60}")

        user_input = UserSkinInformationInput(
            concerns=["other"], additional_detail=user["text"]
        )
        ctx = openai_user_skin_context_inference(openai, user_input.model_dump_json())
        case = pair_context_input(ctx, user_input)
        print("\n--- MAPPING ---")
        print(case.model_dump_json(indent=2, exclude_none=True))

        extraction = judge.judge_extraction(case)
        print_run("EXTRACTION", extraction)

        products = await judge.judge_products(user_input, case, openai)
        if products:
            print_run("PRODUCTS", products)

        results.append(
            {
                "user_id": user["user_id"],
                "text": user["text"],
                "mapping": case.model_dump(exclude_none=True),
                "extraction": extraction.model_dump(),
                "products": products.model_dump() if products else None,
            }
        )

    RESULTS_DIR.mkdir(exist_ok=True)
    out = RESULTS_DIR / f"judgement_{datetime.now():%Y%m%d_%H%M%S}.json"
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nSaved to {out}")


if __name__ == "__main__":
    asyncio.run(main())
