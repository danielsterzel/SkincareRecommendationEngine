import json
from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from openai import OpenAI

from app.core.openai_client import get_openai_client
from app.core.auth import get_verified_user
from app.models.user import User
import app.schemas.initial_analysis as ia
from app.service.decision.desicion_engine import wsm_pipeline
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

            log_content = f"TYPE: {event.get("type")}\n"
            log_content += f"MESSAGE: {event.get("message", "INVALID_MESSAGE")}\n"
            event_data = event.get("data", "SKIP")

            if event_data != "SKIP":
                if len(event_data) == 0:
                    log_content += f"NO PRODUCTS FOUND\n"

            with ANALYSIS_API_LOG_FILE.open("a", encoding="utf-8") as f:
                f.write(log_content + "\n")
            yield f"data: {json.dumps(event)}\n\n"

    ANALYSIS_API_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    return StreamingResponse(stream(), media_type="text/event-stream")
