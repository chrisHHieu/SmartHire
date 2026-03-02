"""
Candidate Pydantic schemas for request/response validation.
Replaces Marshmallow schemas with Pydantic models.
"""

from pydantic import BaseModel, Field


# ─── Nested models ────────────────────────────────────────

class EducationSchema(BaseModel):
    school_name: str | None = None
    degree: str | None = None
    field_of_study: str | None = None
    start_year: int | None = None
    end_year: int | None = None
    gpa: float | None = None


class WorkExperienceSchema(BaseModel):
    job_title: str | None = None
    company_name: str | None = None
    location: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    responsibilities: str | None = None


class CertificationSchema(BaseModel):
    name: str | None = None
    issuer: str | None = None
    issue_date: str | None = None
    expiration_date: str | None = None


class LanguageSchema(BaseModel):
    name: str | None = None
    proficiency: str | None = None


class SkillSchema(BaseModel):
    name: str | None = None
    level: str | None = None


class AwardSchema(BaseModel):
    title: str | None = None
    description: str | None = None
    year: int | None = None


# ─── Request schemas ──────────────────────────────────────

class UpdateCandidateSchema(BaseModel):
    candidate_name: str
    phone_number: str
    email: str
    comment: str


class CandidateFilterSchema(BaseModel):
    page_size: int | None = 10
    page: int | None = 1


# ─── Response schemas ─────────────────────────────────────

class CandidateSchema(BaseModel):
    id: str | None = Field(None, alias="_id")
    candidate_name: str | None = None
    phone_number: str | None = None
    email: str | None = None
    comment: str | None = None

    # Legacy fields (backward compatibility)
    certificate: list[str] | None = None
    degree: list[str] | None = None
    experience: list[str] | None = None
    technical_skill: list[str] | None = None
    responsibility: list[str] | None = None
    soft_skill: list[str] | None = None
    job_recommended: list[str] | None = None

    # New structured fields
    full_name: str | None = None
    phone: str | None = None
    address: str | None = None
    summary: str | None = None
    date_of_birth: str | None = None
    structured_education: list[EducationSchema] | None = None
    structured_experience: list[WorkExperienceSchema] | None = None
    structured_skills: list[SkillSchema] | None = None
    structured_certifications: list[CertificationSchema] | None = None
    languages: list[LanguageSchema] | None = None
    awards: list[AwardSchema] | None = None

    cv_name: str | None = None
    created_at: str | None = None
    sql: int | None = None
    office: int | None = None
    avatar_url: str | None = None

    model_config = {"populate_by_name": True}


class CandidatePageSchema(BaseModel):
    results: list[CandidateSchema] = []
    total_page: int = 0
    total_file: int = 0


class ProcessedFileSchema(BaseModel):
    filename: str | None = None
    candidate_id: str | None = None
    candidate_name: str | None = None


class UploadResponseSchema(BaseModel):
    success: bool = False
    message: str | None = None
    processed_files: list[ProcessedFileSchema] = []
    total_processed: int = 0
