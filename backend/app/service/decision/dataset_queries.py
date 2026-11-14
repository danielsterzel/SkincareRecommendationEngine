import json
from functools import cache
import pandas as pd
from pathlib import Path

from collections import defaultdict
from app.service.decision.dataset_schemas import Product
from uuid import UUID
from types import MappingProxyType

ALLERGENS_PATH = Path(__file__).resolve().parent / "data" / "allergen_inci_terms.json"

DATASET_PATH = (
    Path(__file__).resolve().parent / "data" / "skincare-products-clean.parquet"
)

NORM = lambda s: s.strip().lower()


@cache
def load_products() -> tuple[Product, ...]:
    df = pd.read_parquet(DATASET_PATH)
    return tuple(Product(**row) for row in df.to_dict(orient="records"))


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


def get_product(product_id: UUID) -> Product | None:
    return products_by_id().get(product_id)


def get_products(product_ids: list[UUID]) -> list[Product]:
    index = products_by_id()
    return [index[i] for i in product_ids if i in index]
