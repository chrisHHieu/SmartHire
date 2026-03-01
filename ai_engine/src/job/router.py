from fastapi import APIRouter
from src.job import service
from src.job.schemas import JobSchema

router = APIRouter()


@router.post("/analyse")
async def analyse_job(job_data: JobSchema):
    """
    Comprehensive Job Analysis with Two-Stage AI Dynamic Weighting
    
    This endpoint performs a complete job analysis in THREE steps:
    
    **Step 1: Job Requirement Extraction**
    - Extracts structured requirements from job description
    - Identifies: degree, experience, technical_skill, responsibility, certificate, soft_skill, language
    
    **Step 2: Job Context Analysis (Two-Stage AI - Stage 1)**
    - Deep analysis of job context and characteristics
    - Identifies industry, role type, success predictors, risk factors
    - Determines what skills are trainable vs must-have
    
    **Step 3: Dynamic Weight Generation (Two-Stage AI - Stage 2)**
    - Generates optimal matching weights based on job context
    - Weights are job-specific and industry-aware
    - Includes AI reasoning and confidence scoring
    
    **Output:**
    - All job requirements (structured lists)
    - dynamic_weights: Optimal weights for matching (sum = 1.0)
    - weight_analysis: Detailed reasoning, confidence, and job context
    
    **Benefits:**
    - Weights generated ONCE at job creation (not during matching)
    - Consistent matching criteria for all candidates
    - Faster matching performance (weights pre-computed)
    - Transparent AI reasoning for weight decisions
    - Cost-effective (no repeated AI calls for same job)
    
    **Use Case:**
    When creating a new job posting, this endpoint analyzes the job deeply
    and generates optimal matching weights that will be used for all future
    candidate matching operations.
    """
    result = service.analyse_job(job_data=job_data)
    return result
