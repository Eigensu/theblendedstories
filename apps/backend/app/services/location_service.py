"""The editable location taxonomy (region -> city).

Stored as a singleton, like `menu` — it is one ordered tree, so reordering and
saving it is a single atomic write rather than a per-row dance.

Same rule as the mega-menu taxonomy: **a slug is minted once and never changes.**
Articles store `location_main`/`location_sub` as slugs, and any /locations URLs
are built from them, so re-deriving a slug from an edited label would silently
orphan every article filed under it.
"""

from app.repositories.base_repo import BaseRepository
from app.schemas.location import DEFAULT_LOCATION_REGIONS, LocationTaxonomyModel
from app.utils.taxonomy import assign_slugs

repo = BaseRepository("locations")


def normalize_regions(regions) -> list:
    """Canonical storage shape: every entry slugged, ordered as the editor left it."""
    normalized = []

    for region in assign_slugs(regions, "region"):
        cities = [
            {
                "slug": city["slug"],
                "label": city["label"],
                "is_coming_soon": city.get("is_coming_soon", False),
            }
            for city in assign_slugs(region.get("cities"), "city")
        ]
        normalized.append(
            {
                "slug": region["slug"],
                "label": region["label"],
                "cities": cities,
            }
        )

    return normalized


async def get_data():
    data = await repo.get_singleton()
    # Only a cold database falls back to the shipped taxonomy. Once an editor has
    # saved, what they saved is what they get.
    if data is None:
        return {"regions": DEFAULT_LOCATION_REGIONS}
    return {**data, "regions": data.get("regions") or []}


async def update_data(payload: LocationTaxonomyModel):
    regions = normalize_regions(
        [region.model_dump() for region in payload.regions]
    )
    return await repo.update_singleton({"regions": regions})
