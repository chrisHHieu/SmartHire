"""
FastAPI Application Entry Point.
Replaces Flask's __init__.py with create_app() factory.
"""

import json
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

# Load environment variables FIRST (before any module that reads them)
if os.path.exists(".env.local"):
    load_dotenv(".env.local")
else:
    load_dotenv()

from app.database import close_database  # noqa: E402
from app.routers.candidate_router import router as candidate_router  # noqa: E402
from app.routers.job_router import router as job_router  # noqa: E402
from app.routers.matching_router import router as matching_router  # noqa: E402
from app.utils.logging import configure_logging  # noqa: E402

logger = logging.getLogger(__name__)


# ─── Custom JSON encoder for MongoDB types ────────────────
class MongoJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles MongoDB ObjectId and datetime."""

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


class MongoJSONResponse(JSONResponse):
    """Custom JSONResponse that uses MongoJSONEncoder."""

    def render(self, content) -> bytes:
        return json.dumps(
            content,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
            cls=MongoJSONEncoder,
        ).encode("utf-8")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown events."""
    # Startup
    configure_logging()
    yield
    # Shutdown
    close_database()


# Create FastAPI app with custom default response class
app = FastAPI(
    title="SmartHire REST API",
    version="v1",
    description="SmartHire - AI-powered recruitment matching system",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    default_response_class=MongoJSONResponse,
)

# ─── CORS Middleware ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static files: serve avatars ──────────────────────────
avatars_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "avatars")
os.makedirs(avatars_dir, exist_ok=True)
app.mount("/avatars", StaticFiles(directory=avatars_dir), name="avatars")

# ─── Include Routers ─────────────────────────────────────
app.include_router(candidate_router)
app.include_router(job_router)
app.include_router(matching_router)


# ─── Global exception handler ────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all for unhandled exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return MongoJSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
    )


# ─── Health check ─────────────────────────────────────────
@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "SmartHire API", "framework": "FastAPI"}
