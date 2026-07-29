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


async def list_entries() -> list[dict]:
    """List all active waitlist entries, newest first."""
    return await repo.find_many(sort_field="created_at", descending=True)
