"""
Matching Pydantic schemas for request/response validation.
Replaces Marshmallow schemas with Pydantic models.
"""

from typing import Any

from pydantic import BaseModel, Field


# ─── Request schemas ──────────────────────────────────────

class ProcessMatchingSchema(BaseModel):
    job_name: str


class ProcessMatchingSelectiveSchema(BaseModel):
    candidate_ids: list[str]
    job_id: str


class MatchingFilterPageSchema(BaseModel):
    job_name: str
    page_size: int | None = 10
    page: int | None = 1


# ─── Nested schemas ──────────────────────────────────────

class AnalyseSchema(BaseModel):
    comment: str | None = None
    score: int | None = None


class WeightAnalysisSchema(BaseModel):
    dynamic_weights: dict[str, Any] | None = None
    ai_confidence: float | None = None
    job_analysis: dict[str, Any] | None = None
    weight_reasoning: dict[str, Any] | None = None


# ─── Response schemas ─────────────────────────────────────

class MatchingSchema(BaseModel):
    id: str | None = Field(None, alias="_id")
    candidate_id: str | None = None
    job_id: str | None = None
    degree: AnalyseSchema | None = None
    experience: AnalyseSchema | None = None
    responsibility: AnalyseSchema | None = None
    soft_skill: AnalyseSchema | None = None
    technical_skill: AnalyseSchema | None = None
    certificate: AnalyseSchema | None = None
    summary_comment: str | None = None
    score: float | None = None

    model_config = {"populate_by_name": True}


class PlainMatchingSchema(BaseModel):
    id: str | None = None
    candidate_name: str | None = None
    candidate_email: str | None = None
    candidate_phone: str | None = None
    cv_name: str | None = None
    avatar_url: str | None = None
    score: str | float | None = None
    summary_comment: str | None = None
    matching_status: bool | None = None


class MatchingPageSchema(BaseModel):
    results: list[PlainMatchingSchema] = []
    total_page: int = 0
    total_matching: int = 0


class CandidateMatchingResultSchema(BaseModel):
    candidate_id: str | None = None
    candidate_name: str | None = None
    email: str | None = None
    phone_number: str | None = None
    cv_name: str | None = None
    avatar_url: str | None = None
    score: float | None = None
    summary_comment: str | None = None
    degree: AnalyseSchema | None = None
    experience: AnalyseSchema | None = None
    responsibility: AnalyseSchema | None = None
    soft_skill: AnalyseSchema | None = None
    technical_skill: AnalyseSchema | None = None
    certificate: AnalyseSchema | None = None
    language: AnalyseSchema | None = None
    weight_analysis: WeightAnalysisSchema | None = None
    error: str | None = None


class MatchingResultSchema(BaseModel):
    success: bool = True
    job_id: str | None = None
    job_name: str | None = None
    total_matched: int = 0
    results: list[CandidateMatchingResultSchema] = []


class MatchingDetailSchema(BaseModel):
    id: str | None = Field(None, alias="_id")
    candidate_name: str | None = None
    phone_number: str | None = None
    email: str | None = None
    cv_name: str | None = None
    avatar_url: str | None = None
    job_recommended: list[str] | None = None
    job_name: str | None = None
    score: float | None = None
    summary_comment: str | None = None
    degree: AnalyseSchema | None = None
    experience: AnalyseSchema | None = None
    responsibility: AnalyseSchema | None = None
    soft_skill: AnalyseSchema | None = None
    technical_skill: AnalyseSchema | None = None
    certificate: AnalyseSchema | None = None
    language: AnalyseSchema | None = None
    weight_analysis: WeightAnalysisSchema | None = None

    model_config = {"populate_by_name": True}
