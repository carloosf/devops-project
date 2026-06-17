import sqlite3

from app.database import get_connection


class LinksRepository:
    def create(self, slug: str, original_url: str) -> sqlite3.Row:
        with get_connection() as connection:
            cursor = connection.execute(
                "INSERT INTO links (slug, original_url) VALUES (?, ?)",
                (slug, original_url),
            )
            created = connection.execute(
                """
                SELECT id, slug, original_url, created_at, access_count
                FROM links
                WHERE id = ?
                """,
                (cursor.lastrowid,),
            )
            return created.fetchone()

    def list_all(self) -> list[sqlite3.Row]:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                SELECT id, slug, original_url, created_at, access_count
                FROM links
                ORDER BY created_at DESC
                """
            )
            return cursor.fetchall()

    def get_by_slug(self, slug: str) -> sqlite3.Row | None:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                SELECT id, slug, original_url, created_at, access_count
                FROM links
                WHERE slug = ?
                """,
                (slug,),
            )
            return cursor.fetchone()

    def delete(self, slug: str) -> bool:
        with get_connection() as connection:
            cursor = connection.execute("DELETE FROM links WHERE slug = ?", (slug,))
            return cursor.rowcount > 0
