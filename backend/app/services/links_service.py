import re
import secrets
import sqlite3

from app.config import get_settings
from app.repositories.links_repository import LinksRepository
from app.schemas import LinkCreate, LinkResolveResponse, LinkResponse, LinkUpdate


class LinkNotFoundError(Exception):
    pass


class LinkSlugAlreadyExistsError(Exception):
    pass


class InvalidSlugError(Exception):
    pass


class LinksService:
    def __init__(self, repository: LinksRepository | None = None) -> None:
        self.repository = repository or LinksRepository()
        self.settings = get_settings()

    def create_link(self, payload: LinkCreate) -> LinkResponse:
        slug = self._normalize_slug(payload.custom_slug) if payload.custom_slug else self._generate_slug()

        try:
            row = self.repository.create(slug=slug, original_url=str(payload.original_url))
        except sqlite3.IntegrityError as exc:
            raise LinkSlugAlreadyExistsError("Slug ja esta em uso.") from exc

        return self._to_response(row)

    def list_links(self) -> list[LinkResponse]:
        return [self._to_response(row) for row in self.repository.list_all()]

    def update_link(self, slug: str, payload: LinkUpdate) -> LinkResponse:
        current = self.repository.get_by_slug(slug)
        if current is None:
            raise LinkNotFoundError("Link nao encontrado.")

        new_slug = self._normalize_slug(payload.custom_slug) if payload.custom_slug else slug

        try:
            row = self.repository.update(
                slug=slug,
                new_slug=new_slug,
                original_url=str(payload.original_url),
            )
        except sqlite3.IntegrityError as exc:
            raise LinkSlugAlreadyExistsError("Slug ja esta em uso.") from exc

        if row is None:
            raise LinkNotFoundError("Link nao encontrado.")

        return self._to_response(row)

    def resolve_link(self, slug: str) -> LinkResolveResponse:
        row = self.repository.increment_access_count(slug)
        if row is None:
            raise LinkNotFoundError("Link nao encontrado.")

        return LinkResolveResponse(slug=row["slug"], original_url=row["original_url"])

    def _generate_slug(self) -> str:
        for _ in range(5):
            slug = secrets.token_urlsafe(5).replace("_", "").replace("-", "")[:7]
            if self.repository.get_by_slug(slug) is None:
                return slug

        raise LinkSlugAlreadyExistsError("Nao foi possivel gerar um slug unico.")

    def _normalize_slug(self, slug: str) -> str:
        normalized = slug.strip().lower()
        if not re.fullmatch(r"[a-z0-9-]+", normalized):
            raise InvalidSlugError("Use apenas letras, numeros e hifens no slug.")

        return normalized

    def _to_response(self, row: sqlite3.Row) -> LinkResponse:
        return LinkResponse(
            id=row["id"],
            slug=row["slug"],
            original_url=row["original_url"],
            short_url=f"{self.settings.frontend_base_url.rstrip('/')}/r/{row['slug']}",
            created_at=row["created_at"],
            access_count=row["access_count"],
        )
