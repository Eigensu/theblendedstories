from pydantic import BaseModel, Field
from typing import List, Optional

from app.schemas.article import BaseModelMixin


class LocationCityModel(BaseModel):
    """One city under a region — a sub location.

    `slug` is what articles store in `location_sub` and what /locations URLs are
    built from. Absent when the admin sends a newly added city; the service mints
    one from the label and then never changes it again. See `location_service`.
    """
    slug: Optional[str] = None
    label: str


class LocationRegionModel(BaseModel):
    slug: Optional[str] = None
    label: str
    cities: List[LocationCityModel] = Field(default_factory=list)


class LocationTaxonomyModel(BaseModelMixin):
    regions: List[LocationRegionModel] = Field(default_factory=list)


# Shipped taxonomy, used until an editor saves their own. India/Mumbai ships first
# since it is the only region with articles filed under it today.
DEFAULT_LOCATION_REGIONS: List[dict] = [
    {
        "slug": "india",
        "label": "India",
        "cities": [
            {"slug": "mumbai", "label": "Mumbai"},
            {"slug": "indore", "label": "Indore"},
        ],
    },
]

DEFAULT_LOCATION_MAIN = "india"
DEFAULT_LOCATION_SUB = "mumbai"
