#!/bin/sh

echo "Start run entrypoint script..."

echo "Enviroment:" $APP_ENV

if [ "$APP_ENV" = "local" ]; then
    echo "Run app with uvicorn server using uv..."
    uv run uvicorn app.main:app --host $API_HOST --port $API_PORT --timeout-keep-alive 1200 --workers 4;
fi
