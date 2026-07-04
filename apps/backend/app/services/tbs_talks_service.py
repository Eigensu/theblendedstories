from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import SpeakerModel

repo = BaseRepository("tbs_talks")

async def get_all():
    return await repo.get_all()

async def get_by_id(item_id: str):
    return await repo.get_by_id(item_id)

async def create(payload: SpeakerModel):
    return await repo.create(payload.dict(exclude_unset=True, exclude={"id"}))

async def update(item_id: str, payload: SpeakerModel):
    return await repo.update(item_id, payload.dict(exclude_unset=True, exclude={"id"}))

async def delete(item_id: str):
    return await repo.delete_soft(item_id)
