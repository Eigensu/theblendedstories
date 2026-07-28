from datetime import datetime
from app.repositories.base_repo import BaseRepository

repo = BaseRepository("tbs_nights_waitlist")


async def create_entry(data: dict) -> dict:
    """Create a new waitlist entry."""
    entry = {
        **data,
        "email": data.get("email", "").lower().strip(),
        "created_at": datetime.utcnow(),
    }
    return await repo.create(entry)


async def get_by_id(entry_id: str) -> dict | None:
    """Fetch a waitlist entry by ID."""
    return await repo.get_by_id(entry_id)


async def list_entries() -> list[dict]:
    """List all active waitlist entries, sorted by creation date (newest first)."""
    return await repo.find_many(
        query={"is_active": True},
        sort_field="created_at",
        descending=True,
    )


async def get_by_email(email: str) -> dict | None:
    """Find an existing entry by normalized email."""
    normalized = email.lower().strip()
    return await repo.find_one_by({"email": normalized, "is_active": True})
