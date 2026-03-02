"""
Candidate router - FastAPI routes for candidate operations.
Replaces Flask Blueprint + MethodView.
"""

from fastapi import APIRouter, File, UploadFile

from app.schemas.candidate_schema import (
    CandidateFilterSchema,
    UpdateCandidateSchema,
)
from app.services import candidate_service
from app.utils.serializers import serialize_doc

router = APIRouter(tags=["Candidate"])


@router.post("/upload-cv")
async def upload_cv(file_upload: list[UploadFile] = File(...)):
    """Upload CV files (PDF or DOCX) for analysis."""
    result = await candidate_service.upload_file_cv(file_upload)
    return result


@router.post("/list-candidate")
def list_candidate(candidate_data: CandidateFilterSchema):
    """Get paginated list of candidates."""
    result = candidate_service.get_list_candidate(candidate_data.model_dump())
    return serialize_doc(result)


@router.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: str):
    """Get candidate by ID."""
    result = candidate_service.get_candiate(candidate_id)
    return serialize_doc(result)


@router.put("/candidate/{candidate_id}")
def update_candidate(candidate_id: str, candidate_data: UpdateCandidateSchema):
    """Update candidate information."""
    result = candidate_service.update_candidate(candidate_data.model_dump(), candidate_id)
    return result


@router.delete("/candidate/{candidate_id}")
def delete_candidate(candidate_id: str):
    """Delete candidate by ID."""
    result = candidate_service.delete_candidate(candidate_id)
    return result
