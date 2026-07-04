from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import ArticleModel

repo = BaseRepository("the_edit")

async def get_all():
    return await repo.get_all()

async def get_by_id(item_id: str):
    return await repo.get_by_id(item_id)

async def create(payload: ArticleModel):
    return await repo.create(payload.dict(exclude_unset=True, exclude={"id"}))

async def update(item_id: str, payload: ArticleModel):
    return await repo.update(item_id, payload.dict(exclude_unset=True, exclude={"id"}))

async def delete(item_id: str):
    return await repo.delete_soft(item_id)
