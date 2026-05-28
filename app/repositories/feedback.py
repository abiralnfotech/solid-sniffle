from app.repositories.base import BaseRepository
from app.models.models import RideReview, User
from sqlmodel import select, func
from uuid import UUID

class FeedbackRepository(BaseRepository[RideReview]):
    async def get_negative_ratio(self, user_id: UUID) -> float:
        # Calculate ratio of Bad Experience (is_good=False) for first 10+ rides
        total_statement = select(func.count(RideReview.review_id)).where(RideReview.reviewee_id == user_id)
        total_results = await self.db.execute(total_statement)
        total_count = total_results.scalar() or 0

        if total_count == 0:
            return 0.0

        bad_statement = select(func.count(RideReview.review_id)).where(
            RideReview.reviewee_id == user_id,
            RideReview.is_good == False
        )
        bad_results = await self.db.execute(bad_statement)
        bad_count = bad_results.scalar() or 0

        return bad_count / total_count

    async def get_total_reviews(self, user_id: UUID) -> int:
        statement = select(func.count(RideReview.review_id)).where(RideReview.reviewee_id == user_id)
        results = await self.db.execute(statement)
        return results.scalar() or 0
