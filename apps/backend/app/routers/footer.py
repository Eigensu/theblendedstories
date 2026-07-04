from fastapi import APIRouter, Depends
from app.schemas.cms_schemas import FooterModel
from app.services.footer_service import get_data, update_data
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/footer", tags=["footer"])

@router.get("/")
async def get_content():
    data = await get_data()
    return success_response(data=data)

@router.put("/", dependencies=[Depends(get_current_admin)])
async def update_content(payload: FooterModel):
    updated = await update_data(payload)
    return success_response(data=updated, message="footer updated successfully")
