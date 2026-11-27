import json
from pathlib import Path
from neo4j import GraphDatabase

ACTIVE_INGREDIENTS = (
    Path(__file__).resolve().parent / "active-ingredients-register.json"
).read_text(encoding="utf-8")


db = GraphDatabase()

# with db.driver("")
