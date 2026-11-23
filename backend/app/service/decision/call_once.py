import pandas as pd
from openai import OpenAI

from app.core.settings import settings
from app.service.decision.llm_utils import expand_allergens_to_inci_terms
import json
from pathlib import Path
from functools import cache
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

ACTIVE_INGREDIENTS_PATH = Path(__file__).resolve().parent / "data" / "active-ingredients-register.json"

@cache
def load_active_ingredients():
    """normalized to INCI labels"""
    raw_json = json.loads(ACTIVE_INGREDIENTS_PATH.read_text(encoding='utf-8'))
    return list(raw_json['active_ingredients'])

def main() -> None:
    # client = OpenAI(api_key=settings.open_ai_key)
    # result = {a: expand_allergens_to_inci_terms(client, allergen=a) for a in ALLERGENS}
    #
    # DATA_PATH.write_text(
    #     json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
    # )
    # print(f"Saved {len(result)} allergens to {DATA_PATH}")
    df = pd.read_parquet("data/skincare-products-clean.parquet")
    # print(df["suited-for"].dtype)
    # arr = df["suited-for"].dropna().str.split(",").explode().unique()
    # print(arr)
    print("================ concentration uniques ================")
    print(df["concentration-ingredient"].unique())
    print('\n\n')
    print("================ INCI ================")
    print(df['inci'])
    print('\n\n')
    print("================ Ingredients ================")
    print(df['ingredients'])

    active_ingredients = set(load_active_ingredients())

    ingredients = df["ingredients"].explode()

    matches = ingredients[ingredients.isin(active_ingredients)]
    print("================ Matches ================")
    product_matches = (
        df["ingredients"]
        .explode()
        .isin(active_ingredients)
        .groupby(level=0)
        .any()
        .sum()
    )
    uniques = (df['ingredients'].explode().dropna().str.strip().str.lower().unique())
    print(f"Unique ingredients count: {len(uniques)}")
    Path("data/unique_ingredients.json").write_text(
        json.dumps(sorted(uniques), indent=2, ensure_ascii=False),
        encoding='utf-8'
    )

    print(f"total matches: {product_matches}")

    # print(df['targets'].head(5))


if __name__ == "__main__":
    main()
