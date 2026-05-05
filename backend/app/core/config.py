from typing import List, Optional, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartOps AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here" # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "smartops"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], values: any) -> any:
        if isinstance(v, str):
            return v
        postgres_uri = f"postgresql://{values.data.get('POSTGRES_USER')}:{values.data.get('POSTGRES_PASSWORD')}@{values.data.get('POSTGRES_SERVER')}/{values.data.get('POSTGRES_DB')}"
        # Fallback to sqlite for local dev if postgres not reachable (simplified logic)
        return postgres_uri if values.data.get('POSTGRES_SERVER') != 'localhost' else "sqlite:///./sql_app.db"

    # AI
    LLM_PROVIDER: str = "ollama"  # or "openai"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_API_BASE: Optional[str] = None # For OpenAI-compatible APIs

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
