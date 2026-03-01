import os


from pydantic_settings import BaseSettings

basedir = os.path.abspath(os.path.dirname(__file__))

ENVIRONMENT = os.getenv(key="ENVIRONMENT", default="DEVELOP")




class Settings(BaseSettings):
    class Config:
        env_file = ".env"
        extra = "ignore"
    # App config
    APP_NAME: str = "API Analysis Service"
    APP_ENV: str = "develop"

    # Logging setting
    DATE_FMT: str = "%Y-%m-%d %H:%M:%S"
    LOG_DIR: str = f"{basedir}/logs/api.log"

    # OpenAI model for text extraction and Vision OCR
    MODEL_NAME: str = "gpt-4.1-mini"
    OPENAI_API_KEY: str | None = None
    
    # LandingAI ADE for PDF parsing
    LANDINGAI_API_KEY: str | None = None
    
    # Google Gemini (not used)
    GOOGLE_API_KEY: str | None = None
    
    CV_UPLOAD_DIR: str = "./candidate_cv/"


settings = Settings()
