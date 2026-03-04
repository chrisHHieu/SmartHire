#!/bin/sh
set -e

echo "========================================"
echo " SmartHire AI Engine — Starting..."
echo " Host        : 0.0.0.0"
echo " Port        : ${AI_PORT:-7000}"
echo " Workers     : ${WORKERS:-1}"
echo "========================================"

exec uv run uvicorn app:app \
    --host 0.0.0.0 \
    --port "${AI_PORT:-7000}" \
    --workers "${WORKERS:-1}"
