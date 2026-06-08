-- Sahayatri Complete Database DDL (PostgreSQL + PostGIS)

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Define Custom Types (Enums)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'active', 'awaiting_confirmation', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE flag_reason AS ENUM ('reckless_driving', 'unpunctual', 'inappropriate_behavior', 'asked_for_cash', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Tables

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    profile_picture_url TEXT,
    role user_role DEFAULT 'passenger' NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT valid_nepal_phone CHECK (phone_number ~ '^\+9779[78]\d{8}$')
);

-- Device Auth Table
CREATE TABLE IF NOT EXISTS user_device_auth (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    biometric_public_key TEXT,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- KYC Verification Table
CREATE TABLE IF NOT EXISTS kyc_verifications (
    kyc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    driver_license_number VARCHAR(50) UNIQUE,
    identity_front_url TEXT NOT NULL,
    identity_back_url TEXT NOT NULL,
    selfie_image_url TEXT,
    driver_license_url TEXT,
    status verification_status DEFAULT 'pending' NOT NULL,
    reviewed_by UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    CONSTRAINT valid_doc_type CHECK (document_type IN ('nagarikta', 'rashtriya_parichayapatra', 'citizenship', 'license')),
    CONSTRAINT driver_mode_requires_license CHECK (
        (driver_license_number IS NULL AND driver_license_url IS NULL) OR
        (driver_license_number IS NOT NULL AND driver_license_url IS NOT NULL)
    )
);

-- Driver Routes (Ride Offerings)
CREATE TABLE IF NOT EXISTS driver_routes (
    route_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    start_location GEOGRAPHY(POINT, 4326) NOT NULL,
    destination_location GEOGRAPHY(POINT, 4326) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    available_seats INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT positive_seats CHECK (available_seats > 0)
);

-- Rides (Passenger Requests/Bookings)
CREATE TABLE IF NOT EXISTS rides (
    ride_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES driver_routes(route_id) ON DELETE CASCADE,
    passenger_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status ride_status DEFAULT 'requested' NOT NULL,
    fixed_fare_credits INTEGER NOT NULL,
    seat_count INTEGER DEFAULT 1 NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT positive_fare CHECK (fixed_fare_credits > 0),
    CONSTRAINT valid_seat_count CHECK (seat_count > 0)
);

-- Ride Reviews
CREATE TABLE IF NOT EXISTS ride_reviews (
    review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID NOT NULL REFERENCES rides(ride_id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(user_id),
    reviewee_id UUID NOT NULL REFERENCES users(user_id),
    is_good_experience BOOLEAN NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_ride_reviewer UNIQUE (ride_id, reviewer_id)
);

-- Review Safety Tags
CREATE TABLE IF NOT EXISTS review_safety_tags (
    tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES ride_reviews(review_id) ON DELETE CASCADE,
    reason flag_reason NOT NULL
);

-- Driver Location Stream (Real-time tracking)
CREATE TABLE IF NOT EXISTS driver_location_streams (
    stream_id SERIAL PRIMARY KEY,
    ride_id UUID NOT NULL REFERENCES rides(ride_id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(user_id),
    current_gps_coordinate GEOGRAPHY(POINT, 4326) NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Emergency SOS Alerts
CREATE TABLE IF NOT EXISTS emergency_sos_alerts (
    sos_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ride_id UUID REFERENCES rides(ride_id) ON DELETE SET NULL,
    triggered_by UUID NOT NULL REFERENCES users(user_id),
    last_known_gps GEOGRAPHY(POINT, 4326) NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Credit Ledger (Wallet Transactions)
CREATE TABLE IF NOT EXISTS credit_ledger (
    ledger_id SERIAL PRIMARY KEY,
    ride_id UUID REFERENCES rides(ride_id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Positive for credit in, negative for credit out
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT non_zero_transaction CHECK (amount <> 0)
);

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_driver_routes_start ON driver_routes USING GIST(start_location);
CREATE INDEX IF NOT EXISTS idx_driver_location_stream_geo ON driver_location_streams USING GIST(current_gps_coordinate);
CREATE INDEX IF NOT EXISTS idx_driver_location_stream_ride_time ON driver_location_streams(ride_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_user_balance ON credit_ledger(user_id, amount);

-- 5. Create Views
CREATE OR REPLACE VIEW view_user_balances AS
SELECT
    user_id,
    COALESCE(SUM(amount), 0) AS total_balance
FROM credit_ledger
GROUP BY user_id;

-- 6. Functions and Triggers

-- Genesis Credits Trigger Function
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

DROP TRIGGER IF EXISTS trg_kyc_approved ON kyc_verifications;
CREATE TRIGGER trg_kyc_approved
AFTER UPDATE ON kyc_verifications
FOR EACH ROW
EXECUTE FUNCTION grant_genesis_credits();

-- Automated System Moderation & Banning Trigger Function
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

DROP TRIGGER IF EXISTS trg_after_review_insert ON ride_reviews;
CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON ride_reviews
FOR EACH ROW
EXECUTE FUNCTION assess_user_moderation();
