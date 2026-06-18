from fastapi import APIRouter, HTTPException, status

from app.schemas import LinkCreate, LinkResolveResponse, LinkResponse, LinkUpdate
from app.services.links_service import (
    InvalidSlugError,
    LinkNotFoundError,
    LinkSlugAlreadyExistsError,
    LinksService,
)


router = APIRouter(prefix="/api/links", tags=["links"])
service = LinksService()


@router.post("", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(payload: LinkCreate) -> LinkResponse:
    try:
        return service.create_link(payload)
    except InvalidSlugError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except LinkSlugAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.get("", response_model=list[LinkResponse])
def list_links() -> list[LinkResponse]:
    return service.list_links()


@router.get("/{slug}/resolve", response_model=LinkResolveResponse)
def resolve_link(slug: str) -> LinkResolveResponse:
    try:
        return service.resolve_link(slug)
    except LinkNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.put("/{slug}", response_model=LinkResponse)
def update_link(slug: str, payload: LinkUpdate) -> LinkResponse:
    try:
        return service.update_link(slug, payload)
    except InvalidSlugError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except LinkNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except LinkSlugAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
