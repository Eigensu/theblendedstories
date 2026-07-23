from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import SpeakerModel

repo = BaseRepository("tbs_talks")

async def get_all(featured_only: bool = False):
    items = await repo.get_all()
    if featured_only:
        items = [item for item in items if item.get("featured") is True]
    return items

async def get_by_id(item_id: str):
    return await repo.get_by_id(item_id)

async def create(payload: SpeakerModel):
    return await repo.create(payload.dict(exclude_unset=True, exclude={"id"}))

async def update(item_id: str, payload: SpeakerModel):
    return await repo.update(item_id, payload.dict(exclude_unset=True, exclude={"id"}))

async def patch_fields(item_id: str, fields: dict):
    return await repo.update(item_id, fields)

async def delete(item_id: str):
    return await repo.delete_soft(item_id)
