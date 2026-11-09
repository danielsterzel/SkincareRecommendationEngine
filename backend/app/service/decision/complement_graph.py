from collections.abc import Iterable, Mapping
from typing import Any

import networkx as nx


def build_personal_graph(
    user_id: str,
    products_by_concern: Mapping[str, Iterable[Mapping[str, Any]]],
) -> nx.DiGraph:
    """Build an in-memory graph from one user's concerns and catalog candidates."""
    graph = nx.DiGraph()
    user = ("user", user_id)
    graph.add_node(user, node_type="User", id=user_id)

    for concern, products in products_by_concern.items():
        target = ("skin_target", concern)
        graph.add_node(target, node_type="SkinTarget", key=concern)
        graph.add_edge(user, target, relation="HAS_CONCERN")

        for product in products:
            candidate = ("product", product["id"])
            graph.add_node(candidate, **{**product, "node_type": "Product"})
            graph.add_edge(candidate, target, relation="SKIN_CONCERN")

    return graph
