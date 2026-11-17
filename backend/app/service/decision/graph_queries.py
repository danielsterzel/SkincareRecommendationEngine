from neo4j import Driver
from pydantic import BaseModel
from uuid import UUID


class ProductNameResult(BaseModel):
    id: UUID
    brand: str
    name: str
    size_ml: float | None


def find_products_by_name(driver: Driver, name: str) -> list[ProductNameResult]:

    result = driver.execute_query(
        """
        MATCH (p: Product)
        WHERE toLower(p.name) CONTAINS toLower($name)
        RETURN p.id AS id, p.brand AS brand, p.name AS name, p.size_ml as size_ml
        ORDER BY brand, name, size_ml, id
        """,
        name=name.strip(),
        routing_="r",
    )

    return [
        ProductNameResult.model_validate(record.data()) for record in result.records
    ]


def find_product_by_concern(driver: Driver, skin_concern: str) -> list[dict]:

    result = driver.execute_query(
        """
        MATCH (p:Product)-[:SKIN_CONCERN]->(st:SkinTarget {key: $skin_concern})
        RETURN p.id as id, p.brand AS brand, p.name AS name, p.size_ml as size_ml
        ORDER BY brand, name, size_ml, id
        """,
        skin_concern=skin_concern.strip().lower(),
    )

    return [dict(record) for record in result.records]


def find_all_product_names(driver: Driver) -> list[ProductNameResult]:

    result = driver.execute_query("""
    MATCH (p:Product)
    RETURN p.id AS id, p.brand AS brand, p.size_ml AS size_ml
    ORDER BY brand, name, size_ml, id
    """)

    return [ProductNameResult.model_validate(record) for record in result.records]
