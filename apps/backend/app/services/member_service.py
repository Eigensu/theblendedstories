"""Site members — people who signed in with Google.

Separate from the single CMS admin in `app/auth.py`, which is a hardcoded
credential from the environment and has nothing to do with this collection.
"""

from datetime import datetime
from typing import Any, Optional

from app.repositories.base_repo import BaseRepository
from app.services import newsletter_service

repo = BaseRepository("users")


def to_public(user: Optional[dict[str, Any]]) -> Optional[dict[str, Any]]:
    """Strip a member record down to what the browser may see.

    `google_sub` in particular never leaves the server — it is the identifier we
    match on, so treating it as public would make account takeover a matter of
    guessing a field.
    """
    if not user:
        return None
    return {
        "id": user.get("id"),
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
        "newsletter_subscribed": user.get("newsletter_subscribed", True),
    }


async def get_by_id(member_id: str) -> Optional[dict[str, Any]]:
    return await repo.get_by_id(member_id)


async def get_by_email(email: str) -> Optional[dict[str, Any]]:
    return await repo.find_one_by({"email": newsletter_service.normalize_email(email)})


async def get_by_google_sub(google_sub: str) -> Optional[dict[str, Any]]:
    return await repo.find_one_by({"google_sub": google_sub})


async def upsert_from_google(profile: dict[str, Any]) -> dict[str, Any]:
    """Create or refresh a member from a verified Google profile.

    Matches on `google_sub` first, then falls back to email. The fallback is what
    links someone who already subscribed via the popup to the account they later
    create — without it they would end up as two unrelated records.

    Signing in subscribes to the newsletter, which the sign-in form states. An
    existing member who has since unsubscribed is not re-subscribed here; that
    would silently undo a deliberate choice every time they logged in.
    """
    email = newsletter_service.normalize_email(profile["email"])
    now = datetime.utcnow()

    existing = await get_by_google_sub(profile["sub"]) or await get_by_email(email)

    if existing:
        await repo.update(
            existing["id"],
            {
                "google_sub": profile["sub"],
                "email": email,
                "name": profile.get("name") or existing.get("name"),
                "picture": profile.get("picture") or existing.get("picture"),
                "last_login_at": now,
            },
        )
        user = await repo.get_by_id(existing["id"])
    else:
        user = await repo.create(
            {
                "google_sub": profile["sub"],
                "email": email,
                "name": profile.get("name"),
                "picture": profile.get("picture"),
                "provider": "google",
                "newsletter_subscribed": True,
                "subscribed_at": now,
                "last_login_at": now,
            }
        )

    if user.get("newsletter_subscribed"):
        await newsletter_service.subscribe(
            email, source="google_signup", name=user.get("name")
        )

    return user


async def set_newsletter_subscribed(user_id: str, subscribed: bool) -> Optional[dict[str, Any]]:
    user = await repo.get_by_id(user_id)
    if not user:
        return None

    await repo.update(user_id, {"newsletter_subscribed": subscribed})
    if subscribed:
        await newsletter_service.subscribe(
            user["email"], source="google_signup", name=user.get("name")
        )
    else:
        await newsletter_service.unsubscribe(user["email"])

    return await repo.get_by_id(user_id)


async def list_members() -> list[dict[str, Any]]:
    return await repo.find_many(sort_field="created_at", descending=True)
