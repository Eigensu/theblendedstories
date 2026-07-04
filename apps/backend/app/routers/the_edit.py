from fastapi import APIRouter, Depends
from app.schemas.cms_schemas import ArticleModel
from app.services.the_edit_service import get_all, get_by_id, create, update, delete
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/the-edit", tags=["the_edit"])

@router.get("/")
async def list_items():
    items = await get_all()
    return success_response(data=items)

@router.get("/{item_id}")
async def get_item(item_id: str):
    item = await get_by_id(item_id)
    return success_response(data=item)

@router.post("/", dependencies=[Depends(get_current_admin)])
async def create_item(payload: ArticleModel):
    created = await create(payload)
    return success_response(data=created, message="Created successfully")

@router.put("/{item_id}", dependencies=[Depends(get_current_admin)])
async def update_item(item_id: str, payload: ArticleModel):
    updated = await update(item_id, payload)
    return success_response(data=updated, message="Updated successfully")

@router.delete("/{item_id}", dependencies=[Depends(get_current_admin)])
async def delete_item(item_id: str):
    await delete(item_id)
    return success_response(message="Deleted successfully")
