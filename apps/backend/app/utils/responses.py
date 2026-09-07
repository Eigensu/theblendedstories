from typing import Any, Optional

from app.utils.media_urls import optimize_media_urls

def success_response(data: Any = None, message: str = "Success", optimize_media: bool = True):
    # Cloudinary URLs are stored canonical and get their delivery transformations
    # added here, so every reader benefits without each route remembering to ask.
    # Routes that hand a URL back to be *stored* pass optimize_media=False — a
    # transformed URL must never make it into the database.
    return {
        "success": True,
        "message": message,
        "data": optimize_media_urls(data) if optimize_media else data
    }

def error_response(message: str = "An error occurred", data: Any = None):
    return {
        "success": False,
        "message": message,
        "data": data
    }
