from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional


class Education(BaseModel):
    school_name: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[int] = Field(None, ge=1900, le=2100)
    end_year: Optional[int] = Field(None, ge=1900, le=2100)
    gpa: Optional[float] = Field(None, ge=0.0, le=10.0)


class WorkExperience(BaseModel):
    job_title: str
    company_name: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    responsibilities: Optional[str] = None


class Certification(BaseModel):
    name: str
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None


class Language(BaseModel):
    name: str
    proficiency: Optional[str] = None


class Skill(BaseModel):
    name: str
    level: Optional[str] = None


class Award(BaseModel):
    title: str
    description: Optional[str] = None
    year: Optional[int] = None


class Resume(BaseModel):
    # Basic Information
    full_name: Optional[str] = Field(None, description="Full name of the candidate")
    email: Optional[EmailStr] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    address: Optional[str] = Field(None, description="Physical address")
    date_of_birth: Optional[str] = Field(None, description="Candidate's date of birth in dd/mm/yyyy format")
    summary: Optional[str] = Field(None, description="Short personal summary")
    years_of_experience: Optional[float] = Field(None, description="Total years of work experience (calculated from all work history)")

    # Structured Data
    education: Optional[List[Education]] = Field(None, description="Education history")
    experience: Optional[List[WorkExperience]] = Field(None, description="Work experience")
    skills: Optional[List[Skill]] = Field(None, description="List of skills")
    certifications: Optional[List[Certification]] = Field(None, description="List of certifications")
    languages: Optional[List[Language]] = Field(None, description="Languages known")
    awards: Optional[List[Award]] = Field(None, description="Honors or awards")

    # Analysis & Recommendations
    comment: Optional[str] = Field(None, description="AI analysis and summary about the candidate's strengths and suitability")
    job_recommended: Optional[List[str]] = Field(None, description="Must AI-recommended job positions based on candidate's profile")

    # Avatar (populated by file extractor, NOT by LLM)
    avatar_base64: Optional[str] = Field(None, description="Base64 encoded PNG avatar image extracted from CV")


# Legacy schema for backward compatibility
class ResponseSchema(BaseModel):
    candidate_name: str
    phone_number: str
    email: str
    comment: str
    degree: list
    experience: list
    technical_skill: list
    responsibility: list
    certificate: list
    soft_skill: list
    job_recommended: list
