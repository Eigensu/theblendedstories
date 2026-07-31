"""The editable mega-menu taxonomy.

Stored as a singleton, like `footer` — the menu is one ordered tree, so reordering
and saving it is a single atomic write rather than a per-row dance.

The rule this module exists to enforce: **a slug is minted once and never changes.**
Articles store `primary_keyword`/`sub_keyword` as slugs, and the /topics URLs are
built from them, so re-deriving a slug from an edited label would silently orphan
every article filed under it and break any link already shared. Editors rename
labels freely; the slug underneath stays put.
"""

from app.repositories.base_repo import BaseRepository
from app.schemas.menu import DEFAULT_MENU_SECTIONS, MenuModel
from app.utils.taxonomy import assign_slugs, slugify

repo = BaseRepository("menu")

# Re-exported: tests and other services import `slugify` from this module.
_assign_slugs = assign_slugs


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
