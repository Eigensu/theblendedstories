from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Admin tokens and member tokens are signed with the same secret, so the only
# thing separating a CMS operator from a signed-in reader is this claim. It is
# checked on both sides rather than inferred from `sub`.
SCOPE_ADMIN = "admin"
SCOPE_MEMBER = "member"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None, scope: str = SCOPE_ADMIN):
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "type": "access", "scope": scope})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, scope: str = SCOPE_ADMIN):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh", "scope": scope})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def _credentials_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def decode_access_token(token: str) -> dict:
    """Decode a non-refresh token or raise 401. Does not check scope."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise _credentials_exception()

    if payload.get("type") == "refresh":
        raise _credentials_exception()
    if payload.get("sub") is None:
        raise _credentials_exception()
    return payload

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)

    # Tokens minted before scopes existed have no `scope` claim, so absence is
    # treated as admin to avoid signing every operator out on deploy. Member
    # tokens are always stamped, so this still rejects them.
    if payload.get("scope") == SCOPE_MEMBER:
        raise _credentials_exception()

    token_data = TokenData(username=payload.get("sub"))
    if token_data.username != settings.ADMIN_USERNAME:
        raise _credentials_exception()

    return token_data.username

def decode_refresh_token(token: str, scope: str) -> dict:
    """Decode a refresh token of the given scope or raise 401."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise _credentials_exception()

    if payload.get("type") != "refresh" or payload.get("scope") != scope:
        raise _credentials_exception()
    if payload.get("sub") is None:
        raise _credentials_exception()
    return payload

async def get_current_member_id(token: str = Depends(oauth2_scheme)) -> str:
    """Member id from a member-scoped token. Strict — no legacy tokens exist."""
    payload = decode_access_token(token)
    if payload.get("scope") != SCOPE_MEMBER:
        raise _credentials_exception()
    return payload["sub"]
