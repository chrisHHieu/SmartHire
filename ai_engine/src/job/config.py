from pydantic_settings import BaseSettings


class JobConfig(BaseSettings):
    # OpenAI GPT model (consistent with candidate service)
    MODEL_NAME: str = "gpt-4.1-mini"
    OPENAI_API_KEY: str = ""  # Will be loaded from environment

    class Config:
        env_file = ".env"
        extra = "ignore"


job_config = JobConfig()
