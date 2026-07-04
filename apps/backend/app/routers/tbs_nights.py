from fastapi import APIRouter, Depends
from app.schemas.cms_schemas import TBSNightsModel
from app.services.tbs_nights_service import get_data, update_data
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/tbs-nights", tags=["tbs_nights"])

@router.get("/")
async def get_content():
    data = await get_data()
    return success_response(data=data)

@router.put("/", dependencies=[Depends(get_current_admin)])
async def update_content(payload: TBSNightsModel):
    updated = await update_data(payload)
    return success_response(data=updated, message="tbs_nights updated successfully")
