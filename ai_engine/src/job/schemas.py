from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class JobSchema(BaseModel):
    job_name: str
    job_description: str


class DynamicWeights(BaseModel):
    """AI-generated dynamic weights for matching criteria"""
    degree: float = Field(..., ge=0, le=1, description="Weight for educational background")
    experience: float = Field(..., ge=0, le=1, description="Weight for work experience")
    technical_skill: float = Field(..., ge=0, le=1, description="Weight for professional skills")
    responsibility: float = Field(..., ge=0, le=1, description="Weight for job responsibilities")
    certificate: float = Field(..., ge=0, le=1, description="Weight for certifications")
    soft_skill: float = Field(..., ge=0, le=1, description="Weight for soft skills")
    language: float = Field(..., ge=0, le=1, description="Weight for language requirements")


class WeightAnalysis(BaseModel):
    """Metadata about dynamic weight generation"""
    reasoning: Dict[str, str] = Field(..., description="Reasoning for each weight")
    confidence: float = Field(..., ge=0, le=1, description="AI confidence in weight assignment")
    job_context: Dict = Field(..., description="Job context analysis from Stage 1")


class JobRequirement(BaseModel):
    """
    Structured job requirements extracted from job descriptions.
    Industry-agnostic schema supporting all sectors (tech, business, healthcare, education, etc.)
    """
    degree: Optional[List[str]] = Field(
        None,
        description="Educational requirements across all industries (Bachelor's, Master's, PhD, certifications, etc.)"
    )
    experience: Optional[List[str]] = Field(
        None,
        description="Experience requirements including years, industry background, and specific roles"
    )
    technical_skill: Optional[List[str]] = Field(
        None,
        description="Job-specific professional skills: tech (Python, SQL), business (Excel, CRM), creative (Adobe), healthcare (patient care), etc."
    )
    responsibility: Optional[List[str]] = Field(
        None,
        description="Key job responsibilities and duties across all industries"
    )
    certificate: Optional[List[str]] = Field(
        None,
        description="Required certifications: tech (AWS, CompTIA), business (PMP, CPA), healthcare (CPR, nursing license), etc."
    )
    soft_skill: Optional[List[str]] = Field(
        None,
        description="Soft skills and interpersonal abilities needed for the role"
    )
    language: Optional[List[str]] = Field(
        None,
        description="Language requirements with proficiency levels: English (Fluent), Vietnamese (Native), Japanese (Conversational), etc."
    )


# Legacy schema for backward compatibility
class ResponseSchema(BaseModel):
    degree: list
    experience: list
    technical_skill: list
    responsibility: list
    certificate: list
    soft_skill: list
    language: list  # Added for consistency
