from typing import Annotated

from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependency import get_db
from app.core.auth import get_verified_user
from app.schemas.skin_profile import SkinProfileResponse
from app.models.user import User
from app.db.services.skin_profile import SkinProfileDbService

router = APIRouter(prefix="/skin_profiles")


@router.get("/me", response_model=SkinProfileResponse)
async def get_skin_profile(
    user: Annotated[User, Depends(get_verified_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SkinProfileResponse:

    skin_profile_service = SkinProfileDbService(db)
    skin_profile = await skin_profile_service.get_by_user_id(user_id=user.id)
    if skin_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't process Skin Profile",
        )

    return SkinProfileResponse.model_validate(skin_profile)
