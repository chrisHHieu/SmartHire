"""
Candidate service - Business logic for candidate operations.
Migrated from Flask to FastAPI (no Flask dependencies).
"""

import base64
import hashlib
import logging
import os
import time
from datetime import datetime
from math import ceil

import requests
from bson.objectid import ObjectId
from fastapi import HTTPException, UploadFile
from pytz import timezone

from app.database import get_database

# Avatar storage directory
AVATAR_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "avatars",
)
os.makedirs(AVATAR_DIR, exist_ok=True)

# Analysis service URL
AI_ENGINE_URL = os.environ.get("AI_ENGINE_URL", "http://localhost:7000")

# Create logger for this module
logger = logging.getLogger(__name__)


def get_candiate(candiate_id: str):
    db = get_database()
    result = db.candidate.find_one({"_id": ObjectId(candiate_id)})
    if not result:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return result


def get_list_candidate(file_data: dict):
    page_size = file_data.get("page_size") or 10
    page = file_data.get("page") or 1

    try:
        results, total_page, total_file = filter_page(page_size=page_size, page=page)
    except Exception as e:
        logger.error(f"Can not get list file! Error: {str(e)}")
        # Return empty results instead of aborting
        results = []
        total_page = 0
        total_file = 0

    return {"results": results, "total_page": total_page, "total_file": total_file}


def filter_page(page_size: int = 10, page: int = 1):
    db = get_database()
    collection = db.candidate

    # Count total documents in the collection
    total_file = collection.count_documents({})

    # Calculate total pages (handle empty database)
    total_page = ceil(total_file / page_size) if page_size > 0 else 0

    # Validate page and page_size
    if page < 1 or page_size < 1:
        raise HTTPException(status_code=400, detail="Page number or page size is invalid.")

    # Calculate skip and limit values for pagination
    skip = (page - 1) * page_size

    # Retrieve documents with pagination
    results = list(collection.find().skip(skip).limit(page_size))

    return results, total_page, total_file


def update_candidate(candidate_data: dict, candidate_id: str):
    db = get_database()
    collection = db.candidate
    result = collection.update_one(
        {"_id": ObjectId(candidate_id)}, {"$set": candidate_data}
    )
    if result.modified_count == 1:
        return {"message": "Document updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Document not found")


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"pdf", "docx"}


def process_upload_file(file: UploadFile, file_content: bytes):
    db = get_database()

    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # Check type pdf or docx
    if not allowed_file(file.filename):
        logger.error("Invalid file type. Allowed types: pdf, docx!")
        return None

    # Compute the SHA-256 hash of the file contents
    filehash = hashlib.sha256(file_content).hexdigest()

    # Check hashfile
    if db.candidate.find_one({"filehash": filehash}):
        logger.error(f"CV candidate is exists! File name: {file.filename}")
        return None

    # Send file to analysis service
    analysis_endpoint_url = f"{AI_ENGINE_URL}/candidate/analyse"
    files = {"file": (file.filename, file_content, file.content_type or "application/octet-stream")}
    response = requests.post(analysis_endpoint_url, files=files)

    # Check response status and return appropriate response
    if response.status_code != 200:
        logger.error(f"Fail to analyse CV candidate! File name: {file.filename}")
        return None

    # Get the content of the response
    response_content = response.json()

    # Map field names from Analysis Service to Backend schema
    if "full_name" in response_content:
        response_content["candidate_name"] = response_content.pop("full_name")
    if "phone" in response_content:
        response_content["phone_number"] = response_content.pop("phone")

    # Keep structured data and create legacy fields for backward compatibility

    # Extract skills from structured data if available
    if "skills" in response_content and response_content["skills"]:
        response_content["structured_skills"] = response_content["skills"]
        skills_list = []
        for skill in response_content["skills"]:
            if isinstance(skill, dict) and "name" in skill:
                skills_list.append(skill["name"])
            elif isinstance(skill, str):
                skills_list.append(skill)
        response_content["technical_skill"] = skills_list

    # Extract experience from structured data if available
    if "experience" in response_content and response_content["experience"]:
        response_content["structured_experience"] = response_content["experience"]
        exp_list = []
        for exp in response_content["experience"]:
            if isinstance(exp, dict) and "job_title" in exp:
                exp_text = f"{exp.get('job_title', '')} at {exp.get('company_name', '')}"
                if exp.get("start_date") or exp.get("end_date"):
                    exp_text += f" ({exp.get('start_date', '')} - {exp.get('end_date', 'Present')})"
                exp_list.append(exp_text.strip())
            elif isinstance(exp, str):
                exp_list.append(exp)
        response_content["experience"] = exp_list

    # Extract education/degree from structured data if available
    if "education" in response_content and response_content["education"]:
        response_content["structured_education"] = response_content["education"]
        degree_list = []
        for edu in response_content["education"]:
            if isinstance(edu, dict):
                degree_text = f"{edu.get('degree', '')} in {edu.get('field_of_study', '')} from {edu.get('school_name', '')}"
                if edu.get("start_year") or edu.get("end_year"):
                    degree_text += f" ({edu.get('start_year', '')} - {edu.get('end_year', '')})"
                degree_list.append(degree_text.strip())
            elif isinstance(edu, str):
                degree_list.append(edu)
        response_content["degree"] = degree_list

    # Extract certifications from structured data if available
    if "certifications" in response_content and response_content["certifications"]:
        response_content["structured_certifications"] = response_content["certifications"]
        cert_list = []
        for cert in response_content["certifications"]:
            if isinstance(cert, dict) and "name" in cert:
                cert_text = cert["name"]
                if cert.get("issuer"):
                    cert_text += f" (by {cert['issuer']})"
                cert_list.append(cert_text)
            elif isinstance(cert, str):
                cert_list.append(cert)
        response_content["certificate"] = cert_list

    # Set default values for missing fields
    if "candidate_name" not in response_content:
        response_content["candidate_name"] = "Unknown"
    if "phone_number" not in response_content:
        response_content["phone_number"] = "Not provided"
    if "email" not in response_content:
        response_content["email"] = "Not provided"
    if "comment" not in response_content:
        response_content["comment"] = response_content.get("summary", "No analysis available")
    if "technical_skill" not in response_content:
        response_content["technical_skill"] = []
    if "experience" not in response_content:
        response_content["experience"] = []
    if "degree" not in response_content:
        response_content["degree"] = []
    if "certificate" not in response_content:
        response_content["certificate"] = []
    if "responsibility" not in response_content:
        response_content["responsibility"] = []
    if "soft_skill" not in response_content:
        response_content["soft_skill"] = []
    if "job_recommended" not in response_content:
        response_content["job_recommended"] = response_content.get("job_recommended", [])

    response_content["cv_name"] = file.filename
    response_content["created_at"] = created_at
    response_content["filehash"] = filehash

    # === Process avatar if available ===
    avatar_base64 = response_content.pop("avatar_base64", None)
    response_content["avatar_url"] = None  # Default: no avatar

    # Add to database
    try:
        collection = db.candidate
        result = collection.insert_one(response_content)

        candidate_id = str(result.inserted_id)
        logger.info(f"Successfully saved candidate with ID: {candidate_id}")

        # Save avatar file AFTER getting candidate_id
        if avatar_base64:
            try:
                avatar_filename = f"{candidate_id}.png"
                avatar_path = os.path.join(AVATAR_DIR, avatar_filename)
                with open(avatar_path, "wb") as f:
                    f.write(base64.b64decode(avatar_base64))

                avatar_url = f"/api_server/avatars/{avatar_filename}"
                collection.update_one(
                    {"_id": result.inserted_id},
                    {"$set": {"avatar_url": avatar_url}},
                )
                logger.info(f"Avatar saved: {avatar_path}")
            except Exception as avatar_err:
                logger.warning(f"Failed to save avatar: {avatar_err}")

        # Return success response with candidate info
        return {
            "success": True,
            "candidate_id": candidate_id,
            "candidate_name": response_content.get("candidate_name", "Unknown"),
            "message": f"Successfully processed CV: {file.filename}",
        }

    except Exception as e:
        logger.error(f"Upload document to Database failed! Error: {str(e)}")
        return None


async def upload_file_cv(files: list[UploadFile]):
    """
    Process uploaded CV files.
    Now receives files as FastAPI UploadFile parameters instead of Flask request.files.
    """
    start_time = time.time()
    logger.info(f"Received {len(files)} file(s) for upload")

    if len(files) == 0:
        raise HTTPException(
            status_code=400,
            detail="No files uploaded! Please select a CV file (PDF or DOCX).",
        )

    success_count = 0
    processed_files = []

    for file in files:
        if not file.filename:
            continue

        # Read file content
        file_content = await file.read()

        result = process_upload_file(file=file, file_content=file_content)
        if result is not None and result.get("success", False):
            success_count += 1
            processed_files.append(
                {
                    "filename": file.filename,
                    "candidate_id": result.get("candidate_id"),
                    "candidate_name": result.get("candidate_name"),
                }
            )
        elif result is None:
            logger.warning(f"File {file.filename} was skipped (likely duplicate)")

    logger.info(f"Time upload file: {time.time()-start_time:.2f}")

    if success_count == 0:
        raise HTTPException(
            status_code=400,
            detail="Failed to process any files. Check file format (PDF/DOCX) and ensure files are not duplicates.",
        )

    return {
        "success": True,
        "message": f"File upload successful! Processed {success_count} file(s).",
        "processed_files": processed_files,
        "total_processed": success_count,
    }


def delete_candidate(candidate_id: str):
    db = get_database()
    result = db.candidate.delete_one({"_id": ObjectId(candidate_id)})
    if result.deleted_count == 1:
        # Clean matching
        db.matching.delete_many({"candidate_id": ObjectId(candidate_id)})

        # Clean avatar file
        avatar_path = os.path.join(AVATAR_DIR, f"{candidate_id}.png")
        if os.path.exists(avatar_path):
            try:
                os.remove(avatar_path)
                logger.info(f"Avatar deleted: {avatar_path}")
            except Exception as e:
                logger.warning(f"Failed to delete avatar: {e}")

        return {"message": "Document deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Document not found!")

