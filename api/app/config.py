import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Postly API"
    version: str = "1.0.0"
    
    # Database
    database_url: str = "sqlite:///./postly.db"
    
    # Security
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File uploads
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"

settings = Settings()