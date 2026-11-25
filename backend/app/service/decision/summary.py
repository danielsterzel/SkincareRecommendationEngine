from app.schemas.initial_analysis import QuickSummary
from app.service.decision.schemas import UserSkinContext


def to_quick_summary(ctx: UserSkinContext) -> QuickSummary:
    reactions = [
        f"{r.product_name or r.concentration_ingredient or 'A product'} ({r.effect})"
        for r in ctx.previous_reactions_to_products
    ]
    return QuickSummary(
        identified_concerns=[c.replace("_", " ") for c in ctx.skin_concerns],
        goals=ctx.goals,
        avoid=[a.allergen for a in ctx.allergens] + reactions,
        current_routine=ctx.current_routine,
        note=ctx.note,
    )
