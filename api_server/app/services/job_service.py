"""
Job service - Business logic for job operations.
Migrated from Flask to FastAPI (no Flask dependencies).
"""

import logging
import os
from datetime import datetime
from math import ceil

import requests
from bson.objectid import ObjectId
from fastapi import HTTPException
from pytz import timezone

from app.database import get_database

# Analysis service URL
ANALYSIS_SERVICE_URL = os.environ.get("ANALYSIS_SERVICE_URL", "http://localhost:7000")

# Create logger for this module
logger = logging.getLogger(__name__)


def get_all_job():
    db = get_database()
    collection = db.job
    result = list(collection.find())
    return result


def post_job(job_data: dict):
    """
    Create new job with comprehensive Two-Stage AI analysis.

    This function now:
    1. Calls analysis service which performs Two-Stage AI
    2. Receives job requirements + dynamic_weights + weight_analysis
    3. Stores everything in MongoDB for future matching operations
    """
    db = get_database()

    job_data["job_name"] = job_data["job_name"].strip()
    job_data["job_description"] = job_data["job_description"].strip()
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    logger.info("=" * 80)
    logger.info(f"Creating new job: {job_data['job_name']}")
    logger.info("=" * 80)

    # Call analysis service (now includes Two-Stage AI)
    analysis_endpoint_url = f"{ANALYSIS_SERVICE_URL}/job/analyse"
    response = requests.post(analysis_endpoint_url, json=job_data)

    # Check response status and return appropriate response
    if response.status_code != 200:
        logger.error(f"Failed to analyse job: {job_data['job_name']}")
        raise HTTPException(
            status_code=400,
            detail=f"Fail to analyse job! Job name: {job_data['job_name']}",
        )

    # Get the content of the response (includes requirements + weights)
    response_content = response.json()

    # Log what we received
    if "dynamic_weights" in response_content:
        logger.info("Received dynamic weights from analysis service")
        logger.info(f"Weights: {response_content['dynamic_weights']}")
        if "weight_analysis" in response_content:
            confidence = response_content["weight_analysis"].get("confidence", "N/A")
            logger.info(f"AI confidence: {confidence}")
    else:
        logger.warning("No dynamic weights in response (using fallback)")

    response_content["job_name"] = job_data["job_name"]
    response_content["job_description"] = job_data["job_description"]
    response_content["created_at"] = created_at

    # Add to database (includes dynamic_weights and weight_analysis)
    try:
        collection = db.job
        result = collection.insert_one(response_content)

        job_id = str(result.inserted_id)
        logger.info(f"Job saved to database with ID: {job_id}")
        logger.info("=" * 80)

    except Exception as e:
        logger.error(f"Failed to save to database: {str(e)}")
        raise HTTPException(status_code=400, detail="Upload document to Database failed!")

    return response_content


def get_list_job(job_data: dict):
    page_size = job_data.get("page_size") or 10
    page = job_data.get("page") or 1

    try:
        results, total_page, total_job = filter_page(page_size=page_size, page=page)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Can not get list file! Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Can not get list file!")

    return {"results": results, "total_page": total_page, "total_job": total_job}


def filter_page(page_size: int = 10, page: int = 1):
    db = get_database()
    collection = db.job

    # Count total documents in the collection
    total_job = collection.count_documents({})

    # Calculate total pages
    total_page = ceil(total_job / page_size)

    # Validate page and page_size
    if page < 1 or page_size < 1:
        raise HTTPException(status_code=400, detail="Page number or page size is invalid.")

    # Calculate skip and limit values for pagination
    skip = (page - 1) * page_size

    # Retrieve documents with pagination
    results = list(collection.find().skip(skip).limit(page_size))

    return results, total_page, total_job


def get_job(job_id: str):
    db = get_database()
    collection = db.job
    result = collection.find_one({"_id": ObjectId(job_id)})
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
    return result


def update_job(job_data: dict, job_id: str):
    """
    Update job and re-run Two-Stage AI analysis if job content changed.

    If job_name or job_description changes, we need to:
    1. Re-analyze the job (including Two-Stage AI)
    2. Generate new dynamic weights
    3. Update everything in database
    4. Note: Existing matching results will use old weights until re-matched
    """
    db = get_database()

    job_data["job_name"] = job_data["job_name"].strip()
    job_data["job_description"] = job_data["job_description"].strip()
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    collection = db.job
    job_exist = collection.find_one({"_id": ObjectId(job_id)})
    if not job_exist:
        raise HTTPException(status_code=404, detail="Job not found")

    if (
        job_exist["job_name"] != job_data["job_name"]
        or job_exist["job_description"] != job_data["job_description"]
    ):
        logger.info("=" * 80)
        logger.info(f"Updating job: {job_data['job_name']}")
        logger.info("Job content changed - re-running Two-Stage AI analysis")
        logger.info("=" * 80)

        # Re-analyze job (includes Two-Stage AI)
        analysis_endpoint_url = f"{ANALYSIS_SERVICE_URL}/job/analyse"
        response = requests.post(analysis_endpoint_url, json=job_data)

        # Check response status and return appropriate response
        if response.status_code != 200:
            logger.error(f"Failed to re-analyse job: {job_data['job_name']}")
            raise HTTPException(
                status_code=400,
                detail=f"Fail to analyse job! Job name: {job_data['job_name']}",
            )

        # Get the content of the response (includes new weights)
        response_content = response.json()

        # Log what we received
        if "dynamic_weights" in response_content:
            logger.info("Received new dynamic weights")
            logger.info(f"New weights: {response_content['dynamic_weights']}")
        else:
            logger.warning("No dynamic weights in response")

        response_content["job_name"] = job_data["job_name"]
        response_content["job_description"] = job_data["job_description"]
        response_content["created_at"] = created_at

        result = collection.update_one(
            {"_id": ObjectId(job_id)}, {"$set": response_content}
        )

        if result.modified_count == 1:
            logger.info("Job updated successfully")
            logger.info("Note: Existing matching results still use old weights")
            logger.info("Re-run matching to use new weights")
            logger.info("=" * 80)
            return {"message": "Document updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")

    logger.info("No changes detected - skipping analysis")
    return {"message": "Document updated successfully"}


def delete_job(job_id: str):
    db = get_database()
    result = db.job.delete_one({"_id": ObjectId(job_id)})
    if result.deleted_count == 1:
        # Clean matching
        db.matching.delete_many({"job_id": ObjectId(job_id)})
        return {"message": "Document deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Document not found!")
