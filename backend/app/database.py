import sqlite3
from pathlib import Path

from app.config import get_settings


def get_database_path() -> Path:
    database_url = get_settings().database_url
    prefix = "sqlite:///"

    if not database_url.startswith(prefix):
        raise ValueError("DATABASE_URL deve usar o formato sqlite:///./data/links.db")

    path = Path(database_url.removeprefix(prefix))
    if not path.is_absolute():
        path = Path.cwd() / path

    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(get_database_path())
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                original_url TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                access_count INTEGER NOT NULL DEFAULT 0
            )
            """
        )
