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
        # SQLModel.metadata.create_all(engine) doesn't work directly with async engine in this way
        # we use run_sync
        await conn.run_sync(SQLModel.metadata.create_all)

        # Add triggers and other DDL from tasks/ddl.md that SQLModel might not handle perfectly
        # For example, custom checks, triggers, views

        # User balance view
        await conn.execute(text("""
            CREATE OR REPLACE VIEW view_user_balances AS
            SELECT
                user_id,
                COALESCE(SUM(amount), 0) AS total_balance
            FROM credit_ledger
            GROUP BY user_id;
        """))

        # Genesis credits trigger
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

if __name__ == "__main__":
    asyncio.run(init_db())
