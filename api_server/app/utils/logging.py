"""
Logging configuration for FastAPI application.
Migrated from Flask-based to standalone Python logging.
"""

import logging
import os
from datetime import datetime

import pytz


def configure_logging():
    """
    Configure application logging with Vietnam timezone.
    No longer depends on Flask app instance.
    """
    basedir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), os.pardir, os.pardir)
    )

    # Ensure logs directory exists
    logs_dir = os.path.join(basedir, "logs")
    os.makedirs(logs_dir, exist_ok=True)

    log_file = os.path.join(logs_dir, "api.log")
    date_fmt = "%Y-%m-%d %H:%M:%S"

    # Create root logger
    root_logger = logging.getLogger()
    # Set root level to INFO to avoid noise from libraries
    root_logger.setLevel(logging.INFO)

    # Silence chatty libraries
    logging.getLogger("pymongo").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)

    # Set the timezone to Vietnam
    vietnam_timezone = pytz.timezone("Asia/Ho_Chi_Minh")

    # Configure logging with the Vietnam timezone
    logging.Formatter.converter = (
        lambda *args: pytz.utc.localize(datetime.utcnow())
        .astimezone(vietnam_timezone)
        .timetuple()
    )

    # Define the log format
    console_log_format = "%(asctime)s - %(levelname)s - %(message)s"
    file_log_format = (
        "%(asctime)s - %(levelname)s - %(message)s - (%(filename)s:%(lineno)d)"
    )

    # Create a console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(console_log_format, datefmt=date_fmt))
    root_logger.addHandler(console_handler)

    # Create a file handler
    file_handler = logging.FileHandler(filename=log_file, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(file_log_format, datefmt=date_fmt))
    root_logger.addHandler(file_handler)

    # If specifically debugging our app, we can set our app logger to DEBUG
    logging.getLogger("app").setLevel(logging.DEBUG)

    return root_logger
