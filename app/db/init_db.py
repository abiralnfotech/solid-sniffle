import asyncio
from sqlalchemy import text
from app.db.session import engine
from app.models.models import SQLModel

async def init_db():
    async with engine.begin() as conn:
        # Enable extensions
        await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
        await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "postgis";'))

        # Create tables
        await conn.run_sync(SQLModel.metadata.create_all)

        # Add constraints, triggers and other DDL from tasks/ddl.md that SQLModel might not handle perfectly

        # 1. Enums are handled by SQLModel/SQLAlchemy if we use them in models,
        # but let's ensure the tables have the right constraints

        # 2. User phone number regex constraint
        await conn.execute(text("""
            ALTER TABLE users
            DROP CONSTRAINT IF EXISTS valid_nepal_phone;
            ALTER TABLE users
            ADD CONSTRAINT valid_nepal_phone CHECK (phone_number ~ '^\+9779[78]\d{8}$');
        """))

        # 3. KYC constraints
        await conn.execute(text("""
            ALTER TABLE kyc_verifications
            DROP CONSTRAINT IF EXISTS valid_doc_type;
            ALTER TABLE kyc_verifications
            ADD CONSTRAINT valid_doc_type CHECK (document_type IN ('nagarikta', 'rashtriya_parichayapatra'));

            ALTER TABLE kyc_verifications
            DROP CONSTRAINT IF EXISTS driver_mode_requires_license;
            ALTER TABLE kyc_verifications
            ADD CONSTRAINT driver_mode_requires_license CHECK (
                (driver_license_number IS NULL AND driver_license_url IS NULL) OR
                (driver_license_number IS NOT NULL AND driver_license_url IS NOT NULL)
            );
        """))

        # 4. Driver Route constraints
        await conn.execute(text("""
            ALTER TABLE driver_routes
            DROP CONSTRAINT IF EXISTS positive_seats;
            ALTER TABLE driver_routes
            ADD CONSTRAINT positive_seats CHECK (available_seats > 0);
        """))

        # 5. Ride constraints
        await conn.execute(text("""
            ALTER TABLE rides
            DROP CONSTRAINT IF EXISTS positive_fare;
            ALTER TABLE rides
            ADD CONSTRAINT positive_fare CHECK (fixed_fare_credits > 0);

            ALTER TABLE rides
            DROP CONSTRAINT IF EXISTS valid_seat_count;
            ALTER TABLE rides
            ADD CONSTRAINT valid_seat_count CHECK (seat_count > 0);
        """))

        # 6. Credit Ledger constraints
        await conn.execute(text("""
            ALTER TABLE credit_ledger
            DROP CONSTRAINT IF EXISTS non_zero_transaction;
            ALTER TABLE credit_ledger
            ADD CONSTRAINT non_zero_transaction CHECK (amount <> 0);
        """))

        # 7. Ride Review constraints
        await conn.execute(text("""
            ALTER TABLE ride_reviews
            DROP CONSTRAINT IF EXISTS unique_ride_reviewer;
            ALTER TABLE ride_reviews
            ADD CONSTRAINT unique_ride_reviewer UNIQUE (ride_id, reviewer_id);
        """))

        # 8. Indexes
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_driver_routes_start ON driver_routes USING GIST(start_location);"))
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_driver_location_stream_geo ON driver_location_streams USING GIST(current_gps_coordinate);"))
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_driver_location_stream_ride_time ON driver_location_streams(ride_id, captured_at DESC);"))
        await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_ledger_user_balance ON credit_ledger(user_id, amount);"))

        # 9. User balance view
        await conn.execute(text("""
            CREATE OR REPLACE VIEW view_user_balances AS
            SELECT
                user_id,
                COALESCE(SUM(amount), 0) AS total_balance
            FROM credit_ledger
            GROUP BY user_id;
        """))

        # 10. Genesis credits trigger
        await conn.execute(text("""
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
        """))

        await conn.execute(text("""
            DROP TRIGGER IF EXISTS trg_kyc_approved ON kyc_verifications;
            CREATE TRIGGER trg_kyc_approved
            AFTER UPDATE ON kyc_verifications
            FOR EACH ROW
            EXECUTE FUNCTION grant_genesis_credits();
        """))

        # 11. Automated System Moderation & Banning Trigger
        await conn.execute(text("""
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
        """))

        await conn.execute(text("""
            DROP TRIGGER IF EXISTS trg_after_review_insert ON ride_reviews;
            CREATE TRIGGER trg_after_review_insert
            AFTER INSERT ON ride_reviews
            FOR EACH ROW
            EXECUTE FUNCTION assess_user_moderation();
        """))

if __name__ == "__main__":
    asyncio.run(init_db())
