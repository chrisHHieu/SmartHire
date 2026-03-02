"""
Matching router - FastAPI routes for matching operations.
Replaces Flask Blueprint + MethodView.
"""

from fastapi import APIRouter, HTTPException

from bson import ObjectId, errors

from app.schemas.matching_schema import (
    MatchingFilterPageSchema,
    ProcessMatchingSchema,
    ProcessMatchingSelectiveSchema,
)
from app.services import matching_service
from app.utils.serializers import serialize_doc

router = APIRouter(tags=["Matching"])


@router.post("/process-matching")
def process_matching(matching_data: ProcessMatchingSchema):
    """Process matching for all candidates against a job."""
    result = matching_service.process_matching(matching_data.model_dump())
    return result


@router.post("/process-matching-selective")
def process_matching_selective(matching_data: ProcessMatchingSelectiveSchema):
    """
    Process matching for specific candidates with a job.
    Request: {"candidate_ids": ["id1", "id2"], "job_id": "job_id"}
    Returns matching results for each candidate.
    """
    result = matching_service.process_matching_selective(matching_data.model_dump())
    return serialize_doc(result)


@router.get("/data-matching")
def get_all_matching():
    """Get all matching records."""
    result = matching_service.get_all_matching()
    return serialize_doc(result)


@router.post("/data-matching")
def filter_matching(matching_data: MatchingFilterPageSchema):
    """Get filtered and paginated matching data."""
    result = matching_service.filter_matching_data(matching_data.model_dump())
    return serialize_doc(result)


@router.get("/candidate/{candidate_id}/job/{job_id}")
def get_matching_data(candidate_id: str, job_id: str):
    """Get matching detail for a specific candidate-job pair."""
    # Validate ObjectId
    try:
        candidate_oid = ObjectId(candidate_id)
        job_oid = ObjectId(job_id)
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid candidate_id or job_id")

    result = matching_service.get_matching_data(candidate_oid, job_oid)
    return serialize_doc(result)
