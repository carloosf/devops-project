from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, Field


class LinkCreate(BaseModel):
    original_url: AnyHttpUrl = Field(
        ...,
        description="URL original. Aceita apenas links iniciados com http:// ou https://.",
        examples=["https://exemplo.com/minha-pagina"],
    )
    custom_slug: str | None = Field(default=None, min_length=3, max_length=40)


class LinkUpdate(BaseModel):
    original_url: AnyHttpUrl = Field(
        ...,
        description="Nova URL original. Aceita apenas links iniciados com http:// ou https://.",
        examples=["https://exemplo.com/minha-pagina-atualizada"],
    )
    custom_slug: str | None = Field(default=None, min_length=3, max_length=40)


class LinkResponse(BaseModel):
    id: int
    slug: str
    original_url: str
    short_url: str
    created_at: datetime
    access_count: int


class LinkResolveResponse(BaseModel):
    slug: str
    original_url: str
