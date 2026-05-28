from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.kyc import KYCCreate, KYCRead, KYCReview
from app.repositories.kyc import KYCRepository
from app.services.kyc_service import KYCService
from app.models.models import KYCVerification, User
from typing import List
from uuid import UUID

router = APIRouter()

async def get_kyc_service(db: AsyncSession = Depends(get_db)) -> KYCService:
    repo = KYCRepository(KYCVerification, db)
    return KYCService(repo)

@router.post("/", response_model=KYCRead, status_code=status.HTTP_201_CREATED)
async def submit_kyc(
    kyc_in: KYCCreate,
    user_id: UUID, # Simplified: should come from auth
    service: KYCService = Depends(get_kyc_service)
):
    kyc = KYCVerification(**kyc_in.model_dump(), user_id=user_id)
    return await service.submit_kyc(kyc)

@router.post("/{kyc_id}/review", response_model=KYCRead)
async def review_kyc(
    kyc_id: UUID,
    review_in: KYCReview,
    reviewer_id: UUID, # Simplified: should come from admin auth
    service: KYCService = Depends(get_kyc_service)
):
    return await service.review_kyc(kyc_id, reviewer_id, review_in.status, review_in.rejection_reason)
