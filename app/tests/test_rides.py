import pytest
from uuid import uuid4
from app.models.models import Ride, RideStatus, DriverRoute
from unittest.mock import MagicMock, patch

@pytest.mark.asyncio
async def test_search_rides(client, mock_db):
    response = await client.get("/api/v1/rides/search?pickup_lat=27.7&pickup_lng=85.3&dropoff_lat=27.71&dropoff_lng=85.32")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["driver_name"] == "Binod Thapa"

@pytest.mark.asyncio
async def test_request_seat(client, mock_db):
    ride_id = uuid4()
    request_data = {
        "seats": 1
    }
    
    # Mock route for price calculation
    mock_route = DriverRoute(
        route_id=ride_id,
        driver_id=uuid4(),
        start_location="POINT(0 0)",
        destination_location="POINT(1 1)",
        departure_time="2023-01-01T00:00:00",
        available_seats=3,
        is_active=True
    )
    
    with patch("app.services.credit_service.CreditService.get_balance", return_value=100):
        mock_db.get.return_value = mock_route
        mock_db.execute.return_value = MagicMock()
        
        response = await client.post(f"/api/v1/rides/{ride_id}/request", json=request_data)
        assert response.status_code == 201
        data = response.json()
        assert "request_id" in data

@pytest.mark.asyncio
async def test_accept_ride(client, mock_db):
    ride_id = uuid4()
    driver_id = uuid4()
    route_id = uuid4()
    
    mock_ride = Ride(
        ride_id=ride_id,
        route_id=route_id,
        passenger_id=uuid4(),
        status=RideStatus.requested,
        fixed_fare_credits=10
    )
    
    # Mock route check in service
    mock_route = DriverRoute(
        route_id=route_id,
        driver_id=driver_id,
        start_location="POINT(0 0)",
        destination_location="POINT(1 1)",
        departure_time="2023-01-01T00:00:00",
        available_seats=3
    )
    
    mock_db.execute.return_value = MagicMock()
    # Manual override for this test because client fixture has headers
    from app.main import app
    from app.api.v1.deps import get_current_user
    from app.models.models import User
    
    mock_driver = User(user_id=driver_id, phone_number="+9779800000000", full_name="Driver")
    app.dependency_overrides[get_current_user] = lambda: mock_driver

    mock_db.get.side_effect = [mock_ride, mock_route]
    
    response = await client.post(f"/api/v1/rides/{ride_id}/accept")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "accepted"
