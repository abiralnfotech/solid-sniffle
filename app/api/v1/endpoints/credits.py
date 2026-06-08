from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.credit import CreditLedgerRead, CreditBalance
from app.repositories.credit import CreditRepository
from app.services.credit_service import CreditService
from app.models.models import CreditLedger, User
from app.api.v1.deps import get_current_user
from typing import List
from uuid import UUID

router = APIRouter()

async def get_credit_service(db: AsyncSession = Depends(get_db)) -> CreditService:
    repo = CreditRepository(CreditLedger, db)
    return CreditService(repo)

@router.get("/balance", response_model=CreditBalance)
async def get_balance(
    current_user: User = Depends(get_current_user),
    service: CreditService = Depends(get_credit_service)
):
    balance = await service.get_balance(current_user.user_id)
    return CreditBalance(balance=balance)

@router.get("/history", response_model=List[CreditLedgerRead])
async def get_history(
    current_user: User = Depends(get_current_user),
    service: CreditService = Depends(get_credit_service)
):
    return await service.get_history(current_user.user_id)
