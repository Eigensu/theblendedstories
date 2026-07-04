from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import TBSNightsModel

repo = BaseRepository("tbs_nights")

async def get_data():
    data = await repo.get_singleton()
    return data if data else TBSNightsModel().dict(exclude={"id"})

async def update_data(payload: TBSNightsModel):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
