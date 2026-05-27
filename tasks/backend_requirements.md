Create a production-ready FastAPI backend project with the following requirements:

Tech stack:
- FastAPI
- PostgreSQL
- SQLModel
- Pydantic v2
- Uvicorn
- Docker + Docker Compose

Project requirements:
- Clean and scalable folder structure
- Environment variable support using .env
- Proper config management
- Async database connection pool
- Database helper utilities
- Health check endpoint
- Versioned API structure (/api/v1/)
- Request validation
- Centralized exception handling
- Logging middleware
- CORS configuration
- README with setup instructions
- .gitignore
- pyproject.toml

Swagger/OpenAPI:
- Fully working Swagger docs
- Proper endpoint descriptions
- Response models
- Tags/groups for routes
- Example request/response schemas
- API metadata (title, description, version)

Database requirements:
- PostgreSQL via asyncpg
- Repository/service pattern
- SQL files or query organization structure
- Connection pooling
- Transaction helpers

Use:
- async/await everywhere
- proper typing
- modern FastAPI practices
- dependency injection

Create:
- Dockerfile
- docker-compose.yml
- example .env
- startup scripts
