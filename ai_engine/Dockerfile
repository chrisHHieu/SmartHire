# Builder stage: cài đặt dependencies bằng uv
FROM python:3.11-slim AS builder

WORKDIR /app

# Cài uv (Copy binary từ image chính thức của uv để cực nhanh)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Cập nhật package và cài build tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy các file quản lý thư viện trước (để tận dụng Docker Cache)
COPY pyproject.toml uv.lock ./

# Cài đặt thư viện (Dùng --frozen để ép buộc dùng đúng file lock)
RUN uv sync --frozen --no-cache --no-dev --no-install-project

# Final stage: tối giản
FROM python:3.11-slim

WORKDIR /app

# Cài uv (Copy binary từ builder stage)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy virtual environment từ builder stage
COPY --from=builder /app/.venv /app/.venv

# Update PATH để dùng virtualenv
ENV PATH="/app/.venv/bin:$PATH"

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8 \
    UV_COMPILE_BYTECODE=1

# Copy app
COPY . /app

# Chmod cho entrypoint
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
