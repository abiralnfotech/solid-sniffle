# Sahayatri Mobile API Requirements

This document outlines the necessary backend API endpoints required to support the Sahayatri mobile application.

## 1. Authentication & Onboarding

### POST `/api/v1/auth/request-otp`
- **Purpose**: Initiate login by sending a 6-digit OTP to the provided phone number.
- **Request Body**:
  ```json
  {
    "phone_number": "+97798XXXXXXXX"
  }
  ```
- **Response**: `200 OK` on success.

### POST `/api/v1/auth/verify-otp`
- **Purpose**: Verify the OTP and return an authentication token.
- **Request Body**:
  ```json
  {
    "phone_number": "+97798XXXXXXXX",
    "otp": "XXXXXX"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "string",
    "token_type": "bearer",
    "user_id": "uuid",
    "onboarding_completed": boolean
  }
  ```

### POST `/api/v1/auth/biometric-toggle`
- **Purpose**: Enable/disable biometric login for the current device.
- **Request Body**:
  ```json
  {
    "enabled": boolean,
    "device_id": "string"
  }
  ```
- **Response**: `200 OK`.

---

## 2. Identity Verification (KYC)

### POST `/api/v1/kyc/verify`
- **Purpose**: Submit identity documents for verification.
- **Request Body (Multipart)**:
  - `document_type`: "citizenship" | "license"
  - `document_number`: "string"
  - `front_image`: File
  - `back_image`: File
  - `selfie_image`: File
- **Response**: `200 OK` with verification status.

### GET `/api/v1/kyc/status`
- **Purpose**: Check current KYC status.
- **Response**:
  ```json
  {
    "status": "pending" | "verified" | "rejected",
    "reason": "string" (optional)
  }
  ```

---

## 3. User Profile & Wallet

### GET `/api/v1/users/me`
- **Purpose**: Retrieve current user profile details.
- **Response**:
  ```json
  {
    "id": "uuid",
    "full_name": "string",
    "phone_number": "string",
    "profile_picture_url": "string",
    "credit_balance": number,
    "is_verified": boolean,
    "rating": number
  }
  ```

### PATCH `/api/v1/users/me`
- **Purpose**: Update user profile (name, profile picture).
- **Request Body**:
  ```json
  {
    "full_name": "string",
    "profile_picture_url": "string"
  }
  ```
- **Response**: Updated user object.

### GET `/api/v1/wallet/balance`
- **Purpose**: Get current Goodwill Credit balance.
- **Response**:
  ```json
  {
    "balance": number
  }
  ```

---

## 4. Ride Management (Passenger Mode)

### GET `/api/v1/rides/search`
- **Purpose**: Search for available rides based on location and destination.
- **Query Params**: `pickup_lat`, `pickup_lng`, `dropoff_lat`, `dropoff_lng`
- **Response**: List of available rides.
  ```json
  [
    {
      "ride_id": "uuid",
      "driver_name": "string",
      "driver_rating": number,
      "vehicle_info": "string",
      "available_seats": number,
      "goodwill_cost": number,
      "departure_time": "ISO8601",
      "pickup_distance": number
    }
  ]
  ```

### POST `/api/v1/rides/{ride_id}/request`
- **Purpose**: Request a seat in a specific ride.
- **Request Body**:
  ```json
  {
    "seats": number
  }
  ```
- **Response**: `201 Created` with request ID.

---

## 5. Ride Management (Driver Mode)

### POST `/api/v1/rides/create`
- **Purpose**: Create a new ride offering.
- **Request Body**:
  ```json
  {
    "origin": "string",
    "destination": "string",
    "origin_lat": number,
    "origin_lng": number,
    "destination_lat": number,
    "destination_lng": number,
    "departure_time": "ISO8601",
    "total_seats": number,
    "vehicle_id": "uuid"
  }
  ```
- **Response**: Created ride object.

### GET `/api/v1/rides/{ride_id}/requests`
- **Purpose**: Get list of passenger requests for a specific ride.
- **Response**:
  ```json
  [
    {
      "request_id": "uuid",
      "passenger_name": "string",
      "passenger_rating": number,
      "mutual_friends": number,
      "seats_requested": number,
      "pickup_location": "string",
      "status": "pending" | "accepted" | "declined"
    }
  ]
  ```

### PATCH `/api/v1/ride-requests/{request_id}`
- **Purpose**: Accept or decline a ride request.
- **Request Body**:
  ```json
  {
    "status": "accepted" | "declined"
  }
  ```
- **Response**: Updated request object.

---

## 6. Live Ride & Feedback

### GET `/api/v1/rides/{ride_id}`
- **Purpose**: Get complete details of an active ride (including driver's real-time location).
- **Response**: Ride details + live location coordinates.

### POST `/api/v1/rides/{ride_id}/feedback`
- **Purpose**: Submit feedback and rating after a ride.
- **Request Body**:
  ```json
  {
    "rating": number,
    "comment": "string"
  }
  ```
- **Response**: `200 OK`.

---

## 7. Account Safety

### GET `/api/v1/users/status`
- **Purpose**: Check if account is active or suspended.
- **Response**:
  ```json
  {
    "is_active": boolean,
    "suspension_reason": "string" (optional)
  }
  ```
