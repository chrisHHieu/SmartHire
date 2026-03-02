#!/bin/sh

echo "Run app with uvicorn server using uv..."
uv run uvicorn app:app --port 7000 --host 0.0.0.0 --workers 1
