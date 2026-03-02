"""
Matching service - Business logic for matching operations.
Migrated from Flask to FastAPI (no Flask dependencies).
"""

import logging
import os
from math import ceil

import requests
from bson import ObjectId, errors
from fastapi import HTTPException

from app.database import get_database

# Analysis service URL
ANALYSIS_SERVICE_URL = os.environ.get("ANALYSIS_SERVICE_URL", "http://localhost:7000")

# Create logger for this module
logger = logging.getLogger(__name__)


# Helper function to serialize MongoDB ObjectId
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


def get_all_matching():
    db = get_database()
    result = list(db.matching.find())
    return result


def process_matching(matching_data: dict):
    db = get_database()

    job_name = matching_data["job_name"]
    job = db.job.find_one({"job_name": job_name})
    if not job:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_name}")

    # Get all candidate
    candidates = db.candidate.find()

    # Loop matching to calculate score for each candidate
    for candidate in candidates:
        # Check exist analyse
        matching_exist = db.matching.find_one(
            {"job_id": job["_id"], "candidate_id": candidate["_id"]}
        )

        if matching_exist:
            logger.info(
                f"Matching exist candidate & job: {candidate['candidate_name']} - {job['job_name']}"
            )
            continue

        matching_analyse = {
            "candidate": serialize_doc(candidate.copy()),
            "job": serialize_doc(job.copy()),
        }

        logger.info(
            f"Matching candidate & job: {candidate['candidate_name']} - {job['job_name']}"
        )

        analysis_endpoint_url = f"{ANALYSIS_SERVICE_URL}/matching/analyse"
        response = requests.post(analysis_endpoint_url, json=matching_analyse)

        # Check response status and return appropriate response
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Fail to analyse matching!")

        # Get the content of the response
        response_content = response.json()

        response_content["job_id"] = ObjectId(job["_id"])
        response_content["candidate_id"] = ObjectId(candidate["_id"])

        # Add to database
        try:
            collection = db.matching
            result = collection.insert_one(response_content)

            logger.info(f"id matching {result.inserted_id}")

        except Exception as e:
            logger.error(f"Upload document to Database failed! Error: {str(e)}")
            raise HTTPException(status_code=400, detail="Upload document to Database failed!")

    return {"message": "Analyse matching successfully!"}


def filter_matching_data(matching_data: dict):
    db = get_database()

    job_name = matching_data["job_name"]

    # Query the JobModel to get the job_id based on the job_name
    job_exist = db.job.find_one({"job_name": job_name})

    job_id = job_exist["_id"] if job_exist is not None else "id"

    # Filter
    results = filter_page(
        page_size=matching_data.get("page_size"),
        page=matching_data.get("page"),
        job_id=job_id,
    )

    return results


def filter_page(page_size, page, job_id):
    db = get_database()

    page_size = 10 if page_size is None else page_size
    page = 1 if page is None else page - 1

    # Connect to MongoDB and get the collection
    collection_candidate = db.candidate

    # Count total documents in the collection
    total_file = collection_candidate.count_documents({})

    # Calculate total pages
    total_page = ceil(total_file / page_size)

    # Validate page and page_size
    if page < 0 or page_size < 0:
        raise HTTPException(status_code=400, detail="Page number or page size is invalid.")

    # Create an empty list to store the modified candidates with scores.
    modified_results = []

    for candidate in collection_candidate.find():
        matching = db.matching.find_one(
            {"job_id": job_id, "candidate_id": candidate["_id"]}
        )

        if matching is not None:
            score = matching["score"]
            summary_comment = matching["summary_comment"]
            matching_status = True
        else:
            score = 0
            summary_comment = ""
            matching_status = False

        modified_results.append(
            {
                "id": candidate["_id"],
                "candidate_name": candidate["candidate_name"],
                "candidate_email": candidate["email"],
                "candidate_phone": candidate["phone_number"],
                "cv_name": candidate["cv_name"],
                "avatar_url": candidate.get("avatar_url", ""),
                "score": score,
                "summary_comment": summary_comment,
                "matching_status": matching_status,
            }
        )

    modified_results = sorted(
        modified_results, key=lambda candidate: int(candidate["score"]), reverse=True
    )

    # Implement pagination on the modified_results list.
    start_index = page * page_size
    end_index = start_index + page_size
    paginated_results = modified_results[start_index:end_index]

    return {
        "results": paginated_results,
        "total_page": total_page,
        "total_matching": total_file,
    }


def get_matching_data(candidate_id, job_id):
    db = get_database()

    # Validate ObjectId
    try:
        candidate_oid = ObjectId(candidate_id)
        job_oid = ObjectId(job_id)
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid candidate_id or job_id")

    matching = db.matching.find_one(
        {"job_id": job_oid, "candidate_id": candidate_oid}
    )

    candidate = db.candidate.find_one({"_id": candidate_oid})

    if not matching:
        return candidate

    job = db.job.find_one({"_id": job_oid})

    matching_detail = {
        "_id": str(matching["_id"]),
        "candidate_name": candidate.get("candidate_name", ""),
        "phone_number": candidate.get("phone_number", ""),
        "email": candidate.get("email", ""),
        "cv_name": candidate.get("cv_name", ""),
        "avatar_url": candidate.get("avatar_url", ""),
        "job_recommended": candidate.get("job_recommended", []),
        "job_name": job["job_name"],
        "score": matching.get("score", 0),
        "summary_comment": matching.get("summary_comment", ""),
        "degree": matching.get("degree", {"score": None, "comment": ""}),
        "experience": matching.get("experience", {"score": None, "comment": ""}),
        "responsibility": matching.get("responsibility", {"score": None, "comment": ""}),
        "soft_skill": matching.get("soft_skill", {"score": None, "comment": ""}),
        "technical_skill": matching.get("technical_skill", {"score": None, "comment": ""}),
        "certificate": matching.get("certificate", {"score": None, "comment": ""}),
        "language": matching.get("language", {"score": None, "comment": ""})
        if matching.get("language")
        else None,
        "weight_analysis": matching.get("weight_analysis"),
    }

    return matching_detail


def process_matching_selective(matching_data: dict):
    """
    Process matching for specific candidates with a job
    Args:
        matching_data: {"candidate_ids": ["id1", "id2"], "job_id": "job_id"}
    Returns:
        Matching results for each candidate
    """
    db = get_database()

    candidate_ids = matching_data["candidate_ids"]
    job_id_str = matching_data["job_id"]

    # Validate and convert job_id
    try:
        job_id = ObjectId(job_id_str)
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid job_id format")

    # Get job
    job = db.job.find_one({"_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail=f"Job not found with id: {job_id_str}")

    results = []
    matched_count = 0

    for candidate_id_str in candidate_ids:
        # Validate candidate_id
        try:
            candidate_id = ObjectId(candidate_id_str)
        except errors.InvalidId:
            logger.warning(f"Invalid candidate_id format: {candidate_id_str}")
            results.append(
                {
                    "candidate_id": candidate_id_str,
                    "error": "Invalid candidate_id format",
                }
            )
            continue

        # Get candidate
        candidate = db.candidate.find_one({"_id": candidate_id})
        if not candidate:
            logger.warning(f"Candidate not found: {candidate_id_str}")
            results.append(
                {
                    "candidate_id": candidate_id_str,
                    "error": "Candidate not found",
                }
            )
            continue

        # Check if matching already exists
        matching_exist = db.matching.find_one(
            {"job_id": job_id, "candidate_id": candidate_id}
        )

        if matching_exist:
            logger.info(
                f"Matching exists for candidate {candidate['candidate_name']} - job {job['job_name']}, returning existing result"
            )
            # Return existing matching result
            results.append(
                {
                    "candidate_id": candidate_id_str,
                    "candidate_name": candidate.get("candidate_name", ""),
                    "email": candidate.get("email", ""),
                    "phone_number": candidate.get("phone_number", ""),
                    "avatar_url": candidate.get("avatar_url", ""),
                    "cv_name": candidate.get("cv_name", ""),
                    "score": matching_exist.get("score", 0),
                    "summary_comment": matching_exist.get("summary_comment", ""),
                    "degree": matching_exist.get("degree"),
                    "experience": matching_exist.get("experience"),
                    "responsibility": matching_exist.get("responsibility"),
                    "soft_skill": matching_exist.get("soft_skill"),
                    "technical_skill": matching_exist.get("technical_skill"),
                    "certificate": matching_exist.get("certificate"),
                    "language": matching_exist.get("language"),
                    "weight_analysis": matching_exist.get("weight_analysis"),
                }
            )
            matched_count += 1
            continue

        # Perform new matching
        matching_analyse = {
            "candidate": serialize_doc(candidate.copy()),
            "job": serialize_doc(job.copy()),
        }

        logger.info(
            f"Matching candidate & job: {candidate['candidate_name']} - {job['job_name']}"
        )

        try:
            analysis_endpoint_url = f"{ANALYSIS_SERVICE_URL}/matching/analyse"
            response = requests.post(analysis_endpoint_url, json=matching_analyse)

            if response.status_code != 200:
                logger.error(f"Analysis service failed for candidate {candidate_id_str}")
                results.append(
                    {
                        "candidate_id": candidate_id_str,
                        "candidate_name": candidate.get("candidate_name", ""),
                        "error": "Failed to analyze matching",
                    }
                )
                continue

            # Get the content of the response
            response_content = response.json()
            response_content["job_id"] = job_id
            response_content["candidate_id"] = candidate_id

            # Save to database
            collection = db.matching
            insert_result = collection.insert_one(response_content)
            logger.info(f"Saved matching with id: {insert_result.inserted_id}")

            # Add to results
            results.append(
                {
                    "candidate_id": candidate_id_str,
                    "candidate_name": candidate.get("candidate_name", ""),
                    "email": candidate.get("email", ""),
                    "phone_number": candidate.get("phone_number", ""),
                    "avatar_url": candidate.get("avatar_url", ""),
                    "cv_name": candidate.get("cv_name", ""),
                    "score": response_content.get("score", 0),
                    "summary_comment": response_content.get("summary_comment", ""),
                    "degree": response_content.get("degree"),
                    "experience": response_content.get("experience"),
                    "responsibility": response_content.get("responsibility"),
                    "soft_skill": response_content.get("soft_skill"),
                    "technical_skill": response_content.get("technical_skill"),
                    "certificate": response_content.get("certificate"),
                    "language": response_content.get("language"),
                    "weight_analysis": response_content.get("weight_analysis"),
                }
            )
            matched_count += 1

        except Exception as e:
            logger.error(f"Error processing candidate {candidate_id_str}: {str(e)}")
            results.append(
                {
                    "candidate_id": candidate_id_str,
                    "candidate_name": candidate.get("candidate_name", ""),
                    "error": f"Processing error: {str(e)}",
                }
            )

    # Sort results by score (descending)
    results_sorted = sorted(
        [r for r in results if "score" in r],
        key=lambda x: x["score"],
        reverse=True,
    )

    # Add error results at the end
    error_results = [r for r in results if "error" in r]
    results_sorted.extend(error_results)

    return {
        "success": True,
        "job_id": job_id_str,
        "job_name": job.get("job_name", ""),
        "total_matched": matched_count,
        "results": results_sorted,
    }
