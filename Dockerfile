FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements/metadata files
COPY pyproject.toml README.md ./
# Copy the app directory so pip install . can find the package
COPY app/ ./app/

# Install python dependencies
RUN pip install --no-cache-dir .

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]