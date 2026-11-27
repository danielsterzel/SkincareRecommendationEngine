from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.skin_profile import SkinProfileRepository
from app.models.skin_profile import SkinProfile


class SkinProfileDbService:
    def __init__(self, db: AsyncSession):
        self.repository = SkinProfileRepository(db)

    async def get_by_user_id(self, user_id: UUID) -> SkinProfile | None:
        return await self.repository.get_by_user_id(user_id)

    async def get_by_user_id_with_history(self, user_id: UUID) -> SkinProfile | None:
        return await self.repository.get_by_user_id_with_history(user_id)
