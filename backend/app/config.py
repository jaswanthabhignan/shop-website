import os
# pyrefly: ignore[missing-import]
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Murali Electronics Catalogue API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/murali_catalogue"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./murali_catalogue.db"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://murali-catalogue-staging.onrender.com",
        "*"
    ]
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "murali_admin_2026")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
