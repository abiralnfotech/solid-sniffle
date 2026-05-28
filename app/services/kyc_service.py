from app.repositories.kyc import KYCRepository
from app.models.models import KYCVerification, VerificationStatus
from app.core.exceptions import AppException
from fastapi import status
from uuid import UUID

class KYCService:
    def __init__(self, kyc_repo: KYCRepository):
        self.kyc_repo = kyc_repo

    async def submit_kyc(self, kyc_in: KYCVerification) -> KYCVerification:
        existing = await self.kyc_repo.get_by_document(kyc_in.document_number)
        if existing:
            raise AppException("This identity is already linked to an active account", status_code=status.HTTP_400_BAD_REQUEST)

        user_existing = await self.kyc_repo.get_by_user_id(kyc_in.user_id)
        if user_existing:
            raise AppException("User has already submitted KYC", status_code=status.HTTP_400_BAD_REQUEST)

        return await self.kyc_repo.create(kyc_in)

    async def review_kyc(self, kyc_id: UUID, reviewer_id: UUID, status: VerificationStatus, rejection_reason: str = None) -> KYCVerification:
        kyc = await self.kyc_repo.get(kyc_id)
        if not kyc:
            raise AppException("KYC not found", status_code=status.HTTP_404_NOT_FOUND)

        update_data = {
            "status": status,
            "reviewed_by": reviewer_id,
            "rejection_reason": rejection_reason
        }
        return await self.kyc_repo.update(kyc, update_data)
