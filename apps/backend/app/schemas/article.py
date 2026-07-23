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

class ArticleContentBlockModel(BaseModel):
    id: str
    type: Literal['text', 'quote', 'image']
    content: Optional[str] = None
    quote: Optional[str] = None
    author: Optional[str] = None
    image: Optional[str] = None
    caption: Optional[str] = None
    font_size: Optional[Literal['small', 'medium', 'large']] = 'medium'

class ArticleModel(BaseModelMixin):
    id: Optional[str] = None
    title: str
    slug: str
    subtitle: Optional[str] = None
    category: str
    
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
