import logging

from fastapi import APIRouter, Depends

from app.schemas.cms_schemas import TBSNightsModel
from app.schemas.tbs_nights_waitlist import WaitlistEntryCreate
from app.services.tbs_nights_service import get_data, update_data
from app.services import tbs_nights_waitlist_service, newsletter_service
from app.utils.responses import success_response
from app.auth import get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tbs-nights", tags=["tbs_nights"])

@router.get("/")
async def get_content():
    data = await get_data()
    return success_response(data=data)

@router.put("/", dependencies=[Depends(get_current_admin)])
async def update_content(payload: TBSNightsModel):
    updated = await update_data(payload)
    return success_response(data=updated, message="tbs_nights updated successfully")


@router.post("/waitlist")
async def submit_waitlist(payload: WaitlistEntryCreate):
    """Submit an application to the TBS Nights waitlist."""
    entry = await tbs_nights_waitlist_service.create_entry(payload.dict())

    if payload.updates:
        # The application is already stored. A newsletter provider hiccup must
        # not turn that into a 500, or the applicant sees a failure, resubmits,
        # and we get a duplicate entry for a submission that actually worked.
        try:
            await newsletter_service.subscribe(payload.email, source="tbs_nights")
        except Exception:
            logger.exception("Waitlist entry %s saved but newsletter subscribe failed", entry.get("id"))

    return success_response(
        data=entry,
        message="Application submitted successfully",
    )


@router.get("/waitlist", dependencies=[Depends(get_current_admin)])
async def list_waitlist():
    """List all TBS Nights waitlist entries (admin only)."""
    entries = await tbs_nights_waitlist_service.list_entries()
    return success_response(data=entries)
