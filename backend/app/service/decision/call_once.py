import pandas as pd
from openai import OpenAI

from app.core.settings import settings
from app.service.decision.llm_utils import expand_allergens_to_inci_terms
import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent / "data" / "allergen_inci_terms.json"

client = OpenAI(api_key=settings.open_ai_key)

ALLERGENS = [
    "gluten",
    "nuts",
    "peanut",
    "soy",
    "milk",
    "egg",
    "lanolin",
    "fragrance",
    "essential oils",
    "propolis",
    "balsam of peru",
    "methylisothiazolinone",
    "formaldehyde releasers",
    "sulfates",
    "parabens",
]


def main() -> None:
    # client = OpenAI(api_key=settings.open_ai_key)
    # result = {a: expand_allergens_to_inci_terms(client, allergen=a) for a in ALLERGENS}
    #
    # DATA_PATH.write_text(
    #     json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
    # )
    # print(f"Saved {len(result)} allergens to {DATA_PATH}")
    df = pd.read_parquet("data/skincare-products-clean.parquet")
    print(df["suited-for"].dtype)
    arr = df["suited-for"].dropna().str.split(",").explode().unique()
    print(arr)
    # print(df['targets'].head(5))


if __name__ == "__main__":
    main()
