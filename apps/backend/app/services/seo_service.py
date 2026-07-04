from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import SEOModel

repo = BaseRepository("seo")

async def get_data():
    data = await repo.get_singleton()
    return data if data else SEOModel().dict(exclude={"id"})

async def update_data(payload: SEOModel):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
