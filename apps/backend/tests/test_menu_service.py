"""Unit tests for the menu taxonomy normalization in app/services/menu_service.py.

No database and no running server — `normalize_sections` is pure.

    python tests/test_menu_service.py

The stakes here are higher than they look. Articles store keywords as slugs and the
/topics URLs are built from them, so a slug that shifts under an edit orphans every
article filed under it and dead-links anything already shared. Most of what follows
guards that one property.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# menu_service pulls in the repository, and app.config requires these to import.
# The values are irrelevant — nothing here touches the database.
os.environ.setdefault("ADMIN_PASSWORD", "x" * 12)
os.environ.setdefault("SECRET_KEY", "y" * 32)

from app.schemas.menu import DEFAULT_MENU_SECTIONS
from app.services.menu_service import normalize_sections, slugify

failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


# --- slugify ---------------------------------------------------------------

check("ampersand becomes 'and'", slugify("Food & Drink") == "food-and-drink",
      slugify("Food & Drink"))
check("accents are folded to ASCII", slugify("Cafés") == "cafes", slugify("Cafés"))
check("accents mid-word are folded", slugify("Home Décor") == "home-decor",
      slugify("Home Décor"))
check("spaces collapse to single hyphens", slugify("  Best   Of  ") == "best-of",
      slugify("  Best   Of  "))
check("punctuation-only label yields empty", slugify("!!!") == "")

# The shipped defaults must be exactly what slugify would produce, or a word added
# through the admin would sort differently from the same word shipped in code.
mismatched = [
    (item["label"], item["slug"])
    for section in DEFAULT_MENU_SECTIONS
    for item in section["items"]
    if slugify(item["label"]) != item["slug"]
] + [
    (section["label"], section["slug"])
    for section in DEFAULT_MENU_SECTIONS
    if slugify(section["label"]) != section["slug"]
]
check("every shipped slug matches slugify(label)", not mismatched, mismatched)


# --- slug immutability -----------------------------------------------------

renamed = normalize_sections([
    {
        "slug": "fashion",
        "label": "Style",  # section renamed
        "items": [{"slug": "bridal", "label": "Weddings"}],  # word renamed
    }
])
check("renaming a section keeps its slug", renamed[0]["slug"] == "fashion",
      renamed[0]["slug"])
check("renaming a word keeps its slug",
      renamed[0]["items"][0]["slug"] == "bridal", renamed[0]["items"][0]["slug"])
check("renaming still updates the label", renamed[0]["items"][0]["label"] == "Weddings")

# A new entry arrives with no slug and must not evict an existing one that owns the
# slug its label would generate. This is the two-pass case.
collision = normalize_sections([
    {
        "slug": "fashion",
        "label": "Fashion",
        "items": [
            {"label": "Bridal"},                        # new, would mint "bridal"
            {"slug": "bridal", "label": "Bridal Wear"}, # existing, owns "bridal"
        ],
    }
])
item_slugs = [item["slug"] for item in collision[0]["items"]]
check("an existing slug is never taken by a new entry",
      item_slugs[1] == "bridal", item_slugs)
check("the new entry is suffixed instead", item_slugs[0] == "bridal-2", item_slugs)


# --- new entries -----------------------------------------------------------

added = normalize_sections([
    {"label": "Menswear", "items": [{"label": "Tailoring & Suits"}]}
])
check("a new section is slugged from its label", added[0]["slug"] == "menswear",
      added[0]["slug"])
check("a new word is slugged from its label",
      added[0]["items"][0]["slug"] == "tailoring-and-suits",
      added[0]["items"][0]["slug"])
check("menu_title defaults to the upper-cased label",
      added[0]["menu_title"] == "MENSWEAR", added[0]["menu_title"])

explicit_title = normalize_sections([
    {"label": "Beauty & Wellness", "menu_title": "BEAUTY &\nWELLNESS", "items": []}
])
check("an explicit menu_title is preserved with its line break",
      explicit_title[0]["menu_title"] == "BEAUTY &\nWELLNESS")

duplicates = normalize_sections([
    {"label": "Travel", "items": []},
    {"label": "Travel", "items": []},
])
check("two sections named alike get distinct slugs",
      [s["slug"] for s in duplicates] == ["travel", "travel-2"],
      [s["slug"] for s in duplicates])

unnameable = normalize_sections([{"label": "!!!", "items": [{"label": "???"}]}])
check("a label with no slug characters still gets a usable slug",
      unnameable[0]["slug"] == "section-1", unnameable[0]["slug"])
check("so does its word", unnameable[0]["items"][0]["slug"] == "item-1",
      unnameable[0]["items"][0]["slug"])


# --- blank rows ------------------------------------------------------------

blanks = normalize_sections([
    {"label": "  ", "items": [{"label": "Ghost"}]},
    {"label": "Design", "items": [{"label": ""}, {"label": "Interiors"}]},
])
check("a section with no label is dropped", len(blanks) == 1, len(blanks))
check("a word with no label is dropped",
      [item["label"] for item in blanks[0]["items"]] == ["Interiors"])

check("an empty menu normalizes to an empty list", normalize_sections([]) == [])
check("None normalizes to an empty list", normalize_sections(None) == [])


# --- round trip ------------------------------------------------------------

# Re-saving an untouched menu must be a no-op, or every save would drift the slugs.
round_tripped = normalize_sections(DEFAULT_MENU_SECTIONS)
check("normalizing the shipped defaults changes nothing",
      round_tripped == DEFAULT_MENU_SECTIONS)
check("and is stable on a second pass",
      normalize_sections(round_tripped) == round_tripped)

print("\nAll menu service tests passed." if not failures else f"\n{failures} test(s) failed.")
sys.exit(1 if failures else 0)
