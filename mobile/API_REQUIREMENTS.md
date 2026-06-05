# Sahayatri API Requirements

This document outlines the API endpoints required by the Sahayatri mobile application. All endpoints should follow RESTful principles and use JSON for request/response bodies.

## Authentication

### Send OTP
- **Endpoint:** `POST /api/v1/auth/send-otp`
- **Request Body:**
  ```json
  {
    "phone": "98XXXXXXXX"
  }
  ```
- **Description:** Sends a 6-digit OTP to the provided Nepalese phone number.

### Verify OTP
- **Endpoint:** `POST /api/v1/auth/verify-otp`
- **Request Body:**
  ```json
  {
    "phone": "98XXXXXXXX",
    "otp": "123456"
  }
  ```
- **Response Body:**
  ```json
  {
    "access_token": "jwt_token_here",
    "token_type": "bearer",
    "user_status": "new" | "onboarding" | "verified" | "suspended"
  }
  ```

## User & Profile

### Get Current User
- **Endpoint:** `GET /api/v1/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response Body:**
  ```json
  {
    "id": "uuid",
    "phone": "+97798XXXXXXXX",
    "name": "Full Name",
    "bio": "User bio...",
    "avatar_url": "https://...",
    "kyc_status": "pending" | "verified" | "rejected" | "none",
    "is_driver": true | false,
    "balance": 500
  }
  ```

### Update Profile
- **Endpoint:** `PATCH /api/v1/users/me`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "New Name",
    "bio": "New Bio",
    "avatar_url": "..."
  }
  ```

## Identity Verification (KYC)

### Submit KYC
- **Endpoint:** `POST /api/v1/kyc/verify`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "id_number": "1234-5678-9012",
    "document_front_base64": "...",
    "document_back_base64": "...",
    "is_driver_applicant": true,
    "license_base64": "..."
  }
  ```
- **Description:** Submits identity documents for manual verification.

## Rides (Passenger Mode)

### Discover Rides
- **Endpoint:** `GET /api/v1/rides/discover`
- **Query Params:** `lat`, `lng`, `destination` (optional)
- **Response Body:**
  ```json
  [
    {
      "id": "uuid",
      "driver_name": "Binod Thapa",
      "vehicle_details": "Suzuki Gixxer",
      "origin": "...",
      "destination": "...",
      "seats_left": 2,
      "cost": 45,
      "departure_time": "2023-10-27T10:30:00Z"
    }
  ]
  ```

### Request a Seat
- **Endpoint:** `POST /api/v1/rides/{ride_id}/request`
- **Request Body:**
  ```json
  {
    "seats": 1
  }
  ```

## Rides (Driver Mode)

### Create Ride Offer
- **Endpoint:** `POST /api/v1/rides`
- **Request Body:**
  ```json
  {
    "origin": "...",
    "destination": "...",
    "total_seats": 2,
    "vehicle_details": "...",
    "departure_time": "..."
  }
  ```

### Get Ride Requests
- **Endpoint:** `GET /api/v1/rides/{ride_id}/requests`
- **Response Body:**
  ```json
  [
    {
      "request_id": "uuid",
      "passenger_name": "Aayush Shrestha",
      "seats_requested": 1,
      "mutual_friends": 4,
      "pickup_location": "..."
    }
  ]
  ```

### Manage Ride Request
- **Endpoint:** `PATCH /api/v1/rides/requests/{request_id}`
- **Request Body:**
  ```json
  {
    "status": "accepted" | "declined"
  }
  ```

## Live Tracking & Feedback

### Get Ride Details
- **Endpoint:** `GET /api/v1/rides/{ride_id}`
- **Description:** Returns full details of a ride, including live driver coordinates.

### Submit Feedback
- **Endpoint:** `POST /api/v1/rides/{ride_id}/feedback`
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Great ride!",
    "tags": ["Safe", "Punctual"]
  }
  ```
