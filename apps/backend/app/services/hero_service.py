from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import HeroModel

repo = BaseRepository("hero")

async def get_data():
    data = await repo.get_singleton()
    return data if data else HeroModel().dict(exclude={"id"})

async def update_data(payload: HeroModel):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
