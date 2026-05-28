import pytest
from uuid import uuid4
from datetime import datetime
from app.models.models import RideReview
from unittest.mock import MagicMock

@pytest.mark.asyncio
async def test_submit_review(client, mock_db):
    reviewer_id = uuid4()
    ride_id = uuid4()
    review_data = {
        "ride_id": str(ride_id),
        "is_good": True,
        "comment": "Great ride!"
    }
    
    # Mock ride and route lookups in FeedbackService
    mock_ride = MagicMock()
    mock_ride.ride_id = ride_id
    mock_ride.route_id = uuid4()
    mock_ride.passenger_id = reviewer_id
    
    mock_route = MagicMock()
    mock_route.driver_id = uuid4()
    
    # feedback_repo.get_total_reviews is called
    mock_execute_result = MagicMock()
    mock_execute_result.scalar.return_value = 5
    mock_db.execute.return_value = mock_execute_result
    
    mock_db.get.side_effect = [mock_ride, mock_route]
    
    response = await client.post(f"/api/v1/feedback/?reviewer_id={reviewer_id}", json=review_data)
    assert response.status_code == 201
    data = response.json()
    assert data["comment"] == "Great ride!"
    assert data["is_good"] == True
from unittest.mock import MagicMock
