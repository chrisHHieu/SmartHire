"""
Two-Stage AI Dynamic Weighting Service
Stage 1: Job Context Analysis
Stage 2: Dynamic Weight Generation
"""

import os
import json
from langchain_openai import ChatOpenAI
from src.matching.config import matching_config
from src.matching.schemas import JobContextAnalysis, WeightGenerationResult, DynamicWeights
from src.utils import LOGGER


class TwoStageWeightingService:
    """
    Intelligent dynamic weighting using Two-Stage AI approach:
    1. Deep job context analysis
    2. Weight generation based on analysis
    """
    
    def __init__(self):
        # Initialize LLM clients only if API key is available
        api_key = matching_config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
        model_name = matching_config.MODEL_NAME
        if not api_key:
            LOGGER.warning("OPENAI_API_KEY is not set. Falling back to static weights.")
            self.analyzer_llm = None
            self.weights_llm = None
            return

        # Stage 1: Lower temperature for consistent analysis
        self.analyzer_llm = ChatOpenAI(
            model_name=model_name,
            temperature=0.1,
            openai_api_key=api_key
        )

        # Stage 2: Slightly higher temperature for creative reasoning
        self.weights_llm = ChatOpenAI(
            model_name=model_name,
            temperature=0.1,
            openai_api_key=api_key
        )
    
    def generate_dynamic_weights(self, job_data):
        """
        Main method: Generate dynamic weights using Two-Stage AI approach
        """
        try:
            LOGGER.info("Starting Two-Stage AI weight generation")
            
            # Stage 1: Deep job context analysis
            job_analysis = self.analyze_job_context(job_data)
            LOGGER.info("Stage 1 completed: Job context analysis")
            
            # Stage 2: Generate weights from analysis
            weights_result = self.generate_weights_from_analysis(job_analysis)
            LOGGER.info("Stage 2 completed: Weight generation")
            
            # Both results are already dicts from JSON parsing
            weights_dict = weights_result
            analysis_dict = job_analysis

            # Validation and normalization
            final_weights = self.validate_and_normalize(weights_dict.get('weights', {}))

            return {
                "weights": final_weights,
                "analysis": analysis_dict,
                "reasoning": weights_dict.get('reasoning', {}),
                "confidence": weights_dict.get('confidence_score', 0.5),
                "alternative_scenarios": weights_dict.get('alternative_scenarios', {})
            }
            
        except Exception as e:
            LOGGER.error(f"Error in dynamic weight generation: {e}")
            # Fallback to default weights if AI fails
            fallback = self.get_fallback_weights()
            return {
                "weights": fallback["weights"],
                "analysis": self.get_fallback_analysis(),
                "reasoning": fallback["reasoning"],
                "confidence": fallback["confidence_score"],
                "alternative_scenarios": {}
            }
    
    def analyze_job_context(self, job_data):
        """
        Stage 1: Comprehensive job context analysis
        """
        if not self.analyzer_llm:
            return self.get_fallback_analysis()
        prompt = f"""
        You are an expert job analyst with 20+ years experience across all industries.
        
        Analyze this position deeply and provide structured insights:
        
        Job Title: {job_data.get('job_name', 'Not specified')}
        Job Description: {job_data.get('job_description', 'Not specified')}
        Requirements: {job_data}
        
        Provide comprehensive analysis covering:
        
        1. INDUSTRY & SECTOR:
           - Identify the primary industry (technology, healthcare, finance, education, sales, marketing, creative, manufacturing, etc.)
           - Determine specific sub-sector within that industry
           - Assess industry standards and regulatory environment (highly_regulated/moderately_regulated/flexible)
        
        2. ROLE CHARACTERISTICS:
           - Seniority level: entry/mid/senior/executive
           - Role type: individual_contributor/team_lead/manager/director/c_level
           - Core function: technical/creative/analytical/people_focused/operational/strategic
        
        3. SUCCESS PREDICTORS:
           - What specific factors make someone excel in this exact role?
           - Critical competencies for high performance
           - Key differentiators between good vs exceptional performers
        
        4. RISK FACTORS:
           - What missing qualifications would be most problematic?
           - Deal-breaker gaps that lead to failure
           - Areas where weakness causes significant issues
        
        5. COMPENSATION FACTORS:
           - What skills can be developed through training on the job?
           - What capabilities must be present from day one?
           - How can experience compensate for education gaps and vice versa?
        
        6. UNIQUE REQUIREMENTS:
           - Special certifications, licenses, or credentials needed
           - Language requirements for communication
           - Industry-specific knowledge or background
        
        Base your analysis on the specific job requirements provided, not general assumptions.
        """
        
        # Add JSON format instruction to prompt
        json_prompt = prompt + """

        Please return your analysis in the following JSON format:
        {
            "industry": {
                "primary": "industry_name",
                "sub_sector": "sub_sector_name",
                "standards": "regulatory_level"
            },
            "role_characteristics": {
                "seniority": "level",
                "type": "role_type",
                "function": "core_function"
            },
            "success_predictors": ["factor1", "factor2", "factor3"],
            "risk_factors": ["risk1", "risk2", "risk3"],
            "compensation_factors": {
                "trainable": ["skill1", "skill2"],
                "must_have": ["requirement1", "requirement2"],
                "experience_vs_education": "relationship_description"
            },
            "unique_requirements": ["requirement1", "requirement2"]
        }
        """

        response = self.analyzer_llm.invoke(json_prompt)

        try:
            # Extract JSON from response
            if hasattr(response, 'content'):
                response_text = response.content
            else:
                response_text = str(response)

            # Ensure response_text is string
            if not isinstance(response_text, str):
                response_text = str(response_text)

            # Find JSON in response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
            else:
                LOGGER.warning("Could not find JSON in analysis response")
                return self.get_fallback_analysis()
        except Exception as e:
            LOGGER.error(f"Error parsing analysis JSON: {e}")
            return self.get_fallback_analysis()
    
    def generate_weights_from_analysis(self, job_analysis):
        """
        Stage 2: Generate optimal weights based on job analysis
        """
        if not self.weights_llm:
            return self.get_fallback_weights()
        analysis_str = json.dumps(job_analysis.model_dump() if hasattr(job_analysis, 'model_dump') else job_analysis, indent=2)
        
        prompt = f"""
        You are an expert talent acquisition specialist with deep understanding of predictive hiring factors.
        
        Based on this comprehensive job analysis:
        {analysis_str}
        
        Generate optimal matching weights for candidate evaluation.
        
        REASONING FRAMEWORK:
        
        For each criterion, systematically consider:
        - SUCCESS IMPACT: How much does this criterion predict job success? (0-100)
        - RISK LEVEL: How risky is it if candidate lacks this? (0-100)  
        - COMPENSABILITY: Can gaps be filled through training/development? (0-100)
        - VERIFICATION: How reliably can this be assessed from resume/interview? (0-100)
        
        WEIGHT CALCULATION LOGIC:
        - High success impact + High risk + Low compensability = Higher weight
        - Critical for core job function = Higher weight
        - Industry standards/legal requirements = Higher weight
        - Must-have vs nice-to-have = Higher vs Lower weight
        
        SPECIFIC CRITERION ANALYSIS:
        
        1. DEGREE weight should reflect:
           - Industry education requirements and standards
           - Role complexity and knowledge base needs
           - How much experience can compensate for education gaps
        
        2. EXPERIENCE weight should reflect:
           - Learning curve steepness for this role
           - Seniority level and responsibility scope
           - Industry-specific experience value
        
        3. TECHNICAL_SKILL weight should reflect:
           - How central technical skills are to job function
           - Difficulty and time to acquire missing skills
           - Performance differentiation impact
        
        4. RESPONSIBILITY weight should reflect:
           - Leadership and management requirements
           - Decision-making scope and accountability
           - Past responsibility alignment importance
        
        5. CERTIFICATE weight should reflect:
           - Legal, regulatory, or compliance requirements
           - Industry credibility and trust factors
           - Professional competency validation needs
        
        6. SOFT_SKILL weight should reflect:
           - People interaction frequency and importance
           - Communication criticality for role success
           - Team collaboration and client impact
        
        7. LANGUAGE weight should reflect:
           - Communication requirements with teams/clients
           - Market or customer base language needs
           - International or multicultural team collaboration
        
        IMPORTANT: Weights must sum to exactly 1.0
        
        Provide detailed reasoning for each weight that explains:
        - Why this specific weight makes sense for THIS role
        - How it relates to the job analysis findings
        - What would happen if this criterion was weighted higher/lower
        
        Also provide a confidence score (0.0-1.0) for your weight assignment.
        """
        
        # Add JSON format instruction to prompt
        json_prompt = prompt + """

        Please return your weight analysis in the following JSON format:
        {
            "weights": {
                "degree": 0.XX,
                "experience": 0.XX,
                "technical_skill": 0.XX,
                "responsibility": 0.XX,
                "certificate": 0.XX,
                "soft_skill": 0.XX,
                "language": 0.XX
            },
            "reasoning": {
                "degree": "explanation for degree weight",
                "experience": "explanation for experience weight",
                "technical_skill": "explanation for technical skill weight",
                "responsibility": "explanation for responsibility weight",
                "certificate": "explanation for certificate weight",
                "soft_skill": "explanation for soft skill weight",
                "language": "explanation for language weight"
            },
            "confidence_score": 0.XX
        }

        Ensure weights sum to exactly 1.0.
        """

        response = self.weights_llm.invoke(json_prompt)

        try:
            # Extract JSON from response
            if hasattr(response, 'content'):
                response_text = response.content
            else:
                response_text = str(response)

            # Ensure response_text is string
            if not isinstance(response_text, str):
                response_text = str(response_text)

            # Find JSON in response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
            else:
                LOGGER.warning("Could not find JSON in weights response")
                return self.get_fallback_weights()
        except Exception as e:
            LOGGER.error(f"Error parsing weights JSON: {e}")
            return self.get_fallback_weights()
    
    def validate_and_normalize(self, weights):
        """
        Validate and normalize weights to ensure they sum to 1.0
        """
        if hasattr(weights, 'model_dump'):
            weights_dict = weights.model_dump()
        else:
            weights_dict = weights
        
        # Calculate total
        total = sum(weights_dict.values())
        
        if total == 0:
            LOGGER.warning("All weights are zero, using fallback")
            return self.get_fallback_weights()["weights"]
        
        # Normalize to sum = 1.0
        normalized = {k: v/total for k, v in weights_dict.items()}
        
        # Sanity checks
        for criterion, weight in normalized.items():
            if weight < 0:
                LOGGER.warning(f"Negative weight for {criterion}: {weight}")
                normalized[criterion] = 0
            elif weight > 0.7:
                LOGGER.warning(f"Very high weight for {criterion}: {weight}")
        
        # Re-normalize after sanity checks
        total = sum(normalized.values())
        if total > 0:
            normalized = {k: v/total for k, v in normalized.items()}
        
        return normalized
    
    def get_fallback_analysis(self):
        """
        Fallback job analysis if AI generation fails
        """
        return {
            "industry": {
                "primary": "general",
                "sub_sector": "unknown",
                "standards": "moderate"
            },
            "role_characteristics": {
                "seniority": "mid",
                "type": "individual_contributor",
                "function": "general"
            },
            "success_predictors": ["relevant_experience", "required_skills"],
            "risk_factors": ["skill_gaps", "experience_mismatch"],
            "compensation_factors": {
                "trainable": ["specific_tools", "processes"],
                "must_have": ["core_competencies"],
                "experience_vs_education": "both_important"
            },
            "unique_requirements": ["none_specified"]
        }

    def get_fallback_weights(self):
        """
        Fallback weights if AI generation fails
        """
        return {
            "weights": {
                "degree": 0.15,
                "experience": 0.25,
                "technical_skill": 0.25,
                "responsibility": 0.20,
                "certificate": 0.10,
                "soft_skill": 0.05,
                "language": 0.0
            },
            "reasoning": {
                "degree": "Moderate importance for most roles",
                "experience": "High importance for proven capability",
                "technical_skill": "High importance for job performance",
                "responsibility": "Important for role alignment",
                "certificate": "Moderate importance depending on role",
                "soft_skill": "Basic importance for collaboration",
                "language": "Not specified in requirements"
            },
            "confidence_score": 0.5
        }
