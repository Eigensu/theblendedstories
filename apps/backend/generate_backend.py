import os

SECTIONS = [
    ("hero", "HeroModel", "singleton"),
    ("what_is_tbs", "WhatIsTBSModel", "singleton"),
    ("footer", "FooterModel", "singleton"),
    ("seo", "SEOModel", "singleton"),
    ("settings", "SettingsModel", "singleton"),
    ("what_we_cover", "WhatWeCoverSlide", "array"),
    ("tbs_nights", "TBSNightsModel", "singleton"),
    ("the_edit", "ArticleModel", "array"),
    ("tbs_talks", "SpeakerModel", "array")
]

SERVICE_TEMPLATE_SINGLETON = """from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import {model_name}

repo = BaseRepository("{collection_name}")

async def get_data():
    data = await repo.get_singleton()
    return data if data else {model_name}().dict(exclude={{"id"}})

async def update_data(payload: {model_name}):
    return await repo.update_singleton(payload.dict(exclude_unset=True))
"""

SERVICE_TEMPLATE_ARRAY = """from app.repositories.base_repo import BaseRepository
from app.schemas.cms_schemas import {model_name}

repo = BaseRepository("{collection_name}")

async def get_all():
    return await repo.get_all()

async def get_by_id(item_id: str):
    return await repo.get_by_id(item_id)

async def create(payload: {model_name}):
    return await repo.create(payload.dict(exclude_unset=True, exclude={{"id"}}))

async def update(item_id: str, payload: {model_name}):
    return await repo.update(item_id, payload.dict(exclude_unset=True, exclude={{"id"}}))

async def delete(item_id: str):
    return await repo.delete_soft(item_id)
"""

ROUTER_TEMPLATE_SINGLETON = """from fastapi import APIRouter, Depends
from app.schemas.cms_schemas import {model_name}
from app.services.{collection_name}_service import get_data, update_data
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/{url_prefix}", tags=["{collection_name}"])

@router.get("/")
async def get_content():
    data = await get_data()
    return success_response(data=data)

@router.put("/", dependencies=[Depends(get_current_admin)])
async def update_content(payload: {model_name}):
    updated = await update_data(payload)
    return success_response(data=updated, message="{collection_name} updated successfully")
"""

ROUTER_TEMPLATE_ARRAY = """from fastapi import APIRouter, Depends
from app.schemas.cms_schemas import {model_name}
from app.services.{collection_name}_service import get_all, get_by_id, create, update, delete
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/{url_prefix}", tags=["{collection_name}"])

@router.get("/")
async def list_items():
    items = await get_all()
    return success_response(data=items)

@router.get("/{{{item_id}}}")
async def get_item(item_id: str):
    item = await get_by_id(item_id)
    return success_response(data=item)

@router.post("/", dependencies=[Depends(get_current_admin)])
async def create_item(payload: {model_name}):
    created = await create(payload)
    return success_response(data=created, message="Created successfully")

@router.put("/{{{item_id}}}", dependencies=[Depends(get_current_admin)])
async def update_item(item_id: str, payload: {model_name}):
    updated = await update(item_id, payload)
    return success_response(data=updated, message="Updated successfully")

@router.delete("/{{{item_id}}}", dependencies=[Depends(get_current_admin)])
async def delete_item(item_id: str):
    await delete(item_id)
    return success_response(message="Deleted successfully")
"""

def generate():
    base_dir = "app"
    os.makedirs(f"{base_dir}/services", exist_ok=True)
    os.makedirs(f"{base_dir}/routers", exist_ok=True)
    
    for collection_name, model_name, type_ in SECTIONS:
        # Service
        service_path = f"{base_dir}/services/{collection_name}_service.py"
        if type_ == "singleton":
            service_content = SERVICE_TEMPLATE_SINGLETON.replace("{collection_name}", collection_name).replace("{model_name}", model_name)
        else:
            service_content = SERVICE_TEMPLATE_ARRAY.replace("{collection_name}", collection_name).replace("{model_name}", model_name)
        with open(service_path, "w") as f:
            f.write(service_content)
            
        # Router
        router_path = f"{base_dir}/routers/{collection_name}.py"
        url_prefix = collection_name.replace("_", "-")
        if type_ == "singleton":
            router_content = ROUTER_TEMPLATE_SINGLETON.replace("{collection_name}", collection_name).replace("{model_name}", model_name).replace("{url_prefix}", url_prefix)
        else:
            router_content = ROUTER_TEMPLATE_ARRAY.replace("{collection_name}", collection_name).replace("{model_name}", model_name).replace("{url_prefix}", url_prefix)
        with open(router_path, "w") as f:
            f.write(router_content)
            
if __name__ == "__main__":
    generate()
    print("Generated services and routers")
