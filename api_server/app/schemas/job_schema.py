"""
Job Pydantic schemas for request/response validation.
Replaces Marshmallow schemas with Pydantic models.
"""

from typing import Any

from pydantic import BaseModel, Field


# ─── Request schemas ──────────────────────────────────────

class CreateUpdateJobSchema(BaseModel):
    job_name: str
    job_description: str


class JobFilterPageSchema(BaseModel):
    page_size: int | None = 10
    page: int | None = 1


# ─── Response schemas ─────────────────────────────────────

class PlainJobSchema(BaseModel):
    id: str | None = Field(None, alias="_id")
    job_name: str | None = None
    job_description: str | None = None
    created_at: str | None = None
    degree: list[str] | None = None
    experience: list[str] | None = None
    technical_skill: list[str] | None = None
    responsibility: list[str] | None = None
    soft_skill: list[str] | None = None
    certificate: list[str] | None = None
    language: list[str] | None = None
    dynamic_weights: dict[str, Any] | None = None
    weight_analysis: dict[str, Any] | None = None

    model_config = {"populate_by_name": True}


class JobPageSchema(BaseModel):
    results: list[PlainJobSchema] = []
    total_page: int = 0
    total_job: int = 0


class JobDetailSchema(BaseModel):
    id: str | None = Field(None, alias="_id")
    job_name: str | None = None
    education: list[str] | None = None
    certification: list[str] | None = None
    experiment: list[str] | None = None
    responsibilities: list[str] | None = None
    soft_skills: list[str] | None = None
    technical_skills: list[str] | None = None
    created_at: str | None = None

    model_config = {"populate_by_name": True}
