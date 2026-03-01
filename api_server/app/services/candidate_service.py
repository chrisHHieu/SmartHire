import hashlib
import logging
import time
from datetime import datetime
from math import ceil

import config
import requests
from app.db import mongo
from bson.objectid import ObjectId
from flask import request
from flask_smorest import abort
from pytz import timezone

# Create logger for this module
logger = logging.getLogger(__name__)


def get_candiate(candiate_id):
    collection = mongo.db.candidate
    result = collection.find_one_or_404({"_id": ObjectId(candiate_id)})
    return result


def get_list_candidate(file_data):
    page_size = file_data["page_size"]
    page = file_data["page"]

    if page_size is None:
        page_size = 10

    if page is None:
        page = 1

    try:
        results, total_page, total_file = filter_page(page_size=page_size, page=page)
    except Exception as e:
        logger.error(f"Can not get list file! Error: {str(e)}")
        # Return empty results instead of aborting
        results = []
        total_page = 0
        total_file = 0

    return {"results": results, "total_page": total_page, "total_file": total_file}


def filter_page(page_size=10, page=1):
    # Connect to MongoDB and get the collection
    collection = mongo.db.candidate

    # Count total documents in the collection
    total_file = collection.count_documents({})

    # Calculate total pages (handle empty database)
    total_page = ceil(total_file / page_size) if page_size > 0 else 0

    # Validate page and page_size
    if page < 1 or page_size < 1:
        abort(400, message="Page number or page size is invalid.")

    # Calculate skip and limit values for pagination
    skip = (page - 1) * page_size

    # Retrieve documents with pagination
    results = list(collection.find().skip(skip).limit(page_size))

    return results, total_page, total_file


def update_candidate(candidate_data, candidate_id):
    collection = mongo.db.candidate
    result = collection.update_one(
        {"_id": ObjectId(candidate_id)}, {"$set": candidate_data}
    )
    if result.modified_count == 1:
        return {"message": "Document updated successfully"}
    else:
        return abort("Document not found")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"pdf", "docx"}


def process_upload_file(file):
    created_at = datetime.now(timezone("Asia/Ho_Chi_Minh")).strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    # Check type pdf or docx
    if not allowed_file(file.filename):
        logger.error("Invalid file type. Allowed types: pdf, docx!")
        return None

    # Compute the SHA-256 hash of the file contents and convert it to hexadecimal
    filehash = hashlib.sha256(file.read()).hexdigest()

    # Check hashfile
    if mongo.db.candidate.find_one({"filehash": filehash}):
        logger.error(f"CV candidate is exists! File name: {file.filename}")
        return None
    # Move the cursor to the beginning of the file
    file.seek(0)

    analysis_endpoint_url = f"{config.ANALYSIS_SERVICE_URL}/candidate/analyse"
    files = {"file": (file.filename, file.stream, file.mimetype)}
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
        # Keep structured skills data
        response_content["structured_skills"] = response_content["skills"]

        # Convert skills list to technical_skill list for legacy support
        skills_list = []
        for skill in response_content["skills"]:
            if isinstance(skill, dict) and "name" in skill:
                skills_list.append(skill["name"])
            elif isinstance(skill, str):
                skills_list.append(skill)
        response_content["technical_skill"] = skills_list

    # Extract experience from structured data if available
    if "experience" in response_content and response_content["experience"]:
        # Keep structured experience data
        response_content["structured_experience"] = response_content["experience"]

        # Convert experience list to string list for legacy support
        exp_list = []
        for exp in response_content["experience"]:
            if isinstance(exp, dict) and "job_title" in exp:
                exp_text = f"{exp.get('job_title', '')} at {exp.get('company_name', '')}"
                if exp.get('start_date') or exp.get('end_date'):
                    exp_text += f" ({exp.get('start_date', '')} - {exp.get('end_date', 'Present')})"
                exp_list.append(exp_text.strip())
            elif isinstance(exp, str):
                exp_list.append(exp)
        response_content["experience"] = exp_list

    # Extract education/degree from structured data if available
    if "education" in response_content and response_content["education"]:
        # Keep structured education data
        response_content["structured_education"] = response_content["education"]

        # Convert education list to degree list for legacy support
        degree_list = []
        for edu in response_content["education"]:
            if isinstance(edu, dict):
                degree_text = f"{edu.get('degree', '')} in {edu.get('field_of_study', '')} from {edu.get('school_name', '')}"
                if edu.get('start_year') or edu.get('end_year'):
                    degree_text += f" ({edu.get('start_year', '')} - {edu.get('end_year', '')})"
                degree_list.append(degree_text.strip())
            elif isinstance(edu, str):
                degree_list.append(edu)
        response_content["degree"] = degree_list

    # Extract certifications from structured data if available
    if "certifications" in response_content and response_content["certifications"]:
        # Keep structured certifications data
        response_content["structured_certifications"] = response_content["certifications"]

        # Convert certifications list to certificate list for legacy support
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

    # Keep other structured fields as-is (languages, awards, etc.)
    # These don't need legacy conversion as they're new fields

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

    # Add to database
    try:
        collection = mongo.db.candidate
        result = collection.insert_one(response_content)

        candidate_id = str(result.inserted_id)
        logger.info(f"Successfully saved candidate with ID: {candidate_id}")

        # Return success response with candidate info
        return {
            "success": True,
            "candidate_id": candidate_id,
            "candidate_name": response_content.get("candidate_name", "Unknown"),
            "message": f"Successfully processed CV: {file.filename}"
        }

    except Exception as e:
        logger.error(f"Upload document to Database failed! Error: {str(e)}")
        return None


def upload_file_cv():
    start_time = time.time()
    logger.info(f"Request files: {request.files}")

    # Try different field names
    uploaded_files = []
    for field_name in ["file_upload", "file", "cv_file"]:
        files = request.files.getlist(field_name)
        if files and files[0].filename:  # Check if file exists and has filename
            uploaded_files.extend(files)
            logger.info(f"Found files in field '{field_name}': {[f.filename for f in files]}")
            break

    if len(uploaded_files) == 0:
        logger.error("No files uploaded or empty files")
        abort(400, message="No files uploaded! Please select a CV file (PDF or DOCX).")

    success_count = 0
    processed_files = []

    for file in uploaded_files:
        result = process_upload_file(file=file)
        if result is not None and result.get("success", False):
            success_count += 1
            processed_files.append({
                "filename": file.filename,
                "candidate_id": result.get("candidate_id"),
                "candidate_name": result.get("candidate_name")
            })
        elif result is None:
            logger.warning(f"File {file.filename} was skipped (likely duplicate)")

    logger.info(f"Time upload file: {time.time()-start_time:.2f}")

    if success_count == 0:
        abort(400, message="Failed to process any files. Check file format (PDF/DOCX) and ensure files are not duplicates.")

    return {
        "success": True,
        "message": f"File upload successful! Processed {success_count} file(s).",
        "processed_files": processed_files,
        "total_processed": success_count
    }


def delete_candidate(candidate_id):
    result = mongo.db.candidate.delete_one({"_id": ObjectId(candidate_id)})
    if result.deleted_count == 1:
        # Clean matching
        mongo.db.matching.delete_many({"candidate_id": ObjectId(candidate_id)})

        return {"message": "Document deleted successfully"}
    else:
        return abort("Document not found!")

