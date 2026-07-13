from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.the_edit import TheEditModel
from app.services.the_edit_service import TheEditService

router = APIRouter(prefix="/the-edit", tags=["The Edit (Deprecated)"])

def get_service():
    return TheEditService()

@router.get("/")
async def get_the_edit(service: TheEditService = Depends(get_service)):
    # Deprecated endpoint
    items = await service.get_all()
    return {"success": True, "data": items}

@router.post("/")
async def create_the_edit(item: TheEditModel, service: TheEditService = Depends(get_service)):
    result = await service.create(item)
    return {"success": True, "data": result}

@router.put("/{item_id}")
async def update_the_edit(item_id: str, item: TheEditModel, service: TheEditService = Depends(get_service)):
    result = await service.update(item_id, item)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True, "data": result}

@router.delete("/{item_id}")
async def delete_the_edit(item_id: str, service: TheEditService = Depends(get_service)):
    if not await service.delete(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
    return {"success": True, "message": "Deleted successfully"}
