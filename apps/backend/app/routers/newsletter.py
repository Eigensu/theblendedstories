from fastapi import APIRouter, Depends

from app.auth import get_current_admin
from app.schemas.member import SubscribeRequest
from app.services import newsletter_service
from app.utils.responses import success_response

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe")
async def subscribe(payload: SubscribeRequest):
    """Public email-only signup, used by the site-wide newsletter popup.

    Deliberately returns success for an address that is already on the list.
    Reporting "you are already subscribed" would confirm to anyone who asks
    whether a given email is in the database.
    """
    await newsletter_service.subscribe(payload.email, source="popup", name=payload.name)
    return success_response(message="Subscribed successfully")


@router.get("/subscribers", dependencies=[Depends(get_current_admin)])
async def list_subscribers():
    return success_response(data=await newsletter_service.list_subscribers())


@router.post("/unsubscribe", dependencies=[Depends(get_current_admin)])
async def unsubscribe(payload: SubscribeRequest):
    """Admin-only for now. A public one-click link needs a signed token so that
    knowing an address isn't enough to unsubscribe someone else."""
    await newsletter_service.unsubscribe(payload.email)
    return success_response(message="Unsubscribed successfully")
