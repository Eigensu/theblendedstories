from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import WhatIsTBSModel

repo = BaseRepository("what_is_tbs")

async def get_data():
    data = await repo.get_singleton()
    return data if data else WhatIsTBSModel().dict(exclude={"id"})

async def update_data(payload: WhatIsTBSModel):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
