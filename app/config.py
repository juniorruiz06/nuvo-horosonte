from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./mineral_agent.db"
    sqlalchemy_echo: bool = False
    
    # Redis & Celery (optional)
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"
    
    # APIs
    gemini_api_key: str = ""
    alpha_vantage_api_key: str = ""
    metals_api_key: str = ""
    bcrp_api_key: str = ""
    
    # Verification
    sunat_ruc_api: str = "https://www3.sunat.gob.pe/cl-ti-itmrconsruc"
    minem_portal: str = "https://www.gob.pe/minem"
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "./logs/mineral_agent.log"
    
    # App
    secret_key: str = "your-secret-key-change-in-production"
    api_title: str = "MINERAL-AGENT"
    api_version: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()
