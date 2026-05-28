from app.repositories.base import BaseRepository
from app.models.models import KYCVerification
from sqlmodel import select
from typing import Optional
from uuid import UUID

class KYCRepository(BaseRepository[KYCVerification]):
    async def get_by_document(self, document_number: str) -> Optional[KYCVerification]:
        statement = select(KYCVerification).where(KYCVerification.document_number == document_number)
        results = await self.db.execute(statement)
        return results.scalars().first()

    async def get_by_user_id(self, user_id: UUID) -> Optional[KYCVerification]:
        statement = select(KYCVerification).where(KYCVerification.user_id == user_id)
        results = await self.db.execute(statement)
        return results.scalars().first()
