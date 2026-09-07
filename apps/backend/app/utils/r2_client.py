"""S3-compatible client for Cloudflare R2, replacing the Cloudinary uploader.

R2 exposes an S3-compatible API at <account_id>.r2.cloudflarestorage.com, so
boto3 talks to it like any other S3 bucket. Reads never go through this
client — they hit the public custom domain (R2_PUBLIC_URL) directly, which
is why there is no download/list method here, only put and delete.
"""

import uuid

import boto3
from botocore.config import Config

from app.config import settings

_client = None


def _r2():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
    return _client


def upload_media(file_obj, content_type: str, ext: str) -> str:
    """Upload a file-like object and return its public delivery URL."""
    key = f"theblendedstories/{uuid.uuid4().hex}{ext}"
    _r2().upload_fileobj(
        file_obj,
        settings.R2_BUCKET_NAME,
        key,
        ExtraArgs={
            "ContentType": content_type,
            "CacheControl": "public, max-age=31536000, immutable",
        },
    )
    return f"{settings.R2_PUBLIC_URL}/{key}"


def delete_media(url: str) -> None:
    """Delete an object given its public delivery URL. No-op if the URL
    doesn't belong to our R2 public domain (e.g. a leftover Cloudinary URL)."""
    prefix = f"{settings.R2_PUBLIC_URL}/"
    if not url.startswith(prefix):
        return
    key = url[len(prefix):]
    _r2().delete_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
