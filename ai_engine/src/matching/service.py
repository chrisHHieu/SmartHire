import time
import json
import os

from langchain_openai import ChatOpenAI
from src.matching.config import matching_config
from src.matching.prompts import system_prompt_matching
from src.matching.schemas import MatchingResult
from src.utils import LOGGER


def generate_content(job, candidate):
    """Generate formatted content for matching analysis"""
    content = f"""
JOB REQUIREMENTS:
{str(job)}

CANDIDATE PROFILE:
{str(candidate)}

Please analyze how well this candidate matches the job requirements across all criteria.
"""
    return content


def calculate_weighted_score_from_dict(matching_dict, dynamic_weights):
    """Calculate final weighted score from dict response using pre-computed dynamic weights"""
    weighted_score = 0
    total_weight = 0

    # Use pre-computed weights from job data
    for field, weight in dynamic_weights.items():
        if field in matching_dict and isinstance(matching_dict[field], dict):
            score = matching_dict[field].get('score', 0)
            if isinstance(score, (int, float)):
                weighted_score += score * weight
                total_weight += weight

    final_score = weighted_score / total_weight if total_weight > 0 else 0
    # Round to integer to avoid floating point precision issues
    return round(final_score)


def get_fallback_matching_result():
    """Fallback matching result if AI parsing fails"""
    return {
        "degree": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "experience": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "technical_skill": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "responsibility": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "certificate": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "soft_skill": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "language": {"score": 50, "comment": "Unable to analyze - fallback score"},
        "summary_comment": "Analysis failed - using fallback scores. Please try again."
    }


def analyse_matching(matching_data):
    """
    Simplified matching analysis using pre-computed dynamic weights from job.
    
    The Two-Stage AI Dynamic Weighting has already been performed during job creation.
    This function now only needs to:
    1. Get pre-computed weights from job data
    2. Score candidate against job criteria
    3. Calculate weighted final score
    
    This approach is:
    - Faster (no weight generation overhead)
    - More consistent (same weights for all candidates)
    - More cost-effective (no repeated AI calls)
    """
    start = time.time()
    LOGGER.info("=" * 80)
    LOGGER.info("Starting candidate matching with pre-computed weights")
    LOGGER.info("=" * 80)

    # Extract pre-computed weights from job data
    job_data = matching_data.job
    dynamic_weights = job_data.get('dynamic_weights')
    weight_analysis = job_data.get('weight_analysis')

    if not dynamic_weights:
        LOGGER.warning("No pre-computed weights found in job data!")
        LOGGER.warning("Job may have been created before Two-Stage AI was implemented")
        LOGGER.warning("Using fallback weights")
        
        # Fallback weights if job doesn't have them
        dynamic_weights = {
            "degree": 0.15,
            "experience": 0.25,
            "technical_skill": 0.25,
            "responsibility": 0.20,
            "certificate": 0.10,
            "soft_skill": 0.05,
            "language": 0.0
        }
        weight_analysis = {
            "reasoning": {"note": "Fallback weights - job created without Two-Stage AI"},
            "confidence": 0.5,
            "job_context": {}
        }
    else:
        LOGGER.info(f"Using pre-computed weights from job: {job_data.get('job_name', 'Unknown')}")
        LOGGER.info(f"Weights: {dynamic_weights}")
        LOGGER.info(f"AI confidence: {weight_analysis.get('confidence', 'N/A')}")

    # Check for API key before initializing the matching LLM
    api_key = matching_config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if not api_key:
        LOGGER.warning("OPENAI_API_KEY not found, using fallback for scoring.")
        json_output = get_fallback_matching_result()
    else:
        llm = ChatOpenAI(
            temperature=0.7,
            model_name=matching_config.MODEL_NAME,
            openai_api_key=api_key
        )

        # Create enhanced prompt with pre-computed weights context
        content = generate_content(job=matching_data.job, candidate=matching_data.candidate)
        enhanced_prompt = f"""
        {system_prompt_matching}

        IMPORTANT: This job has been analyzed and the following dynamic weights have been pre-computed:

        Pre-computed Weights for this role:
        - Degree: {dynamic_weights.get('degree', 0):.1%}
        - Experience: {dynamic_weights.get('experience', 0):.1%}
        - Technical Skills: {dynamic_weights.get('technical_skill', 0):.1%}
        - Responsibilities: {dynamic_weights.get('responsibility', 0):.1%}
        - Certificates: {dynamic_weights.get('certificate', 0):.1%}
        - Soft Skills: {dynamic_weights.get('soft_skill', 0):.1%}
        - Language: {dynamic_weights.get('language', 0):.1%}

        AI Analysis Context:
        {weight_analysis.get('reasoning', {})}

        Use these insights to provide accurate scoring that reflects the true importance of each criterion for this specific role.

        {content}

        Please return your analysis in the following JSON format:
        {{
            "degree": {{"score": XX, "comment": "detailed explanation"}},
            "experience": {{"score": XX, "comment": "detailed explanation"}},
            "technical_skill": {{"score": XX, "comment": "detailed explanation"}},
            "responsibility": {{"score": XX, "comment": "detailed explanation"}},
            "certificate": {{"score": XX, "comment": "detailed explanation"}},
            "soft_skill": {{"score": XX, "comment": "detailed explanation"}},
            "language": {{"score": XX, "comment": "detailed explanation"}},
            "summary_comment": "overall assessment and recommendation"
        }}

        Trả kết quả về bằng TIẾNG VIỆT.
        """

        # Get AI response and parse JSON
        completion = llm.invoke(enhanced_prompt)

        # Parse JSON response from AI
        try:
            # Extract JSON from response
            if hasattr(completion, 'content'):
                response_text = completion.content
            else:
                response_text = str(completion)

            # Ensure response_text is string
            if not isinstance(response_text, str):
                response_text = str(response_text)

            # Find JSON in response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                json_output = json.loads(json_str)
            else:
                LOGGER.warning("Could not find JSON in matching response")
                json_output = get_fallback_matching_result()

        except Exception as e:
            LOGGER.error(f"Error parsing matching JSON: {e}")
            json_output = get_fallback_matching_result()

    # Calculate weighted score using pre-computed weights
    final_score = calculate_weighted_score_from_dict(json_output, dynamic_weights)
    json_output['score'] = final_score

    # Add weight analysis metadata (from job data)
    json_output['weight_analysis'] = {
        "dynamic_weights": dynamic_weights,
        "ai_confidence": weight_analysis.get('confidence', 0.8),
        "job_analysis": weight_analysis.get('job_context', {}),
        "weight_reasoning": weight_analysis.get('reasoning', {}),
        "note": "Weights were pre-computed during job creation using Two-Stage AI"
    }

    # Ensure all required fields are present for MatchingResult schema
    required_fields = ['degree', 'experience', 'technical_skill', 'responsibility', 'certificate', 'soft_skill']
    for field in required_fields:
        if field not in json_output:
            json_output[field] = {"score": 0, "comment": "No analysis available"}

    # Ensure summary_comment exists
    if 'summary_comment' not in json_output:
        json_output['summary_comment'] = "Analysis completed successfully."

    # Cost tracking is done internally (no logging)
    # Log detailed cost breakdown (disabled)

    total_time = time.time() - start
    LOGGER.info("=" * 80)
    LOGGER.info(f"Matching completed in {total_time:.2f}s")
    LOGGER.info("=" * 80)

    return json_output
