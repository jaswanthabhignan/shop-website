import os
# pyrefly: ignore[missing-import]
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union

def _clean_database_url(url: str) -> str:
    """Strip unsupported channel_binding=require for pooler connections and normalize postgres URL."""
    if not url:
        return url
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # Remove channel_binding=require from connection string if present (unsupported by Neon PgBouncer pooler)
    if "channel_binding=require" in url:
        url = url.replace("&channel_binding=require", "").replace("channel_binding=require&", "").replace("channel_binding=require", "")
        if url.endswith("?"):
            url = url[:-1]
    return url

DEFAULT_DB_URL = "postgresql://neondb_owner:npg_crMm6aFIWNT5@ep-round-frost-b4xvvd30-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"

class Settings(BaseSettings):
    APP_NAME: str = "Murali Electronics Catalogue API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DATABASE_URL: str = _clean_database_url(os.getenv("DATABASE_URL", DEFAULT_DB_URL))
    SQLITE_FALLBACK_URL: str = os.getenv("SQLITE_FALLBACK_URL", "sqlite:////tmp/murali_catalogue.db" if os.name != "nt" else "sqlite:///./murali_catalogue.db")
    
    # Allowed origins for CORS (supports comma-separated env var, JSON list, or wildcard)
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://murali-catalogue-staging.onrender.com",
        "*",
    ]
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "murali_admin_2026")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_str = v.strip()
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    import json
                    return json.loads(v_str)
                except Exception:
                    pass
            return [origin.strip() for origin in v_str.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

