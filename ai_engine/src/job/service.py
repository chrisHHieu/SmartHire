import time

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from src.job.config import job_config
from src.job.prompts import system_prompt_job
from src.job.schemas import JobRequirement, DynamicWeights, WeightAnalysis
from src.matching.dynamic_weighting import TwoStageWeightingService
from src.utils import LOGGER


def analyse_job(job_data):
    """
    Comprehensive job analysis with Two-Stage AI Dynamic Weighting.
    
    This function now performs:
    1. Job requirement extraction (existing)
    2. Stage 1: Job Context Analysis (new)
    3. Stage 2: Dynamic Weight Generation (new)
    
    The weights are generated once at job creation and stored with the job.
    """
    start = time.time()
    LOGGER.info("=" * 80)
    LOGGER.info("Starting comprehensive job analysis with Two-Stage AI")
    LOGGER.info("=" * 80)

    # Step 1: Extract job requirements (existing functionality)
    LOGGER.info("Step 1: Extracting job requirements...")
    llm = ChatOpenAI(
        model=job_config.MODEL_NAME,
        openai_api_key=job_config.OPENAI_API_KEY,
        temperature=0.2
    )
    structured_llm = llm.with_structured_output(JobRequirement, method="function_calling")

    prompt_template = PromptTemplate(
        template=system_prompt_job + "\n\nJob Description:\n{job_description}",
        input_variables=['job_description']
    )

    prompt = prompt_template.invoke({'job_description': job_data.job_description})
    completion = structured_llm.invoke(prompt)

    # Convert result to dict
    if isinstance(completion, dict):
        json_output = completion
    else:
        json_output = completion.model_dump()

    LOGGER.info("Step 1 completed: Job requirements extracted")

    # Step 2 & 3: Two-Stage AI Dynamic Weighting
    LOGGER.info("Step 2 & 3: Running Two-Stage AI Dynamic Weighting...")
    
    try:
        weighting_service = TwoStageWeightingService()
        
        # Prepare job data for weight generation (include both name and requirements)
        job_for_weighting = {
            "job_name": job_data.job_name,
            "job_description": job_data.job_description,
            **json_output  # Include extracted requirements
        }
        
        # Generate dynamic weights using Two-Stage AI
        weight_result = weighting_service.generate_dynamic_weights(job_for_weighting)
        
        # Add weights to output
        json_output["dynamic_weights"] = weight_result["weights"]
        json_output["weight_analysis"] = {
            "reasoning": weight_result["reasoning"],
            "confidence": weight_result["confidence"],
            "job_context": weight_result["analysis"]
        }
        
        LOGGER.info("Two-Stage AI completed successfully")
        LOGGER.info(f"Generated weights: {weight_result['weights']}")
        LOGGER.info(f"AI confidence: {weight_result['confidence']:.2%}")
        
    except Exception as e:
        LOGGER.error(f"Error in Two-Stage AI weighting: {e}")
        LOGGER.warning("Using fallback weights")
        
        # Fallback to default weights if AI fails
        json_output["dynamic_weights"] = {
            "degree": 0.15,
            "experience": 0.25,
            "technical_skill": 0.25,
            "responsibility": 0.20,
            "certificate": 0.10,
            "soft_skill": 0.05,
            "language": 0.0
        }
        json_output["weight_analysis"] = {
            "reasoning": {
                "degree": "Fallback: Moderate importance",
                "experience": "Fallback: High importance",
                "technical_skill": "Fallback: High importance",
                "responsibility": "Fallback: Important for alignment",
                "certificate": "Fallback: Moderate importance",
                "soft_skill": "Fallback: Basic importance",
                "language": "Fallback: Not specified"
            },
            "confidence": 0.5,
            "job_context": {"note": "Fallback weights used due to AI error"}
        }

    total_time = time.time() - start
    LOGGER.info("=" * 80)
    LOGGER.info(f"Job analysis completed in {total_time:.2f}s")
    LOGGER.info("=" * 80)

    return json_output
