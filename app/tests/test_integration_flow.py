import pytest
from uuid import uuid4
import io

@pytest.mark.asyncio
async def test_full_user_journey(client, mock_db):
    # 1. Request OTP
    phone = "+9779812345678"
    response = await client.post("/api/v1/auth/request-otp", json={"phone_number": phone})
    assert response.status_code == 200

    # 2. Verify OTP (using mock service logic where any OTP works for test or we just mock the service)
    # Since we use the real service but it's mocked in conftest, we need to be careful.
    # Actually, conftest mocks the DB, not the service.

    # Let's bypass OTP for integration test and assume we get a token
    # In a real integration test we'd hit the endpoint, but here we want to test the flow.

    # Let's mock the user in DB
    user_id = uuid4()
    from app.models.models import User, UserRole, DriverRoute, Ride, RideStatus
    mock_user = User(user_id=user_id, phone_number=phone, full_name="Test User", role=UserRole.passenger)

    # Mock JWT decode to return this user_id
    from app.core.config import settings
    from jose import jwt
    from datetime import datetime, timezone, timedelta

    token = jwt.encode({"sub": str(user_id), "exp": datetime.now(timezone.utc) + timedelta(minutes=10)}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    headers = {"Authorization": f"Bearer {token}"}

    # Mock DB lookups
    mock_db.get.return_value = mock_user

    # 3. Get Me
    response = await client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["full_name"] == "Test User"

    # 4. Submit KYC
    front_image = ("front.jpg", io.BytesIO(b"front"), "image/jpeg")
    back_image = ("back.jpg", io.BytesIO(b"back"), "image/jpeg")
    selfie_image = ("selfie.jpg", io.BytesIO(b"selfie"), "image/jpeg")

    data = {"document_type": "citizenship", "document_number": "KYC-123"}
    files = {"front_image": front_image, "back_image": back_image, "selfie_image": selfie_image}

    # Mock KYC check to not find existing
    mock_db.execute.return_value.scalars.return_value.first.return_value = None

    response = await client.post("/api/v1/kyc/verify", headers=headers, data=data, files=files)
    assert response.status_code == 201

    # 5. Search Rides
    # Mock spatial search result
    mock_db.execute.return_value.mappings.return_value.all.return_value = [
        {
            "ride_id": uuid4(),
            "driver_name": "Driver Joe",
            "available_seats": 2,
            "departure_time": datetime.now(timezone.utc),
            "pickup_distance": 1.2
        }
    ]

    response = await client.get("/api/v1/rides/search?pickup_lat=27&pickup_lng=85&dropoff_lat=27&dropoff_lng=85", headers=headers)
    assert response.status_code == 200
    rides = response.json()
    assert len(rides) > 0
    ride_id = rides[0]["ride_id"]

    # 6. Request Ride
    # Mock route check
    mock_route = DriverRoute(route_id=ride_id, driver_id=uuid4(), available_seats=2, is_active=True)
    mock_db.get.return_value = mock_route

    async def mock_get_balance(*args): return 100
    async def mock_add_transaction(*args, **kwargs): return None

    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("app.services.credit_service.CreditService.get_balance", mock_get_balance)
        mp.setattr("app.services.credit_service.CreditService.add_transaction", mock_add_transaction)

        response = await client.post(f"/api/v1/rides/{ride_id}/request", headers=headers, json={"seats": 1})
        assert response.status_code == 201
        assert "request_id" in response.json()
