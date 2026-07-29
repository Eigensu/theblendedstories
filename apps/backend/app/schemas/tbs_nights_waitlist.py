from datetime import datetime
from typing import Optional
from pydantic import BaseModel, validator


class WaitlistEntryCreate(BaseModel):
    email: str
    fullName: str
    age: str
    profession: str
    city: str
    instagram: str
    vibe1: int
    vibe2: int
    vibe3: int
    vibe4: int
    vibe5: int
    vibe6: int
    vibe7: int
    somethingElse: str
    dinnerTable: str
    updates: bool

    @validator("email")
    def email_valid(cls, v):
        if not v or "@" not in v:
            raise ValueError("Invalid email address")
        return v.lower().strip()

    @validator("fullName")
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Full name is required")
        return v.strip()

    @validator("age", "profession", "city", "dinnerTable")
    def required_fields(cls, v):
        if not v or not str(v).strip():
            raise ValueError("This field is required")
        return v

    @validator("vibe1", "vibe2", "vibe3", "vibe4", "vibe5", "vibe6", "vibe7")
    def vibe_valid(cls, v):
        if not isinstance(v, int) or v < 1 or v > 5:
            raise ValueError("Vibe ratings must be between 1 and 5")
        return v


class WaitlistEntryResponse(BaseModel):
    id: Optional[str] = None
    email: str
    fullName: str
    age: str
    profession: str
    city: str
    instagram: str
    vibe1: int
    vibe2: int
    vibe3: int
    vibe4: int
    vibe5: int
    vibe6: int
    vibe7: int
    somethingElse: str
    dinnerTable: str
    updates: bool
    created_at: Optional[datetime] = None
    is_active: Optional[bool] = True
