from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import SettingsModel

repo = BaseRepository("settings")

async def get_data():
    data = await repo.get_singleton()
    return data if data else SettingsModel().dict(exclude={"id"})

async def update_data(payload: SettingsModel):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
