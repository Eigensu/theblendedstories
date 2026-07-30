"""Exchanging a Google authorization code for a verified profile.

The browser runs the popup half of the OAuth code flow and sends us only a
short-lived `code`. The exchange happens here so the client secret stays on the
server, and the returned `id_token` is verified against Google's public keys
rather than trusted — an unverified ID token is just an attacker-supplied JSON
blob claiming to be whoever they like.
"""

from typing import Any

import httpx
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

from app.config import settings

_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"

# Required by Google for the popup (postmessage) variant of the code flow. This
# is a literal, not a URL we own, and must not be swapped for the site address.
_POPUP_REDIRECT_URI = "postmessage"

_EXCHANGE_TIMEOUT_SECONDS = 10


class GoogleAuthError(Exception):
    """Raised when a code cannot be exchanged or the resulting token is invalid."""


class GoogleNotConfigured(GoogleAuthError):
    """No client credentials on this server — an operator problem, not a user one."""


async def _exchange_code(code: str) -> str:
    """Swap an authorization code for an ID token."""
    async with httpx.AsyncClient(timeout=_EXCHANGE_TIMEOUT_SECONDS) as client:
        try:
            response = await client.post(
                _TOKEN_ENDPOINT,
                data={
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": _POPUP_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
            )
        except httpx.HTTPError as exc:
            raise GoogleAuthError("Could not reach Google to verify sign-in") from exc

    if response.status_code != 200:
        # Google puts the useful part in `error_description`; surface it for logs
        # but keep it out of the client-facing message.
        raise GoogleAuthError(f"Google rejected the sign-in code: {response.text}")

    payload = response.json()
    token = payload.get("id_token")
    if not token:
        raise GoogleAuthError("Google response contained no id_token")
    return token


def _verify_id_token(token: str) -> dict[str, Any]:
    try:
        claims = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        raise GoogleAuthError(f"Google ID token failed verification: {exc}") from exc

    if not claims.get("email"):
        raise GoogleAuthError("Google account has no email address")

    # An unverified address means someone could have signed up with an email they
    # do not control, which would let them collide with a real member's record.
    if not claims.get("email_verified"):
        raise GoogleAuthError("Google account email is not verified")

    return claims


async def profile_from_code(code: str) -> dict[str, Any]:
    """Full round trip: code -> verified Google profile."""
    if not settings.google_enabled:
        raise GoogleNotConfigured("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set")

    claims = _verify_id_token(await _exchange_code(code))
    return {
        "sub": claims["sub"],
        "email": claims["email"],
        "name": claims.get("name"),
        "picture": claims.get("picture"),
    }
