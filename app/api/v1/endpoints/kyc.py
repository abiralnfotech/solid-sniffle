from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.kyc import KYCCreate, KYCRead, KYCReview, KYCStatus
from app.repositories.kyc import KYCRepository
from app.services.kyc_service import KYCService
from app.models.models import KYCVerification, User
from app.api.v1.deps import get_current_user
from typing import List
from uuid import UUID, uuid4
import os
import shutil

router = APIRouter()

async def get_kyc_service(db: AsyncSession = Depends(get_db)) -> KYCService:
    repo = KYCRepository(KYCVerification, db)
    return KYCService(repo)

@router.post("/verify", response_model=KYCRead, status_code=status.HTTP_201_CREATED)
async def submit_kyc(
    document_type: str = Form(...),
    document_number: str = Form(...),
    front_image: UploadFile = File(...),
    back_image: UploadFile = File(...),
    selfie_image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: KYCService = Depends(get_kyc_service)
):
    """
    Submit identity documents for verification.
    """
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    urls = []
    for img in [front_image, back_image, selfie_image]:
        ext = os.path.splitext(img.filename)[1]
        filename = f"{uuid4()}{ext}"
        filepath = os.path.join(upload_dir, filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        urls.append(f"/static/uploads/{filename}")

    kyc = KYCVerification(
        user_id=current_user.user_id,
        document_type=document_type,
        document_number=document_number,
        identity_front_url=urls[0],
        identity_back_url=urls[1],
        selfie_image_url=urls[2]
    )
    return await service.submit_kyc(kyc)

@router.get("/status", response_model=KYCStatus)
async def get_kyc_status(
    current_user: User = Depends(get_current_user),
    service: KYCService = Depends(get_kyc_service)
):
    """
    Check current KYC status.
    """
    kyc = await service.kyc_repo.get_by_user_id(current_user.user_id)
    if not kyc:
        return KYCStatus(status="pending")
    return KYCStatus(status=kyc.status.value, reason=kyc.rejection_reason)

@router.post("/{kyc_id}/review", response_model=KYCRead)
async def review_kyc(
    kyc_id: UUID,
    review_in: KYCReview,
    reviewer_id: UUID, # Simplified: should come from admin auth
    service: KYCService = Depends(get_kyc_service)
):
    return await service.review_kyc(kyc_id, reviewer_id, review_in.status, review_in.rejection_reason)
