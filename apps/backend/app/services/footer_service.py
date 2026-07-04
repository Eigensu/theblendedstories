from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import FooterModel

repo = BaseRepository("footer")

async def get_data():
    data = await repo.get_singleton()
    return data if data else FooterModel().dict(exclude={"id"})

async def update_data(payload: FooterModel):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
