import pytest
from uuid import uuid4
from app.models.models import Ride, RideStatus, DriverRoute
from unittest.mock import MagicMock, patch

@pytest.mark.asyncio
async def test_request_ride(client, mock_db):
    passenger_id = uuid4()
    route_id = uuid4()
    ride_data = {
        "route_id": str(route_id),
        "seat_count": 1
    }
    
    # Mock route for price calculation
    mock_route = DriverRoute(
        route_id=route_id,
        driver_id=uuid4(),
        start_location="POINT(0 0)",
        destination_location="POINT(1 1)",
        departure_time="2023-01-01T00:00:00",
        available_seats=3,
        is_active=True
    )
    
    # Create a mock for the execute result that returns 100 for the balance check
    mock_balance_result = MagicMock()
    # The error says balance is a MagicMock. 
    # That means results.scalar_one_or_none() returned a MagicMock.
    mock_balance_result.scalar_one_or_none.return_value = 100
    
    # Explicitly set the return value of execute to be an Awaitable that returns mock_balance_result
    # Actually mock_db.execute is already an AsyncMock because of conftest.py
    
    # Let's try to mock it more specifically
    with patch("app.services.credit_service.CreditService.get_balance", return_value=100):
        # We still need to mock the route lookup
        mock_db.get.return_value = mock_route
        mock_db.execute.return_value = MagicMock() # For other calls
        
        response = await client.post(f"/api/v1/rides/?passenger_id={passenger_id}", json=ride_data)
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "requested"

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
    
    # Reset mock_db
    mock_db.execute.side_effect = None
    mock_db.execute.return_value = MagicMock()
    
    # Need to handle multiple get calls. 
    # RideService.accept_ride calls ride_repo.get and route_repo.get
    mock_db.get.side_effect = [mock_ride, mock_route]
    
    response = await client.post(f"/api/v1/rides/{ride_id}/accept?driver_id={driver_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "accepted"
