from fastapi import FastAPI

from app.config import get_settings
from app.database import initialize_database
from app.routers.links import router as links_router


settings = get_settings()

app = FastAPI(title=settings.app_name)
app.include_router(links_router)


@app.on_event("startup")
def on_startup() -> None:
    initialize_database()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.app_env,
    }
