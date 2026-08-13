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
    is_coming_soon: Optional[bool] = False


class LocationRegionModel(BaseModel):
    slug: Optional[str] = None
    label: str
    cities: List[LocationCityModel] = Field(default_factory=list)


class LocationTaxonomyModel(BaseModelMixin):
    regions: List[LocationRegionModel] = Field(default_factory=list)


# Shipped taxonomy, used until an editor saves their own. India/Mumbai and Indore ship first
# as active cities, with other regions marked coming soon.
DEFAULT_LOCATION_REGIONS: List[dict] = [
    {
        "slug": "india",
        "label": "India",
        "cities": [
            {"slug": "mumbai", "label": "Mumbai", "is_coming_soon": False},
            {"slug": "indore", "label": "Indore", "is_coming_soon": False},
            {"slug": "bangalore", "label": "Bangalore", "is_coming_soon": True},
            {"slug": "delhi", "label": "Delhi", "is_coming_soon": True},
            {"slug": "gujarat", "label": "Gujarat", "is_coming_soon": True},
            {"slug": "hyderabad", "label": "Hyderabad", "is_coming_soon": True},
        ],
    },
]

DEFAULT_LOCATION_MAIN = "india"
DEFAULT_LOCATION_SUB = "mumbai"

