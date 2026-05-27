It implements strict data integrity constraints, PostGIS for location-based tracking/matching, a double-entry ledger architecture to guarantee credit security, and automated database triggers for calculations and automated moderation/banning.
Prerequisites

Make sure your PostgreSQL instance has the postgis and uuid-ossp extensions enabled.
SQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

1. Enums and Custom Types
SQL

CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin', 'super_admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'active', 'completed', 'cancelled');
CREATE TYPE flag_reason AS ENUM ('reckless_driving', 'unpunctual', 'inappropriate_behavior', 'asked_for_cash', 'other');

2. User Authentication & KYC
SQL

-- Core Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Regex enforces Nepalese mobile numbers format starting with +977 97 or +977 98
    phone_number VARCHAR(15) UNIQUE NOT NULL 
        CONSTRAINT valid_nepal_phone CHECK (phone_number ~ '^\+9779[78]\d{8}$'),
    full_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'passenger' NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Separate table for sensitive biometric & auth tokens (mock representation for local device linking)
CREATE TABLE user_device_auth (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    biometric_public_key TEXT, -- Stored securely for device handshakes
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Strict Identity Verification (KYC) Table
CREATE TABLE kyc_verifications (
    kyc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Strict Unique Constraints for Document Strings to prevent duplication
    document_type VARCHAR(50) NOT NULL CONSTRAINT valid_doc_type CHECK (document_type IN ('nagarikta', 'rashtriya_parichayapatra')),
    document_number VARCHAR(50) UNIQUE NOT NULL, 
    driver_license_number VARCHAR(50) UNIQUE, -- Optional unless driver mode requested
    
    -- Document Image URIs
    identity_front_url TEXT NOT NULL,
    identity_back_url TEXT NOT NULL,
    driver_license_url TEXT, 
    
    status verification_status DEFAULT 'pending' NOT NULL,
    reviewed_by UUID REFERENCES users(user_id), -- Admin User ID
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    CONSTRAINT driver_mode_requires_license CHECK (
        (driver_license_number IS NULL AND driver_license_url IS NULL) OR 
        (driver_license_number IS NOT NULL AND driver_license_url IS NOT NULL)
    )
);

3. Routes, Rides, & Live Location Engine
SQL

-- Driver Route Publishing
CREATE TABLE driver_routes (
    route_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    start_location GEOGRAPHY(Point, 4326) NOT NULL, -- PostGIS Geog points
    destination_location GEOGRAPHY(Point, 4326) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    available_seats INT NOT NULL CONSTRAINT positive_seats CHECK (available_seats > 0),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Ride Bookings & State Machine
CREATE TABLE rides (
    ride_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES driver_routes(route_id) ON DELETE RESTRICT NOT NULL,
    passenger_id UUID REFERENCES users(user_id) ON DELETE RESTRICT NOT NULL,
    status ride_status DEFAULT 'requested' NOT NULL,
    fixed_fare_credits INT NOT NULL CONSTRAINT positive_fare CHECK (fixed_fare_credits > 0),
    seat_count INT DEFAULT 1 NOT NULL CONSTRAINT valid_seat_count CHECK (seat_count > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- High-frequency Live GPS Tracking Table
CREATE TABLE driver_location_streams (
    stream_id BIGSERIAL PRIMARY KEY, -- Using Bigserial for high throughput time-series data
    ride_id UUID REFERENCES rides(ride_id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    current_gps_coordinate GEOGRAPHY(Point, 4326) NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexing for geo-spatial proximity matching and quick map lookups
CREATE INDEX idx_driver_routes_start ON driver_routes USING GIST(start_location);
CREATE INDEX idx_driver_location_stream_geo ON driver_location_streams USING GIST(current_gps_coordinate);
CREATE INDEX idx_driver_location_stream_ride_time ON driver_location_streams(ride_id, captured_at DESC);

4. Secure Community Credit Ledger (Double-Entry)

To calculate user balances safely, balances are never updated via standard row edits. Instead, every transaction writes an immutable row into the ledger. A user's total balance is derived via SUM(amount).
SQL

CREATE TABLE credit_ledger (
    ledger_id BIGSERIAL PRIMARY KEY,
    ride_id UUID REFERENCES rides(ride_id), -- NULL for Genesis/System adjustments
    user_id UUID REFERENCES users(user_id) ON DELETE RESTRICT NOT NULL,
    
    -- Positive value implies Credit In (Earnings/Genesis), Negative implies Credit Out (Fares/Escrow)
    amount INT NOT NULL CONSTRAINT non_zero_transaction CHECK (amount <> 0), 
    
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexing to ensure the SUM() aggregate executes lightning-fast
CREATE INDEX idx_ledger_user_balance ON credit_ledger(user_id, amount);

Ledger Helper View
SQL

CREATE VIEW view_user_balances AS
SELECT 
    user_id,
    COALESCE(SUM(amount), 0) AS total_balance
FROM credit_ledger
GROUP BY user_id;

5. Feedback, Moderation, & Emergency SOS
SQL

-- Binary Reviews Table
CREATE TABLE ride_reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(ride_id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES users(user_id) ON DELETE RESTRICT NOT NULL,
    reviewee_id UUID REFERENCES users(user_id) ON DELETE RESTRICT NOT NULL,
    
    is_good_experience BOOLEAN NOT NULL, -- True = 👍, False = 👎
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT unique_ride_reviewer UNIQUE (ride_id, reviewer_id)
);

-- Safety Tags for Negative Feedback
CREATE TABLE review_safety_tags (
    tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES ride_reviews(review_id) ON DELETE CASCADE NOT NULL,
    reason flag_reason NOT NULL
);

-- Instant SOS Telemetry
CREATE TABLE emergency_sos_alerts (
    sos_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(ride_id) ON DELETE SET NULL,
    triggered_by UUID REFERENCES users(user_id) ON DELETE RESTRICT NOT NULL,
    last_known_gps GEOGRAPHY(Point, 4326) NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

6. Database Automation & Guardrails (Triggers)
Trigger A: Automated Genesis Credits Upon Approved KYC

When an admin marks a KYC profile as approved, this trigger automatically inserts a fixed genesis credit pool (+50 tokens) into the immutable ledger.
SQL

CREATE OR REPLACE FUNCTION grant_genesis_credits()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        INSERT INTO credit_ledger (user_id, amount, description)
        VALUES (NEW.user_id, 50, 'Genesis Startup Credits - Account Verified');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kyc_approved
AFTER UPDATE ON kyc_verifications
FOR EACH ROW
EXECUTE FUNCTION grant_genesis_credits();

Trigger B: Automated System Moderation & Banning

Whenever a review is posted, this engine evaluates the user's ratio of bad reviews. If they have completed more than 10 rides and their negative feedback ratio crosses 15%, their account status changes to is_banned = TRUE.
SQL

CREATE OR REPLACE FUNCTION assess_user_moderation()
RETURNS TRIGGER AS $$
DECLARE
    total_reviews INT;
    bad_reviews INT;
    negative_ratio NUMERIC;
BEGIN
    -- Count review history for the person who just received the rating
    SELECT COUNT(*), COUNT(*) FILTER (WHERE is_good_experience = FALSE)
    INTO total_reviews, bad_reviews
    FROM ride_reviews
    WHERE reviewee_id = NEW.reviewee_id;

    IF total_reviews >= 10 THEN
        negative_ratio := (bad_reviews::NUMERIC / total_reviews::NUMERIC) * 100;
        
        IF negative_ratio > 15.0 THEN
            UPDATE users 
            SET is_banned = TRUE 
            WHERE user_id = NEW.reviewee_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON ride_reviews
FOR EACH ROW
EXECUTE FUNCTION assess_user_moderation();