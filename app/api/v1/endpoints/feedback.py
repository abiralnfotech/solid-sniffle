from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.feedback import RideReviewCreate, RideReviewRead
from app.repositories.feedback import FeedbackRepository
from app.repositories.user import UserRepository
from app.services.feedback_service import FeedbackService
from app.models.models import RideReview, User
from typing import List
from uuid import UUID

router = APIRouter()

async def get_feedback_service(db: AsyncSession = Depends(get_db)) -> FeedbackService:
    from app.repositories.ride import RideRepository
    from app.repositories.route import RouteRepository
    from app.models.models import Ride, DriverRoute
    feedback_repo = FeedbackRepository(RideReview, db)
    user_repo = UserRepository(User, db)
    ride_repo = RideRepository(Ride, db)
    route_repo = RouteRepository(DriverRoute, db)
    return FeedbackService(feedback_repo, user_repo, ride_repo, route_repo)

@router.post("/", response_model=RideReviewRead, status_code=status.HTTP_201_CREATED)
async def submit_review(
    review_in: RideReviewCreate,
    reviewer_id: UUID, # Simplified: should come from auth
    service: FeedbackService = Depends(get_feedback_service)
):
    return await service.submit_review(
        reviewer_id=reviewer_id,
        ride_id=review_in.ride_id,
        is_good=review_in.is_good,
        flag_reason=review_in.flag_reason,
        comment=review_in.comment
    )
