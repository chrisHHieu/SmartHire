"""
Job router - FastAPI routes for job operations.
Replaces Flask Blueprint + MethodView.
"""

from fastapi import APIRouter

from app.schemas.job_schema import (
    CreateUpdateJobSchema,
    JobFilterPageSchema,
)
from app.services import job_service
from app.utils.serializers import serialize_doc

router = APIRouter(tags=["Job"])


@router.get("/job")
def get_all_jobs():
    """Get all jobs."""
    result = job_service.get_all_job()
    return serialize_doc(result)


@router.post("/job")
def create_job(job_data: CreateUpdateJobSchema):
    """Create a new job with AI analysis."""
    result = job_service.post_job(job_data.model_dump())
    return serialize_doc(result)


@router.post("/job-page")
def list_jobs(job_data: JobFilterPageSchema):
    """Get paginated list of jobs."""
    result = job_service.get_list_job(job_data.model_dump())
    return serialize_doc(result)


@router.get("/job/{job_id}")
def get_job(job_id: str):
    """Get job by ID."""
    result = job_service.get_job(job_id)
    return serialize_doc(result)


@router.put("/job/{job_id}")
def update_job(job_id: str, job_data: CreateUpdateJobSchema):
    """Update job information (triggers re-analysis if content changed)."""
    result = job_service.update_job(job_data.model_dump(), job_id)
    return result


@router.delete("/job/{job_id}")
def delete_job(job_id: str):
    """Delete job by ID."""
    result = job_service.delete_job(job_id)
    return result
