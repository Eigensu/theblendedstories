from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BaseModelMixin(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool = True
    status: str = "published" # Supports 'draft' or 'published'

class HeroModel(BaseModelMixin):
    video_desktop_url: Optional[str] = None
    video_mobile_url: Optional[str] = None
    modal_title_join: str = "Get Blended."
    modal_title_login: str = "Welcome Back."
    modal_description: str = "Join the community. Get early access, exclusive drops, and stories worth reading."
    button_text: str = "Get Blended"
    button_links: Optional[str] = None

class WhatIsTBSModel(BaseModelMixin):
    title: str = "WHAT IS THE BLENDED STORIES?"
    paragraphs: List[str] = [
        "The first social-forward lifestyle magazine where storytelling meets cultural vibe check.",
        "Part Instagram. Part editorial. Part survival guide for navigating the city properly.",
        "From fashion and nightlife to restaurants, travel, beauty, design, and the people shaping culture right now, all in language you're already fluent in."
    ]
    image_url: Optional[str] = None
    button_text: str = "Get Blended"
    button_link: Optional[str] = None

class WhatWeCoverSlide(BaseModelMixin):
    id: Optional[str] = None
    image_url: str
    caption: str
    display_order: int
    visibility: bool = True

class TBSNightsModel(BaseModelMixin):
    video_url: Optional[str] = None
    poster_url: Optional[str] = None
    title: str = "TBS Nights"
    subtitle: str = "The conversations that don't happen online."
    paragraphs: List[str] = [
        "TBS Nights is an intimate dinner series by The Blended Stories that brings together founders, creatives, tastemakers and cultural voices for meaningful conversations beyond likes, algorithms and timelines.",
        "Because the best connections happen when people put their phones down and pull up a chair."
    ]
    button_text: str = "JOIN THE WAITLIST"
    button_link: str = "/tbs-nights"

class ArticleModel(BaseModelMixin):
    id: Optional[str] = None
    cover_image_url: str
    title: str
    description: str
    story_url: Optional[str] = None
    display_number: str
    display_order: int
    published: bool = True

class SpeakerModel(BaseModelMixin):
    id: Optional[str] = None
    photo_url: str
    name: str
    designation: str
    date: str
    profile_url: Optional[str] = None
    social_link: Optional[str] = None
    display_order: int
    visibility: bool = True
    featured: bool = False

class FooterModel(BaseModelMixin):
    logo_url: Optional[str] = None
    background_url: Optional[str] = None
    quick_links: List[dict] = [{"label": "Lifestyle & Travel", "url": "#"}, {"label": "Fashion", "url": "#"}]
    locations: List[dict] = [{"label": "Mumbai", "url": "#"}, {"label": "Dubai", "url": "#"}]
    social_links: List[dict] = []
    copyright: str = "©2024. All Rights Reserved."
    legal_links: List[dict] = [{"label": "Privacy Policy", "url": "#"}, {"label": "Terms of Use", "url": "#"}]
    email: Optional[str] = None
    phone: Optional[str] = None

class SEOModel(BaseModelMixin):
    title: str = "The Blended Stories"
    description: str = "The first social-forward lifestyle magazine."
    keywords: str = "lifestyle, magazine, culture, stories"
    og_image_url: Optional[str] = None
    favicon_url: Optional[str] = None

class SettingsModel(BaseModelMixin):
    website_name: str = "The Blended Stories"
    logo_url: Optional[str] = None
    primary_email: Optional[str] = None
    phone: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    address: Optional[str] = None
    
    # Array Section Headings
    what_we_cover_title: str = "What We Cover"
    the_edit_title: str = "The Edit"
    the_edit_description: str = "A curated selection of our most recent and essential stories."
    tbs_talks_title: str = "TBS Talks"
    tbs_talks_subtitle: str = "Conversation with people shaping what's next"
