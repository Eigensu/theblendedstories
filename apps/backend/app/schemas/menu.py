from pydantic import BaseModel, Field
from typing import List, Optional

from app.schemas.article import BaseModelMixin


class MenuItemModel(BaseModel):
    """One word under a section — a sub keyword.

    `slug` is what articles store and what the URL is built from. It is absent when
    the admin sends a newly added word; the service mints one from the label and
    then never changes it again. See `menu_service` for why.
    """
    slug: Optional[str] = None
    label: str


class MenuSectionModel(BaseModel):
    slug: Optional[str] = None
    label: str
    # Heading as drawn in the menu column. A newline splits it over two lines, which
    # is how "BEAUTY & WELLNESS" fits its column. Defaults to the upper-cased label.
    menu_title: Optional[str] = None
    items: List[MenuItemModel] = Field(default_factory=list)


class MenuModel(BaseModelMixin):
    sections: List[MenuSectionModel] = Field(default_factory=list)


# Shipped taxonomy, used until an editor saves their own. Kept in step with the
# frontend's DEFAULT_MENU_SECTIONS so a cold database and an unreachable backend
# both render the same menu.
DEFAULT_MENU_SECTIONS: List[dict] = [
    {
        "slug": "fashion",
        "label": "Fashion",
        "menu_title": "FASHION",
        "items": [
            {"slug": "fashion", "label": "Fashion"},
            {"slug": "jewellery-and-watches", "label": "Jewellery & Watches"},
            {"slug": "accessories", "label": "Accessories"},
            {"slug": "bridal", "label": "Bridal"},
            {"slug": "trend-reports", "label": "Trend Reports"},
        ],
    },
    {
        "slug": "food-and-drink",
        "label": "Food & Drink",
        "menu_title": "FOOD & DRINK",
        "items": [
            {"slug": "restaurants", "label": "Restaurants"},
            {"slug": "cafes", "label": "Cafés"},
            {"slug": "bars-and-cocktails", "label": "Bars & Cocktails"},
            {"slug": "desserts", "label": "Desserts"},
            {"slug": "new-openings", "label": "New Openings"},
        ],
    },
    {
        "slug": "travel",
        "label": "Travel",
        "menu_title": "TRAVEL",
        "items": [
            {"slug": "hotels-and-stays", "label": "Hotels & Stays"},
            {"slug": "destinations", "label": "Destinations"},
            {"slug": "city-guides", "label": "City Guides"},
            {"slug": "weekend-escapes", "label": "Weekend Escapes"},
            {"slug": "travel-trends", "label": "Travel Trends"},
        ],
    },
    {
        "slug": "beauty-and-wellness",
        "label": "Beauty & Wellness",
        "menu_title": "BEAUTY &\nWELLNESS",
        "items": [
            {"slug": "beauty", "label": "Beauty"},
            {"slug": "skincare", "label": "Skincare"},
            {"slug": "hair-and-makeup", "label": "Hair & Makeup"},
            {"slug": "wellness", "label": "Wellness"},
            {"slug": "treatments", "label": "Treatments"},
        ],
    },
    {
        "slug": "design",
        "label": "Design",
        "menu_title": "DESIGN",
        "items": [
            {"slug": "interiors", "label": "Interiors"},
            {"slug": "architecture", "label": "Architecture"},
            {"slug": "home-decor", "label": "Home Décor"},
            {"slug": "furniture", "label": "Furniture"},
            {"slug": "styling", "label": "Styling"},
        ],
    },
    {
        "slug": "culture",
        "label": "Culture",
        "menu_title": "CULTURE",
        "items": [
            {"slug": "people", "label": "People"},
            {"slug": "arts", "label": "Arts"},
            {"slug": "entertainment", "label": "Entertainment"},
            {"slug": "events", "label": "Events"},
            {"slug": "tbs-talks", "label": "TBS Talks"},
        ],
    },
    {
        "slug": "the-blended-edit",
        "label": "The Blended Edit",
        "menu_title": "THE BLENDED EDIT",
        "items": [
            {"slug": "curated", "label": "Curated"},
            {"slug": "weekend", "label": "Weekend"},
            {"slug": "monthly", "label": "Monthly"},
            {"slug": "luxury", "label": "Luxury"},
            {"slug": "best-of", "label": "Best Of"},
        ],
    },
]
