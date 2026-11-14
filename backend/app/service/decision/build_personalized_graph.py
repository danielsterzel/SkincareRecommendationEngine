import pandas as pd
from neo4j import Driver

from app.service.decision.graph_queries import find_product_by_concern
from app.service.decision.llm_utils import infer_skin_concerns
import json

df = pd.read_parquet("data/skincare-products-clean.parquet")


def get_product_candidates_by_concern(user_input: str, driver: Driver):

    skin_concerns = infer_skin_concerns(user_input)

    concern_recommended_products = {}

    for concern in skin_concerns:
        details = {}

        products = find_product_by_concern(driver, concern)
        for p in products:

            product_name = p.get("name")
            if product_name is None:
                continue
            rows = df[df["product-name"] == product_name]
            products_details = json.loads(rows.to_json(orient="records"))
            details[product_name] = products_details
        concern_recommended_products[concern] = details

    return concern_recommended_products
