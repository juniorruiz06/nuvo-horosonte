from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./mineral_agent.db"
    sqlalchemy_echo: bool = False
    
    # APIs - Gemini
    gemini_api_key: str
    
    # APIs - Claude
    claude_api_key: str
    claude_model: str
    claude_max_tokens: int = 8192
    claude_temperature: float = 0.7
    
    # APIs - OpenAI
    openai_api_key: str
    openai_model: str
    openai_max_tokens: int = 16384
    openai_temperature: float = 0.7
    
    # SUNAT & Verificación
    sunat_ruc_api: str = "https://www3.sunat.gob.pe/cl-ti-itmrconsruc"
    minem_portal: str = "https://www.gob.pe/minem"
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "./logs/mineral_agent.log"
    
    # App
    secret_key: str
    api_title: str = "MINERAL-AGENT"
    api_version: str = "1.0.0"
    
    # Scraping
    scraping_timeout: int = 30
    scraping_retries: int = 3
    
    class Config:
        env_file = ".env"
        case_sensitive = False

def get_settings() -> Settings:
    return Settings()