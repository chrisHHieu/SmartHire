# ─────────────────────────────────────────
# Builder stage: install dependencies with uv
# ─────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install uv from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy lock files first (leverage Docker layer cache)
COPY pyproject.toml uv.lock ./

# Install dependencies only (--frozen: enforce lock file, --no-install-project: deps only)
RUN uv sync --frozen --no-cache --no-dev --no-install-project

# ─────────────────────────────────────────
# Final stage: minimal runtime image
# ─────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install uv binary
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Update PATH to use virtualenv
ENV PATH="/app/.venv/bin:$PATH"

# Python environment settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8 \
    UV_COMPILE_BYTECODE=1

# Create non-root user for security
RUN groupadd --system --gid 1001 appgroup \
    && useradd --system --uid 1001 --gid appgroup --no-create-home appuser

# Copy app source code
COPY . /app

# Create log and avatar directories with proper ownership
RUN mkdir -p /app/logs /app/avatars \
    && chmod +x /app/entrypoint.sh \
    && chown -R appuser:appgroup /app

# Expose API port
EXPOSE 5000

# Switch to non-root user
USER appuser

ENTRYPOINT ["/app/entrypoint.sh"]
