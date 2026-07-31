"""Shared slugging for editable label/slug trees (mega-menu, locations).

The rule these trees share: **a slug is minted once and never changes.** Articles
store slugs, not labels, and any listing URLs are built from them, so re-deriving
a slug from an edited label would silently orphan whatever was filed under it.
Editors rename labels freely; the slug underneath stays put.
"""

import re
import unicodedata


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


def assign_slugs(entries, fallback_prefix: str) -> list:
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
