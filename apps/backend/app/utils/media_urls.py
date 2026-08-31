"""Inject delivery transformations into Cloudinary URLs on the way out.

Stored URLs point at the original upload, so every request shipped a full-size
original — 1.57 MB on average, which is what exhausted the account's bandwidth
allowance. Adding `f_auto,q_auto` makes Cloudinary negotiate AVIF/WebP per
browser and pick a sane quality, which cuts the delivered bytes by roughly 90%
at identical visual quality.

This rewrites responses only. The URLs in MongoDB stay canonical and
untransformed, so the pending migration to object storage is unaffected and
this whole module can be deleted once assets are served from a CDN that does
its own format negotiation.
"""

import re
from typing import Any

# Applied to images only:
#   f_auto    negotiate AVIF/WebP from the request's Accept header
#   q_auto    quality chosen per-image rather than a fixed number
#   c_limit   shrink anything wider than the cap, never upscale
DEFAULT_TRANSFORM = "f_auto,q_auto,c_limit,w_1920"

_UPLOAD_RE = re.compile(
    r"(?P<prefix>https?://res\.cloudinary\.com/[^/\s]+/(?P<kind>image|video)/upload/)"
    r"(?P<rest>[^\s\"'<>)]*)"
)

# A transformation segment is a comma-joined list of <key>_<value> pairs. Folder
# names do not take that shape, so this distinguishes an already-transformed URL
# from one whose path starts with a folder.
_TRANSFORM_SEGMENT_RE = re.compile(r"^[a-z]{1,3}_[^/,]+(,[a-z]{1,3}_[^/,]+)*$")


def _rewrite(match: re.Match) -> str:
    prefix, kind, rest = match.group("prefix"), match.group("kind"), match.group("rest")

    # Leave video alone: there are only a handful, and video transformations are
    # billed far more heavily than the bandwidth they would save here.
    if kind == "video":
        return match.group(0)

    first_segment = rest.split("/")[0] if rest else ""
    if _TRANSFORM_SEGMENT_RE.match(first_segment):
        # Already carries a transformation — re-applying would nest them.
        return match.group(0)

    return f"{prefix}{DEFAULT_TRANSFORM}/{rest}"


def optimize_url(url: str) -> str:
    """Add delivery transformations to a single Cloudinary image URL."""
    return _UPLOAD_RE.sub(_rewrite, url)


def optimize_media_urls(data: Any) -> Any:
    """Walk a response body and optimize every Cloudinary URL it contains.

    Handles arbitrarily nested payloads because article images live several
    levels deep, in `contentBlocks[].images[].image`.
    """
    if isinstance(data, str):
        return optimize_url(data) if "res.cloudinary.com" in data else data
    if isinstance(data, dict):
        return {key: optimize_media_urls(value) for key, value in data.items()}
    if isinstance(data, list):
        return [optimize_media_urls(item) for item in data]
    return data
