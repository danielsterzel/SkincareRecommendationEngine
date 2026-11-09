import json
import os
from collections import defaultdict
from enum import StrEnum
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

import pandas as pd
from neo4j import GraphDatabase

from app.service.decision.data.schemas import NormalizedSkinOutput

DATA_DIR = Path(__file__).resolve().parent


class SkincareGraphEdgeTypes(StrEnum):
    SKIN_CONCERN = "SKIN_CONCERN"
    SKIN_GOAL = "SKIN_GOAL"
    PRODUCT_FUNCTION = "PRODUCT_FUNCTION"
    OTHER = "OTHER"


CONSTRAINTS = (
    """
    CREATE CONSTRAINT product_id_unique IF NOT EXISTS
    FOR (p:Product) REQUIRE p.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT target_key_unique IF NOT EXISTS
    FOR (t:SkinTarget) REQUIRE t.key IS UNIQUE
    """,
)


def target_alias(name: str) -> str:
    return " ".join(name.lower().replace("-", " ").split())


def load_graph_rows():
    normalized = NormalizedSkinOutput.model_validate_json(
        (DATA_DIR / "normalized-targets.json").read_text(encoding="utf-8")
    )
    aliases = {}
    targets = {}
    for target in normalized.normalized_targets:
        edge_type = SkincareGraphEdgeTypes(target.category)
        key = target.normalized_name
        targets.setdefault(
            key, {"key": key, "category": edge_type.value, "aliases": []}
        )
        targets[key]["aliases"].append(target.original_name)
        aliases[target_alias(target.original_name)] = (
            key,
            edge_type,
            target.needs_review,
        )

    catalog = pd.read_parquet(
        DATA_DIR / "skincare-products-clean.parquet",
        columns=["brand", "product-name", "source-url", "size[ml]", "targets"],
    )
    products = []
    links = defaultdict(list)
    unmapped = set()
    catalog_rows = catalog.itertuples(index=False, name=None)
    for brand, name, source_url, size, raw_targets in catalog_rows:
        size_ml = None if pd.isna(size) else float(size)
        product_id = str(uuid5(NAMESPACE_URL, json.dumps([source_url, size_ml])))
        products.append(
            {
                "id": product_id,
                "brand": brand,
                "name": name,
                "source_url": source_url,
                "size_ml": size_ml,
            }
        )

        product_targets = {}
        for raw_target in (
            raw_targets.split(",") if isinstance(raw_targets, str) else ()
        ):
            alias = target_alias(raw_target)
            if not alias:
                continue
            if alias not in aliases:
                unmapped.add(alias)
                continue
            key, edge_type, needs_review = aliases[alias]
            link = (key, edge_type)
            product_targets[link] = product_targets.get(link, False) or needs_review

        for (key, edge_type), needs_review in product_targets.items():
            links[edge_type].append(
                {
                    "product_id": product_id,
                    "target_key": key,
                    "needs_review": needs_review,
                }
            )

    if unmapped:
        missing = ", ".join(sorted(unmapped))
        raise ValueError(f"Targets missing from normalized-targets.json: {missing}")
    return products, list(targets.values()), links


def write_graph(tx, products, targets, links):
    tx.run(
        """
        UNWIND $rows AS row
        MERGE (p:Product {id: row.id})
        SET p += row
        """,
        rows=products,
    ).consume()
    tx.run(
        """
        UNWIND $rows AS row
        MERGE (t:SkinTarget {key: row.key})
        SET t += row
        """,
        rows=targets,
    ).consume()
    for edge_type, rows in links.items():
        tx.run(
            f"""
            UNWIND $rows AS row
            MATCH (p:Product {{id: row.product_id}})
            MATCH (t:SkinTarget {{key: row.target_key}})
            MERGE (p)-[r:{edge_type.value}]->(t)
            SET r.needs_review = row.needs_review
            """,
            rows=rows,
        ).consume()


def main():
    products, targets, links = load_graph_rows()
    uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    auth = (
        os.getenv("NEO4J_USER", "neo4j"),
        os.getenv("NEO4J_PASSWORD", "aurelia12345"),
    )
    with GraphDatabase.driver(uri, auth=auth) as driver:
        for constraint in CONSTRAINTS:
            driver.execute_query(constraint)
        with driver.session() as session:
            session.execute_write(write_graph, products, targets, links)
    relationship_count = sum(len(rows) for rows in links.values())
    print(
        f"Imported {len(products)} products, {len(targets)} targets "
        f"and {relationship_count} relationships."
    )


if __name__ == "__main__":
    main()
