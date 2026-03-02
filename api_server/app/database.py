"""
MongoDB connection module using PyMongo directly (no Flask dependency).
Provides a singleton database instance for the application.
"""

import os
from pymongo import MongoClient

# Global database instance
_client: MongoClient | None = None
_db = None


def get_database():
    """
    Get MongoDB database instance.
    Creates connection on first call, reuses on subsequent calls.
    """
    global _client, _db

    if _db is None:
        mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")
        if not mongo_uri:
            raise ValueError(
                "❌ MONGO_URI chưa được cấu hình. "
                "Vui lòng set trong .env hoặc environment variables."
            )

        _client = MongoClient(mongo_uri)
        # Extract database name from URI, fallback to "smarthire"
        db_name = mongo_uri.rsplit("/", 1)[-1].split("?")[0] if "/" in mongo_uri else "smarthire"
        _db = _client[db_name]

    return _db


def close_database():
    """Close MongoDB connection."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
