from neo4j import GraphDatabase
from app.core.settings import settings
from app.service.decision.graph_queries import (
    find_products_by_name,
    find_product_by_concern,
)
from openai import OpenAI
import pandas as pd
import json
from pathlib import Path

from app.service.decision.llm_utils import infer_skin_concerns

NORMALIZED_NAMES_JSON_PATH = "data/normalized-targets.json"

TEST_CONCERN_MATCHES = Path("test_concerns/matches.txt").read_text("utf-8")
TEST_CONCERN_NO_MATCHES = Path("test_concerns/no_matches.txt").read_text("utf-8")
TEST_CONCERN_NORMALIZED_INPUTS = Path("test_concerns/normalized_inputs.txt").read_text(
    "utf-8"
)

tests = [TEST_CONCERN_MATCHES, TEST_CONCERN_NO_MATCHES, TEST_CONCERN_NORMALIZED_INPUTS]

df = pd.read_parquet("data/skincare-products-clean.parquet")

with open(NORMALIZED_NAMES_JSON_PATH, "r") as f:
    normalized_names = json.load(f)


with GraphDatabase.driver(
    "bolt://localhost:7687", auth=("neo4j", "aurelia12345")
) as driver:
    print(find_products_by_name(driver, "glycolic acid"))
    print(find_product_by_concern(driver, "redness"))

    client = OpenAI(api_key=settings.open_ai_key)

    for test in tests:

        skin_concerns = infer_skin_concerns(test)

        if skin_concerns is None:
            continue

            return_insight = client.responses.create(
                model=settings.open_ai_model,
                instructions="""
                You are Aurelia, a skincare assistant. Help the user choose a practical next step for their stated skin concern using their current routine and the candidate products provided.
                
                1. Recommend up to two products from the supplied candidates. Name one first choice when possible. Copy each product's ID, brand, and name exactly.
                2. Apply the user's hard constraints before choosing a product. If you cannot verify that a product meets a relevant constraint, leave it out.
                3. Explain why each recommendation fits this user and how it would fit into their current routine. Say whether it would replace a product or add a step. Prefer one change at a time.
                4. Base product claims on the supplied data. A catalog tag indicates the product's intended use. It does not establish effectiveness. If ingredient or evidence data are missing, say what you could not assess.
                5. Give one or two practical tips tailored to the user's concern. Avoid diagnosing skin conditions or promising results.
                6. If no candidate fits, return an empty recommendations list and explain what information or product type would help.  
                """,
                input=json.dumps(
                    {
                        "user_description": test,
                        "skin_concern": concern,
                        "candidate_products": products,
                        "product_details": details,
                    }
                ),
            )
            print(return_insight.output_text)
