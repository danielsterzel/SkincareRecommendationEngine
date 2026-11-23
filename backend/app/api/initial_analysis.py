from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from openai import OpenAI

from app.core.openai_client import get_openai_client
from app.core.auth import get_verified_user
from app.models.user import User
import app.schemas.initial_analysis as ia
from app.schemas.initial_analysis import QuickSummary
from app.service.decision.desicion_engine import wsm_pipeline
from app.service.decision.llm_utils import openai_user_skin_context_inference
from app.service.decision.summary import to_quick_summary
from logging import getLogger
from pathlib import Path

log = getLogger(__file__)
ANALYSIS_API_LOG_FILE = (
    Path(__file__).resolve().parent.parent.parent / "logs" / "analysis.log"
)

router = APIRouter(prefix="/initial-analysis", tags=["initial-analysis"])


@router.post("/analysis")
async def parse(
    user: Annotated[User, Depends(get_verified_user)],
    openai: Annotated[OpenAI, Depends(get_openai_client)],
    data: ia.UserSkinInformationInput,
):

    async def stream():
        async for event in wsm_pipeline(user_input=data, client=openai):

            log_content = f"TYPE: {event.type}\nMESSAGE: {event.message}\n"
            if isinstance(event, ia.CompletedEvent) and not event.data:
                log_content += "NO PRODUCTS FOUND\n"

            with ANALYSIS_API_LOG_FILE.open("a", encoding="utf-8") as f:
                f.write(log_content + "\n")
            yield f"data: {event.model_dump_json(by_alias=True)}\n\n"

    ANALYSIS_API_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    return StreamingResponse(stream(), media_type="text/event-stream")


@router.post("/quick-summary", response_model=QuickSummary)
async def quick_summary(
    user: Annotated[User, Depends(get_verified_user)],
    openai: Annotated[OpenAI, Depends(get_openai_client)],
    data: ia.UserSkinInformationInput,
) -> QuickSummary:
    ctx = openai_user_skin_context_inference(openai, data.model_dump_json())

    return to_quick_summary(ctx)
