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

LIMIT = 20
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


def mean(values: list[float]) -> float | None:
    return round(sum(values) / len(values), 2) if values else None


def summarize(results: list[dict]) -> dict:
    ok = [r for r in results if "error" not in r]
    extraction_scores = [r["extraction"]["result"]["percent_match"] for r in ok]
    product_scores = [
        p["percent_match"]
        for r in ok
        if r["products"]
        for p in r["products"]["result"]["products"]
    ]
    return {
        "cases_total": len(results),
        "cases_failed": len(results) - len(ok),
        "extraction_avg_percent_match": mean(extraction_scores),
        "products_avg_percent_match": mean(product_scores),
        "products_count": len(product_scores),
    }


def save(out: Path, results: list[dict]) -> None:
    payload = {"summary": summarize(results), "cases": results}
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


async def main() -> None:
    openai = get_openai_client()
    judge = ClaudeJudge(client=Anthropic(api_key=settings.claude_api_key))
    users = json.loads(TEST_DATA.read_text(encoding="utf-8"))[:LIMIT]
    results = []

    RESULTS_DIR.mkdir(exist_ok=True)
    out = RESULTS_DIR / f"judgement_{datetime.now():%Y%m%d_%H%M%S}.json"

    for i, user in enumerate(users, start=1):
        print(f"\n{'=' * 60}\nCASE {i}/{len(users)}\n{user['text']}\n{'=' * 60}")

        try:
            user_input = UserSkinInformationInput(
                concerns=["other"], additional_detail=user["text"]
            )
            ctx = openai_user_skin_context_inference(
                openai, user_input.model_dump_json()
            )
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
        except Exception as e:
            print(f"\n!!! CASE {i} FAILED: {type(e).__name__}: {e}")
            results.append(
                {
                    "user_id": user["user_id"],
                    "text": user["text"],
                    "error": f"{type(e).__name__}: {e}",
                }
            )

        save(out, results)

    print(f"\nSUMMARY: {json.dumps(summarize(results), indent=2)}")
    print(f"Saved to {out}")


if __name__ == "__main__":
    asyncio.run(main())
