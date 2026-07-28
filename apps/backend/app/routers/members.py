from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import (
    SCOPE_MEMBER,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    get_current_admin,
    get_current_member_id,
)
from app.schemas.member import GoogleAuthRequest
from app.services import google_oauth, member_service
from app.services.google_oauth import GoogleAuthError, GoogleNotConfigured
from app.utils.logger import log_api_error
from app.utils.responses import success_response
from pydantic import BaseModel

router = APIRouter(prefix="/members", tags=["members"])


class MemberRefreshRequest(BaseModel):
    refresh_token: str


class NewsletterPreference(BaseModel):
    subscribed: bool


def _tokens_for(user: dict) -> dict:
    return {
        "access_token": create_access_token({"sub": user["id"]}, scope=SCOPE_MEMBER),
        "refresh_token": create_refresh_token({"sub": user["id"]}, scope=SCOPE_MEMBER),
    }


@router.post("/auth/google")
async def sign_in_with_google(payload: GoogleAuthRequest):
    """Exchange a Google authorization code for a TBS member session."""
    try:
        profile = await google_oauth.profile_from_code(payload.code)
    except GoogleNotConfigured as exc:
        # 503 rather than 400: nothing is wrong with the request, the server is
        # missing credentials. A 400 here would send someone hunting the client.
        log_api_error(
            method="POST",
            endpoint="/members/auth/google",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            category="Google Sign-In",
            message=str(exc),
            payload=None,
        )
        raise HTTPException(status_code=503, detail="Google sign-in is not configured")
    except GoogleAuthError as exc:
        # The detail carries Google's own error text, which is useful in the log
        # but not something to hand back to the browser verbatim.
        log_api_error(
            method="POST",
            endpoint="/members/auth/google",
            status_code=status.HTTP_400_BAD_REQUEST,
            category="Google Sign-In",
            message=str(exc),
            payload=None,
        )
        raise HTTPException(status_code=400, detail="Google sign-in failed")

    user = await member_service.upsert_from_google(profile)
    return success_response(
        data={**_tokens_for(user), "user": member_service.to_public(user)},
        message="Signed in successfully",
    )


@router.post("/auth/refresh")
async def refresh_member_session(payload: MemberRefreshRequest):
    claims = decode_refresh_token(payload.refresh_token, SCOPE_MEMBER)

    # A deleted member must not be able to refresh their way back in.
    user = await member_service.get_by_id(claims["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    return success_response(
        data={**_tokens_for(user), "user": member_service.to_public(user)}
    )


@router.get("/me")
async def get_me(member_id: str = Depends(get_current_member_id)):
    user = await member_service.get_by_id(member_id)
    if not user:
        raise HTTPException(status_code=404, detail="Member not found")
    return success_response(data=member_service.to_public(user))


@router.patch("/me/newsletter")
async def update_my_newsletter_preference(
    payload: NewsletterPreference,
    member_id: str = Depends(get_current_member_id),
):
    user = await member_service.set_newsletter_subscribed(member_id, payload.subscribed)
    if not user:
        raise HTTPException(status_code=404, detail="Member not found")
    return success_response(data=member_service.to_public(user), message="Updated successfully")


@router.get("/", dependencies=[Depends(get_current_admin)])
async def list_members():
    """Full member records for the admin CRM view."""
    return success_response(data=await member_service.list_members())
