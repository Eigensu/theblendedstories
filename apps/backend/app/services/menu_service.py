"""The editable mega-menu taxonomy.

Stored as a singleton, like `footer` — the menu is one ordered tree, so reordering
and saving it is a single atomic write rather than a per-row dance.

The rule this module exists to enforce: **a slug is minted once and never changes.**
Articles store `primary_keyword`/`sub_keyword` as slugs, and the /topics URLs are
built from them, so re-deriving a slug from an edited label would silently orphan
every article filed under it and break any link already shared. Editors rename
labels freely; the slug underneath stays put.
"""

import re
import unicodedata

from app.repositories.base_repo import BaseRepository
from app.schemas.menu import DEFAULT_MENU_SECTIONS, MenuModel

repo = BaseRepository("menu")


def slugify(text: str) -> str:
    # "&" has to read as "and" or "Food & Drink" collapses to "food-drink".
    normalized = (text or "").replace("&", " and ")
    # Decompose accents and drop the combining marks, so "Cafés" and "Home Décor"
    # yield ASCII slugs instead of losing the character entirely.
    normalized = unicodedata.normalize("NFKD", normalized)
    normalized = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    return re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()


def _unique(candidate: str, taken: set, fallback: str) -> str:
    """`candidate` if free, else the first `-2`, `-3`… variant that is."""
    base = candidate or fallback
    slug = base
    suffix = 2
    while slug in taken:
        slug = f"{base}-{suffix}"
        suffix += 1
    taken.add(slug)
    return slug


def _assign_slugs(entries, fallback_prefix: str) -> list:
    """Clean a list of {label, slug} rows, filling in slugs for the new ones.

    Two passes, not one. Minting inline would let a newly added word claim a slug
    that an existing word further down the list already owns — the existing one
    would be pushed to `-2` and every article filed under it would come unstuck.
    Reserving the incoming slugs first makes new entries yield to old ones.
    """
    cleaned = []
    for entry in entries or []:
        label = (entry.get("label") or "").strip()
        # A blank row is a half-finished edit, not data.
        if not label:
            continue
        cleaned.append(
            {**entry, "label": label, "slug": (entry.get("slug") or "").strip()}
        )

    taken = set()

    for entry in cleaned:
        if entry["slug"]:
            entry["slug"] = _unique(entry["slug"], taken, entry["slug"])

    for index, entry in enumerate(cleaned):
        if not entry["slug"]:
            entry["slug"] = _unique(
                slugify(entry["label"]), taken, f"{fallback_prefix}-{index + 1}"
            )

    return cleaned


def normalize_sections(sections) -> list:
    """Canonical storage shape: every entry slugged, ordered as the editor left it."""
    normalized = []

    for section in _assign_slugs(sections, "section"):
        items = [
            {"slug": item["slug"], "label": item["label"]}
            for item in _assign_slugs(section.get("items"), "item")
        ]
        normalized.append(
            {
                "slug": section["slug"],
                "label": section["label"],
                "menu_title": (section.get("menu_title") or "").strip()
                or section["label"].upper(),
                "items": items,
            }
        )

    return normalized


async def get_data():
    data = await repo.get_singleton()
    # Only a cold database falls back to the shipped taxonomy. Once an editor has
    # saved, what they saved is what they get — including an emptied menu, which
    # would otherwise spring back to the defaults and look like the save failed.
    if data is None:
        return {"sections": DEFAULT_MENU_SECTIONS}
    return {**data, "sections": data.get("sections") or []}


async def update_data(payload: MenuModel):
    sections = normalize_sections(
        [section.model_dump() for section in payload.sections]
    )
    return await repo.update_singleton({"sections": sections})
