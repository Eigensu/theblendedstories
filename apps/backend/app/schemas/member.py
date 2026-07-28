from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

# Where a subscriber came from. Kept as a closed set so the admin list can be
# segmented — a Google sign-up is a warmer lead than a popup email.
SubscriptionSource = Literal["popup", "google_signup", "tbs_nights"]


class UserModel(BaseModel):
    """A site member. Distinct from the single CMS admin in app/auth.py."""

    id: Optional[str] = None

    google_sub: str
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None
    provider: str = "google"

    newsletter_subscribed: bool = True
    subscribed_at: Optional[datetime] = None

    last_login_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool = True


class PublicUser(BaseModel):
    """What the browser is allowed to see. Never leaks google_sub."""

    id: Optional[str] = None
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None
    newsletter_subscribed: bool = True


class SubscriberModel(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    source: SubscriptionSource = "popup"
    name: Optional[str] = None
    subscribed: bool = True
    subscribed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool = True


class SubscribeRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = Field(default=None, max_length=120)


class GoogleAuthRequest(BaseModel):
    """Authorization code from the Google popup, not an ID token."""

    code: str = Field(min_length=1)
