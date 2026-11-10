"""algorithms to research
- WSM
- TOPSIS
- AHP
- VIKOR
- ELECTRE
- PROMETHEE
- Bayesian decision theory
- Contextual Bandits
- Bayesian Optimization
"""

# optimization algorithms (routine making):
#  Greedy
#  Beam Search
#  Constraint programming
#  MILP
#  NSGA-II


# first approach wsm:
import numpy as np
from typing import Literal
from app.service.decision.inferation import (
    assign_negative_labels_to_products,
    openai_user_skin_context_inference,
)

NEGATIVE_EFFECT_LABELS = {
    "dryness": "Skin dryness, flaking, peeling, tightness, or loss of moisture caused or worsened by a product.",
    "redness": "Skin redness, flushing, or worsening of existing erythema associated with product use.",
    "irritation": "Non-allergic skin irritation, including burning, stinging, itching, discomfort, or irritant contact dermatitis.",
    "comedogenicity": "Potential development or worsening of clogged pores, blackheads, whiteheads, or acne breakouts.",
    "allergic_reaction": "Allergic skin reactions, including allergic contact dermatitis, rash, swelling, or itching caused by sensitivity to an ingredient.",
    "photosensitivity": "Increased sensitivity to ultraviolet radiation, potentially resulting in exaggerated skin reactions following sun exposure.",
    "pigmentation_changes": "Undesirable changes in skin pigmentation, including hyperpigmentation or hypopigmentation associated with product use.",
    "other": "A documented adverse skin effect that does not fit any of the predefined categories.",
    "unknown": "Insufficient reliable information to identify potential adverse effects. This does not imply that the product is risk-free.",
}


criteria = Literal["positive_effect", "negative_effect", "", ""]


# TODO: call llm inferences for negative labels, Match them to the heuristics
# test the weights and proposed routines against user input tests
#
def wsm(scores: np.ndarray, weights: np.ndarray) -> np.ndarray:
    return scores @ weights


def wsm_pipeline(user_input: str):

    user_skin_context = openai_user_skin_context_inference(user_input)

    # TODO: call to get the products from parquet dataset and map them to Product pydantic class write a method that does the fetching in query_dataset.py
    # products = ...
    # negative_labels = assign_negative_labels_to_products(products=products, user_skin_context=user_skin_context)

    ...


rng = np.random.default_rng(42)
scores = np.array([...])

weights = rng.dirichlet(np.ones(3))

results = wsm(scores, weights)

print(weights)
print(results)
print(f"Best: {np.argmax(results)}")
