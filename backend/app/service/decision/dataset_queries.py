import json
from functools import cache
import pandas as pd
from pathlib import Path

from collections import defaultdict
from app.service.decision.dataset_schemas import Product
from uuid import UUID
from types import MappingProxyType
from pydantic import BaseModel, ConfigDict
from statistics import median

ALLERGENS_PATH = Path(__file__).resolve().parent / "data" / "allergen_inci_terms.json"

DATASET_PATH = (
    Path(__file__).resolve().parent / "data" / "skincare-products-clean.parquet"
)

NORM = lambda s: s.strip().lower()


class DatasetStats(BaseModel):
    model_config = ConfigDict(frozen=True)
    rating_mean: float
    prior_weight: float
    price_min: float | None
    price_max: float | None


@cache
def load_products() -> tuple[Product, ...]:
    df = pd.read_parquet(DATASET_PATH)

    df = df.rename(
        columns=lambda c: (
            c.replace("-", "_").replace("[ml]", "").replace("[euro]", "")
        )
    )

    df["inci"] = df["inci"].fillna("")

    df = df.astype(object).where(pd.notna(df), None)

    return tuple(Product.model_validate(row) for row in df.to_dict(orient="records"))


@cache
def dataset_stats() -> DatasetStats:
    products = load_products()
    ratings = [p.rating for p in products if p.rating is not None]
    counts = [p.review_count for p in products if p.review_count]
    prices = [float(p.price) for p in products if p.price is not None]
    return DatasetStats(
        rating_mean=sum(ratings) / len(ratings) if ratings else 3.0,
        prior_weight=median(counts) if counts else 20.0,
        price_min=min(prices, default=None),
        price_max=max(prices, default=None),
    )


@cache
def products_by_id() -> dict[UUID, Product]:
    return {p.id: p for p in load_products()}


@cache
def load_allergen_terms() -> (
    MappingProxyType[str, tuple[str, ...]]
):  # mapping-proxy-type: read only dict
    raw = json.loads(ALLERGENS_PATH.read_text(encoding="utf-8"))
    return MappingProxyType(
        {NORM(k): tuple(NORM(t) for t in v) for k, v in raw.items()}
    )


def products_by_brand() -> dict[str, tuple[Product, ...]]:  # tuple to make sure
    # cached data is not modified
    grouped: dict[str, list[Product]] = defaultdict(list)
    for p in load_products():
        grouped[p.brand].append(p)

    return {brand: tuple(ps) for brand, ps in grouped.items()}


@cache
def products_by_key() -> dict[tuple[str, str], Product]:
    return {(p.brand, p.product_name): p for p in load_products()}


def get_product(product_id: UUID) -> Product | None:
    return products_by_id().get(product_id)


def get_products(product_ids: list[UUID]) -> list[Product]:
    index = products_by_id()
    return [index[i] for i in product_ids if i in index]
