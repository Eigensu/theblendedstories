from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class BaseModelMixin(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool = True
    status: str = "published" # 'draft' or 'published'

class EmbeddedVideoModel(BaseModel):
    url: str
    thumbnail: str

class GalleryItemModel(BaseModel):
    image: str
    caption: Optional[str] = None
    # Instagram (or any) URL the image opens when a reader clicks it.
    link: Optional[str] = None

class ArticleImageItemModel(BaseModel):
    image: str
    caption: Optional[str] = None
    link: Optional[str] = None

class ArticleContentBlockModel(BaseModel):
    id: str
    type: Literal['text', 'quote', 'image']
    content: Optional[str] = None
    quote: Optional[str] = None
    author: Optional[str] = None
    # An image block holds a row of images in `images`. `image`/`caption`/`link`
    # mirror the first entry so documents written before the row existed — and
    # any reader still on the single-image shape — keep working.
    images: List[ArticleImageItemModel] = Field(default_factory=list)
    image: Optional[str] = None
    caption: Optional[str] = None
    link: Optional[str] = None

class ArticleModel(BaseModelMixin):
    id: Optional[str] = None
    title: str
    slug: str
    subtitle: Optional[str] = None
    category: str

    # Menu taxonomy. `primary_keyword` is a mega-menu section slug ("fashion"),
    # `sub_keyword` one of the items beneath it ("bridal"); a sub keyword is only
    # meaningful alongside its primary. Both are optional so existing articles and
    # in-progress drafts keep saving — they simply don't appear on /topics pages
    # until an editor files them. The canonical list lives in the frontend at
    # src/constants/menuTaxonomy.ts and is enforced by the admin dropdowns.
    primary_keyword: Optional[str] = None
    sub_keyword: Optional[str] = None

    # Location taxonomy, same shape as the keyword pair above: `location_main`
    # is a region slug ("india"), `location_sub` a city slug beneath it
    # ("mumbai"). Both optional so existing articles keep saving; the CMS
    # backfills new articles to the default location on create. See
    # `location_service` for the canonical list and slug rules.
    location_main: Optional[str] = None
    location_sub: Optional[str] = None

    author: str
    author_image: str
    author_role: str
    instagram_url: Optional[str] = None
    
    hero_image: str
    hero_video: Optional[str] = None
    cover_image: str
    
    reading_time: str
    publish_date: str
    
    content: Optional[List[str]] = None
    contentBlocks: List[ArticleContentBlockModel] = Field(default_factory=list)
    
    pull_quote: Optional[str] = None
    quote_author: Optional[str] = None
    
    gallery: List[GalleryItemModel] = []
    
    embedded_video: Optional[EmbeddedVideoModel] = None
    
    editorial_note: Optional[str] = None
    related_articles: List[str] = []
    
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    
    featured: bool = False
    display_order: int = 0
