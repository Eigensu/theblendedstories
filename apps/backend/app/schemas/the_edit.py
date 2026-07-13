from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TheEditModel(BaseModel):
    id: Optional[str] = None
    story_url: str
    cover_image_url: str
    title: str
    description: str
    display_number: int
    published: bool = True
    display_order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
