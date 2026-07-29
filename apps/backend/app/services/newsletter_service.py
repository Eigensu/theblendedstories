"""Newsletter subscribers.

One document per email address, never one per submission. Every entry point
(the popup, Google sign-up, the TBS Nights waitlist) funnels through
`subscribe()`, so resubmitting the same address is a no-op rather than a
duplicate — the popup in particular is easy to submit twice.
"""

from datetime import datetime
from typing import Any, Optional

from app.repositories.base_repo import BaseRepository

repo = BaseRepository("newsletter_subscribers")


def normalize_email(email: str) -> str:
    """Emails are matched case-insensitively — Mongo comparisons are not."""
    return email.strip().lower()


async def find_by_email(email: str) -> Optional[dict[str, Any]]:
    return await repo.find_one_by({"email": normalize_email(email)})


async def subscribe(
    email: str,
    source: str = "popup",
    name: Optional[str] = None,
) -> dict[str, Any]:
    """Add or refresh a subscriber. Idempotent on the normalized email.

    An existing record keeps its original `source` and `subscribed_at` so the
    admin list still shows where someone first came from and when, rather than
    being overwritten by whichever form they happened to touch most recently.
    """
    normalized = normalize_email(email)
    existing = await find_by_email(normalized)

    if existing:
        updates: dict[str, Any] = {}
        # Re-subscribing after an unsubscribe should take effect.
        if not existing.get("subscribed"):
            updates["subscribed"] = True
            updates["subscribed_at"] = datetime.utcnow()
        if name and not existing.get("name"):
            updates["name"] = name

        if updates:
            await repo.update_one_by({"email": normalized}, updates)
        return await find_by_email(normalized)

    return await repo.create(
        {
            "email": normalized,
            "source": source,
            "name": name,
            "subscribed": True,
            "subscribed_at": datetime.utcnow(),
        }
    )


async def unsubscribe(email: str) -> bool:
    """Flip `subscribed` off but keep the record — needed for suppression lists."""
    return await repo.update_one_by({"email": normalize_email(email)}, {"subscribed": False})


async def list_subscribers() -> list[dict[str, Any]]:
    return await repo.find_many(sort_field="created_at", descending=True)
