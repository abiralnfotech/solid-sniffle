#!/usr/bin/env bash
set -eo pipefail

echo "=============================================================================="
echo "Starting solid sniffle FastAPI Backend Service"
echo "=============================================================================="

# Wait for Postgres port to be open using a robust python snippet
echo "Waiting for PostgreSQL database at ${POSTGRES_SERVER}:${POSTGRES_PORT}..."
python3 -c "
import socket
import time
import os
import sys

host = os.environ.get('POSTGRES_SERVER', 'localhost')
port = int(os.environ.get('POSTGRES_PORT', 5432))

start_time = time.time()
timeout = 60 # 60 seconds timeout

while True:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1.0)
            s.connect((host, port))
            print('\n[SUCCESS] PostgreSQL is online and accepting TCP traffic!')
            sys.exit(0)
    except socket.error:
        elapsed = time.time() - start_time
        if elapsed > timeout:
            print('\n[ERROR] Timeout waiting for PostgreSQL to become online. Exiting.')
            sys.exit(1)
        sys.stdout.write('.')
        sys.stdout.flush()
        time.sleep(1.0)
"

echo "Database is online. Running database initialization..."
PYTHONPATH=. python3 app/db/init_db.py

echo "Database initialization complete. Starting Uvicorn ASGI Server..."
exec uvicorn app.main:app --host "${HOST:-0.0.0.0}" --port "${PORT:-8000}" --reload