from fastapi import APIRouter, Depends
from app.schemas.cms_schemas import WhatIsTBSModel
from app.services.what_is_tbs_service import get_data, update_data
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/what-is-tbs", tags=["what_is_tbs"])

@router.get("/")
async def get_content():
    data = await get_data()
    return success_response(data=data)

@router.put("/", dependencies=[Depends(get_current_admin)])
async def update_content(payload: WhatIsTBSModel):
    updated = await update_data(payload)
    return success_response(data=updated, message="what_is_tbs updated successfully")
