from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import undefer
from app.db.repositories.repository import Repository
from app.models.skin_profile import SkinProfile
from uuid import UUID


class SkinProfileRepository(Repository[SkinProfile]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, SkinProfile)

    async def get_by_user_id(self, user_id: UUID) -> SkinProfile | None:
        query = select(self.model).where(self.model.user_id == user_id)

        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def get_by_user_id_with_history(self, user_id: UUID) -> SkinProfile | None:
        query = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .options(undefer(self.model.history))
        )
        response = await self.session.execute(query)
        return response.scalar_one_or_none()
