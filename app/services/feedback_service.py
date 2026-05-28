from app.repositories.feedback import FeedbackRepository
from app.repositories.user import UserRepository
from app.repositories.ride import RideRepository
from app.repositories.route import RouteRepository
from app.models.models import RideReview, User, Ride, DriverRoute
from app.core.exceptions import AppException
from fastapi import status
from uuid import UUID

class FeedbackService:
    def __init__(self, feedback_repo: FeedbackRepository, user_repo: UserRepository, ride_repo: RideRepository, route_repo: RouteRepository):
        self.feedback_repo = feedback_repo
        self.user_repo = user_repo
        self.ride_repo = ride_repo
        self.route_repo = route_repo

    async def submit_review(self, reviewer_id: UUID, ride_id: UUID, is_good: bool, flag_reason=None, comment=None) -> RideReview:
        from app.models.models import ReviewSafetyTag
        ride = await self.ride_repo.get(ride_id)
        if not ride:
            raise AppException("Ride not found", status_code=status.HTTP_404_NOT_FOUND)

        route = await self.route_repo.get(ride.route_id)

        # Determine reviewee
        if reviewer_id == ride.passenger_id:
            reviewee_id = route.driver_id
        elif reviewer_id == route.driver_id:
            reviewee_id = ride.passenger_id
        else:
            raise AppException("Unauthorized to review this ride", status_code=status.HTTP_401_UNAUTHORIZED)

        review_in = RideReview(
            ride_id=ride_id,
            reviewer_id=reviewer_id,
            reviewee_id=reviewee_id,
            is_good_experience=is_good,
            comment=comment
        )
        review = await self.feedback_repo.create(review_in)

        if flag_reason:
            tag = ReviewSafetyTag(review_id=review.review_id, reason=flag_reason)
            self.feedback_repo.db.add(tag)
            await self.feedback_repo.db.commit()

        # Check for automated banning
        user_id = reviewee_id
        total_reviews = await self.feedback_repo.get_total_reviews(user_id)

        if total_reviews >= 10:
            negative_ratio = await self.feedback_repo.get_negative_ratio(user_id)
            if negative_ratio > 0.15:
                user = await self.user_repo.get(user_id)
                await self.user_repo.update(user, {"is_banned": True})

        return review
