#!/bin/sh
set -e

echo "========================================"
echo " SmartHire API Server — Starting..."
echo " Environment : ${APP_ENV:-production}"
echo " Host        : ${API_HOST:-0.0.0.0}"
echo " Port        : ${API_PORT:-5000}"
echo " Workers     : ${WORKERS:-4}"
echo "========================================"

exec uv run uvicorn app.main:app \
    --host "${API_HOST:-0.0.0.0}" \
    --port "${API_PORT:-5000}" \
    --timeout-keep-alive 1200 \
    --workers "${WORKERS:-4}"
