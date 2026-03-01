import os


from pydantic_settings import BaseSettings

basedir = os.path.abspath(os.path.dirname(__file__))

ENVIRONMENT = os.getenv(key="ENVIRONMENT", default="DEVELOP")

class MatchingConfig(BaseSettings):
    # Keep OpenAI model as requested
    MODEL_NAME: str = "gpt-4.1"
    OPENAI_API_KEY: str | None = None  # Will be loaded from environment

    class Config:
        env_file = ".env"
        extra = "ignore"


matching_config = MatchingConfig()
