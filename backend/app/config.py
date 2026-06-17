import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_env: str
    database_url: str
    frontend_base_url: str
    backend_cors_origins: list[str]


def get_settings() -> Settings:
    cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000")

    return Settings(
        app_name=os.getenv("APP_NAME", "Encurtador de Links"),
        app_env=os.getenv("APP_ENV", "development"),
        database_url=os.getenv("DATABASE_URL", "sqlite:///./data/links.db"),
        frontend_base_url=os.getenv("FRONTEND_BASE_URL", "http://localhost:3000"),
        backend_cors_origins=[
            origin.strip() for origin in cors_origins.split(",") if origin.strip()
        ],
    )
