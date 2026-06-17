from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class LinkCreate(BaseModel):
    original_url: HttpUrl
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
