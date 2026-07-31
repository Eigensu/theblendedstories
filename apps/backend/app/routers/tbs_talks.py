from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.schemas.cms_schemas import SpeakerModel
from app.services.tbs_talks_service import get_all, get_by_id, create, update, delete, patch_fields
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/tbs-talks", tags=["tbs_talks"])

class TBSTalksFeaturedPatch(BaseModel):
    featured: bool
    display_order: int

@router.get("/")
async def list_items(featured: Optional[bool] = None):
    items = await get_all(featured_only=featured)
    # `or` rather than a comparison: display_order is null on older documents and
    # `None > 0` raises, 500-ing the whole listing. Falsy (null/0) sorts last, as before.
    items = sorted(items, key=lambda x: x.get("display_order") or 999999)
    return success_response(data=items)

@router.get("/{item_id}")
async def get_item(item_id: str):
    item = await get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return success_response(data=item)

@router.post("/", dependencies=[Depends(get_current_admin)])
async def create_item(payload: SpeakerModel):
    created = await create(payload)
    return success_response(data=created, message="Created successfully")

@router.put("/{item_id}", dependencies=[Depends(get_current_admin)])
async def update_item(item_id: str, payload: SpeakerModel):
    updated = await update(item_id, payload)
    return success_response(data=updated, message="Updated successfully")

@router.patch("/{item_id}/featured", dependencies=[Depends(get_current_admin)])
async def patch_item_featured(item_id: str, payload: TBSTalksFeaturedPatch):
    updated = await patch_fields(item_id, payload.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return success_response(data=updated, message="Updated successfully")

@router.delete("/{item_id}", dependencies=[Depends(get_current_admin)])
async def delete_item(item_id: str):
    await delete(item_id)
    return success_response(message="Deleted successfully")
