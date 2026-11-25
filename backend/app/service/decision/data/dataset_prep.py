import re
import uuid
from pathlib import Path

import pandas as pd

# Rows have no unique natural key (some products are duplicated), so ids are
# carried over by row position. These columns guard against a reordered sheet.
ID_GUARD_COLUMNS = ["brand", "product-name", "source-url"]


def attach_stable_ids(df: pd.DataFrame, previous_path: Path) -> pd.DataFrame:
    """Reuse product ids from the previous parquet so regenerating keeps them stable."""
    if not previous_path.exists():
        return df.assign(id=[str(uuid.uuid4()) for _ in range(len(df))])

    previous = pd.read_parquet(previous_path)
    if "id" not in previous.columns:
        raise RuntimeError(f"{previous_path.name} has no 'id' column to carry over")

    same_rows = (
        len(previous) == len(df)
        and (
            previous[ID_GUARD_COLUMNS].fillna("").to_numpy()
            == df[ID_GUARD_COLUMNS].fillna("").to_numpy()
        ).all()
    )
    if not same_rows:
        raise RuntimeError(
            "Source rows changed (added, removed or reordered), so product ids "
            "can't be carried over by position. Map them explicitly first."
        )

    return df.assign(id=previous["id"].to_numpy())


def remap_df_names(df: pd.DataFrame) -> pd.DataFrame:
    df = df.rename(
        columns={
            "product-name": "product_name",
            "sub-category": "sub_category",
            "application-area": "application_area",
            "size[ml]": "size",
            "price[euro]": "price",
            "source-url": "source_url",
            "last-verified": "last_verified",
            "concentration-ingredient": "concentration_ingredient",
            "sutied-for": "suited_for",
            "review-count": "review_count",
        }
    )
    return df


DATA_DIR = Path(__file__).resolve().parent
df = pd.read_excel(DATA_DIR / "aurelia-skincare-complete.xlsx")

df["review-count"] = df["review-count"].astype("Int64")
df["last-verified"] = pd.to_datetime(df["last-verified"], errors="coerce").dt.strftime(
    "%d-%m-%Y"
)
# Commas between two digits belong to chemical names (e.g. "1,2-hexanediol"),
# so only split on commas that don't have a digit on both sides.
INGREDIENT_SEPARATOR = r"(?<!\d),|,(?!\d)"

# Some source lists use other separators instead of commas:
#   "•" / "●" bullets, and ". " (avene lists).
# ". " is skipped where the dot is part of a name or an annotation:
#   "fd&c yellow no. 6", "ext. violet 2", "(fil. z70034188/1)",
#   "silica. fil 1822.v00", "benzyl alcohol. [il176v8]", "limonene. (182/036)".
BULLET_SEPARATOR = r"\s*[•●]\s*"
DOT_SEPARATOR = r"(?<!\bno)(?<!\bext)\.\s+(?![\[(])(?!fil[\s.])(?!z\d)"
# " - " is a separator only in lists that really use it ("aqua / water - propanediol - ...").
# Lists with 1-2 hits are broken spaced-out names like "bi s - e t h y lhe ...".
DASH_SEPARATOR = " - "
MIN_DASH_SEPARATORS = 3


def normalize_separators(text: str) -> str:
    """Rewrite the odd separators to commas, so a single split handles every list."""
    if not isinstance(text, str):
        return text
    text = re.sub(BULLET_SEPARATOR, ", ", text)
    text = re.sub(DOT_SEPARATOR, ", ", text)
    if text.count(DASH_SEPARATOR) >= MIN_DASH_SEPARATORS:
        text = text.replace(DASH_SEPARATOR, ", ")
    return text


df["ingredients"] = (
    df["ingredients"]
    .str.lower()
    .str.replace(
        "1, 2-hexanediol", "1,2-hexanediol", regex=False
    )  # typo in source data
    .apply(normalize_separators)
    .str.split(INGREDIENT_SEPARATOR, regex=True)
    .apply(
        lambda items: (
            [s.strip().rstrip(".").strip() for s in items if s.strip(" .")]
            if isinstance(items, list)
            else []
        )
    )
)

df["ph"] = (
    df["ph"]
    .str.replace(",", ".")
    .str.split("-")
    .apply(
        lambda values: tuple(map(float, values)) if isinstance(values, list) else None
    )
)


string_cols = df.select_dtypes(include=["str", "string"]).columns

df[string_cols] = df[string_cols].apply(lambda col: col.str.lower())
df["features"] = df["features"].str.split(",")

print(df.head(5))
print(list(df.columns))
print(df.dtypes)

print("\n\n")

cols = df.columns

for col in cols:
    print(f"col: {col}\nhead: \n{df[col].sample(5, random_state=42)}\n")

#
# print(df[df['concentration'] > 1.0])
# print(df[df['concentration'] < 0.0])

OUTPUT_PATH = DATA_DIR / "skincare-products-clean.parquet"
df = attach_stable_ids(df, OUTPUT_PATH)
df.to_parquet(OUTPUT_PATH, index=False)

word_dictionary = (
    df["targets"]
    .dropna()
    .str.lower()
    .str.split(",")
    .explode()
    .str.strip()
    .str.replace("-", " ", regex=False)
    .unique()
    .tolist()
)


print(word_dictionary)

#
# client = OpenAI(api_key=settings.open_ai_key)
#
# response = client.responses.parse(
#     model=settings.open_ai_model,
#     input=json.dumps(word_dictionary),
#     instructions="""
#         You are a dermatology terminology normalization assistant
#         working on Aurelia, a personalized skincare recommendation system.
#
#         Your task is to analyze a list of raw skincare product targets
#         and create a consistent, clinically meaningful taxonomy.
#
#         For each input term:
#
#         1. Correct spelling mistakes and normalize terminology.
#         2. Identify synonyms and semantically equivalent expressions.
#         3. Map equivalent terms to the same canonical concept.
#         4. Preserve clinically meaningful distinctions.
#         5. Classify each concept into one of these categories:
#            - SKIN_CONCERN
#            - SKIN_GOAL
#            - PRODUCT_FUNCTION
#            - OTHER
#
#         Normalization rules:
#         - Use lowercase snake_case for canonical identifiers.
#         - Use clear, concise English labels.
#         - Do not invent conditions or effects not present in the input.
#         - Do not automatically equate blemishes with acne.
#         - Keep dry skin and dehydrated skin distinct.
#         - Distinguish skin concerns from product functions.
#         - Preserve the original input term for traceability.
#         - Reuse the same canonical identifier for equivalent terms.
#         - If a term is ambiguous, preserve its meaning and flag it
#           for review rather than guessing.
#
#         Return a mapping for every unique input term.
#         """,
#     text_format=NormalizedSkinOutput,
# )
#
# normalized_output = response.output_parsed
#
# with open("normalized-targets.json", "w") as f:
#     json.dump(normalized_output.model_dump(), f, indent=2)

print(df.columns)
