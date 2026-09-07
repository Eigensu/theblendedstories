import os

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.auth import get_current_admin
from app.utils.responses import success_response
from app.utils import r2_client

router = APIRouter(prefix="/media", tags=["media"])

@router.post("/upload", dependencies=[Depends(get_current_admin)])
async def upload_media(file: UploadFile = File(...)):
    try:
        ext = os.path.splitext(file.filename or "")[1]
        url = r2_client.upload_media(
            file.file,
            content_type=file.content_type or "application/octet-stream",
            ext=ext,
        )
        # The admin stores this URL verbatim — it is already the final,
        # publicly-servable location, so no delivery-time rewriting applies.
        return success_response(
            data={"url": url},
            message="Uploaded successfully",
            optimize_media=False,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete", dependencies=[Depends(get_current_admin)])
async def delete_media(url: str):
    try:
        r2_client.delete_media(url)
        return success_response(message="Deleted successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
