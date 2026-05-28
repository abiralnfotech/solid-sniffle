# Mutual Aid Ride-Sharing Network Backend

A production-ready FastAPI backend for a non-profit, community-driven ride-sharing network in Nepal.

## Tech Stack

- **FastAPI**: Modern, fast (high-performance) web framework.
- **SQLModel**: SQL databases in Python, combining SQLAlchemy and Pydantic.
- **PostgreSQL + PostGIS**: Relational database with spatial support for location tracking.
- **asyncpg**: Async database driver for PostgreSQL.
- **Pydantic v2**: Data validation and settings management.
- **Docker + Docker Compose**: Containerization and orchestration.
- **structlog**: Structured logging.

## Features

- **Clean Architecture**: Layered structure with API, Service, Repository, and Model layers.
- **Identity Verification (KYC)**: Support for document-based verification.
- **Live Tracking**: Designed for high-frequency GPS coordinate streaming (via PostGIS).
- **Goodwill Credits**: Immutable double-entry ledger system for community credits.
- **Automated Moderation**: Database triggers for credit rewards and user banning based on feedback.
- **Centralized Error Handling**: Standardized API responses for exceptions.
- **Logging Middleware**: Automatic request/response logging.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)

### Running with Docker

1. Clone the repository.
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Start the services:
   ```bash
   docker-compose up -d --build
   ```
4. Initialize the database (run inside the backend container):
   ```bash
   docker-compose exec backend python app/db/init_db.py
   ```

The API will be available at `http://localhost:8000`.
Swagger documentation is at `http://localhost:8000/docs`.

## Mobile App (Expo)

The mobile application is located in the `mobile/` directory.

### Prerequisites

- Node.js 18+
- Expo Go app on your mobile device (to run on physical hardware)

### Getting Started

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```

### Connecting to Backend

The mobile app is configured to automatically detect your computer's IP address and connect to the backend running on port 8000. Ensure your mobile device is on the same network as your development machine.

### Local Development

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install .
   ```
3. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

## Testing

Run tests using `pytest`:

```bash
PYTHONPATH=. pytest
```

## API Structure

- `/api/v1/`: Versioned API root.
- `/health`: Health check endpoint.
- `/docs`: Interactive API documentation (Swagger).
