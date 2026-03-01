from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class MatchingSchema(BaseModel):
    candidate: dict
    job: dict


# Two-Stage AI Analysis Schemas
class IndustryInfo(BaseModel):
    primary: str = Field(..., description="Primary industry (technology, healthcare, finance, etc.)")
    sub_sector: str = Field(..., description="Specific sub-sector within industry")
    standards: str = Field(..., description="Industry standards and regulatory environment")


class RoleCharacteristics(BaseModel):
    seniority: str = Field(..., description="Seniority level: entry/mid/senior/executive")
    type: str = Field(..., description="Role type: individual_contributor/team_lead/manager/director")
    function: str = Field(..., description="Core function: technical/creative/analytical/people_focused")


class CompensationFactors(BaseModel):
    trainable: List[str] = Field(..., description="Skills that can be developed on the job")
    must_have: List[str] = Field(..., description="Non-negotiable requirements from day one")
    experience_vs_education: str = Field(..., description="How experience and education can compensate for each other")


class JobContextAnalysis(BaseModel):
    """Stage 1: Comprehensive job context analysis"""
    industry: IndustryInfo
    role_characteristics: RoleCharacteristics
    success_predictors: List[str] = Field(..., description="Key factors that predict success in this role")
    risk_factors: List[str] = Field(..., description="Missing qualifications that would be problematic")
    compensation_factors: CompensationFactors
    unique_requirements: List[str] = Field(..., description="Special certifications, licenses, or unique needs")


class WeightReasoning(BaseModel):
    degree: str = Field(..., description="Reasoning for degree weight")
    experience: str = Field(..., description="Reasoning for experience weight")
    technical_skill: str = Field(..., description="Reasoning for technical skill weight")
    responsibility: str = Field(..., description="Reasoning for responsibility weight")
    certificate: str = Field(..., description="Reasoning for certificate weight")
    soft_skill: str = Field(..., description="Reasoning for soft skill weight")
    language: str = Field(..., description="Reasoning for language weight")


class DynamicWeights(BaseModel):
    degree: float = Field(..., ge=0, le=1, description="Weight for educational background")
    experience: float = Field(..., ge=0, le=1, description="Weight for work experience")
    technical_skill: float = Field(..., ge=0, le=1, description="Weight for professional skills")
    responsibility: float = Field(..., ge=0, le=1, description="Weight for job responsibilities")
    certificate: float = Field(..., ge=0, le=1, description="Weight for certifications")
    soft_skill: float = Field(..., ge=0, le=1, description="Weight for soft skills")
    language: float = Field(..., ge=0, le=1, description="Weight for language requirements")


class WeightGenerationResult(BaseModel):
    """Stage 2: Dynamic weight generation with reasoning"""
    weights: DynamicWeights
    reasoning: WeightReasoning
    confidence_score: float = Field(..., ge=0, le=1, description="AI confidence in weight assignment")
    alternative_scenarios: Optional[Dict[str, DynamicWeights]] = Field(None, description="Alternative weights for different scenarios")


class ScoreDetail(BaseModel):
    """Individual scoring detail for each matching criterion"""
    score: int = Field(..., ge=0, le=100, description="Score from 0-100")
    comment: str = Field(..., description="Detailed explanation of the score")


class WeightAnalysisMetadata(BaseModel):
    """Metadata about the dynamic weight generation process"""
    dynamic_weights: Dict[str, float] = Field(..., description="AI-generated weights for this specific job")
    ai_confidence: float = Field(..., description="AI confidence in weight assignment (0-1)")
    job_analysis: Dict = Field(..., description="Job context analysis from Stage 1")
    weight_reasoning: Dict = Field(..., description="Reasoning for each weight from Stage 2")


class MatchingResult(BaseModel):
    """
    Comprehensive matching analysis between candidate and job requirements.
    Uses AI-generated dynamic weights based on job context analysis.
    """
    degree: ScoreDetail = Field(..., description="Educational background match")
    experience: ScoreDetail = Field(..., description="Work experience match")
    technical_skill: ScoreDetail = Field(..., description="Professional/technical skills match")
    responsibility: ScoreDetail = Field(..., description="Job responsibilities alignment")
    certificate: ScoreDetail = Field(..., description="Certifications match")
    soft_skill: ScoreDetail = Field(..., description="Soft skills compatibility")
    language: Optional[ScoreDetail] = Field(None, description="Language requirements match")

    summary_comment: str = Field(..., description="Overall assessment and recommendation")
    score: float = Field(..., ge=0, le=100, description="Final weighted score using dynamic weights")
    weight_analysis: Optional[WeightAnalysisMetadata] = Field(None, description="Dynamic weighting analysis metadata")


# Legacy schema for backward compatibility
class ResponseSchema(BaseModel):
    degree: list
    experience: list
    technical_skill: list
    responsibility: list
    certificate: list
    soft_skill: list
