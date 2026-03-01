# Builder stage: cài đặt dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Cập nhật package và cài build tools
RUN apt-get update && \
    apt-get install -y curl gcc python3-dev build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Upgrade pip
RUN python -m pip install --upgrade pip

# Copy requirements và cài
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage: tối giản
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies từ builder stage (Python 3.11)
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

# Copy app
COPY . /app

# Chmod cho entrypoint
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
