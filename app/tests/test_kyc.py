import pytest
from uuid import uuid4
from app.models.models import KYCVerification, VerificationStatus
import io

@pytest.mark.asyncio
async def test_submit_kyc(client, mock_db):
    user_id = str(uuid4())

    # Create mock files
    front_image = ( "front.jpg", io.BytesIO(b"front"), "image/jpeg")
    back_image = ( "back.jpg", io.BytesIO(b"back"), "image/jpeg")
    selfie_image = ( "selfie.jpg", io.BytesIO(b"selfie"), "image/jpeg")

    data = {
        "document_type": "nagarikta",
        "document_number": "123-456",
    }
    files = {
        "front_image": front_image,
        "back_image": back_image,
        "selfie_image": selfie_image,
    }
    
    response = await client.post("/api/v1/kyc/verify", data=data, files=files)
    assert response.status_code == 201
    data = response.json()
    assert data["document_number"] == "123-456"
    assert data["status"] == "pending"

@pytest.mark.asyncio
async def test_get_kyc_status(client, mock_db):
    user_id = uuid4()
    mock_kyc = KYCVerification(
        user_id=user_id,
        document_type="nagarikta",
        document_number="123-456",
        identity_front_url="http://example.com/front.jpg",
        identity_back_url="http://example.com/back.jpg",
        status=VerificationStatus.approved
    )
    mock_db.execute.return_value.scalars.return_value.first.return_value = mock_kyc

    response = await client.get("/api/v1/kyc/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_review_kyc(client, mock_db):
    kyc_id = str(uuid4())
    reviewer_id = str(uuid4())
    review_data = {
        "status": "approved"
    }
    
    mock_kyc = KYCVerification(
        kyc_id=kyc_id,
        user_id=uuid4(),
        document_type="nagarikta",
        document_number="123-456",
        identity_front_url="http://example.com/front.jpg",
        identity_back_url="http://example.com/back.jpg",
        status=VerificationStatus.pending
    )
    mock_db.get.return_value = mock_kyc
    
    response = await client.post(
        f"/api/v1/kyc/{kyc_id}/review?reviewer_id={reviewer_id}", 
        json=review_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
