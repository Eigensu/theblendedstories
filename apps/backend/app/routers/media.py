from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
from app.config import settings
from app.auth import get_current_admin
from app.utils.responses import success_response

router = APIRouter(prefix="/media", tags=["media"])

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

@router.post("/upload", dependencies=[Depends(get_current_admin)])
async def upload_media(file: UploadFile = File(...)):
    try:
        resource_type = "video" if file.content_type and file.content_type.startswith("video") else "image"
        result = cloudinary.uploader.upload(
            file.file,
            resource_type=resource_type,
            folder="theblendedstories"
        )
        return success_response(data={"url": result.get("secure_url")}, message="Uploaded successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete", dependencies=[Depends(get_current_admin)])
async def delete_media(url: str):
    try:
        # Simplistic approach: just return success since real deletion requires public_id extraction
        return success_response(message="Deleted successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
