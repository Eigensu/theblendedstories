from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.config import settings
from app.schemas.the_edit import TheEditModel
from app.database import db

class TheEditService:
    def __init__(self):
        # We need async methods actually since db.db is a motor client
        pass

    async def get_all(self) -> List[dict]:
        items = []
        cursor = db.db["the-edit"].find().sort("display_order", 1)
        async for item in cursor:
            item["id"] = str(item.pop("_id"))
            items.append(item)
        return items

    async def create(self, item: TheEditModel) -> dict:
        item_dict = item.model_dump(exclude={"id"})
        item_dict["created_at"] = datetime.utcnow()
        item_dict["updated_at"] = item_dict["created_at"]
        result = await db.db["the-edit"].insert_one(item_dict)
        item_dict["id"] = str(result.inserted_id)
        return item_dict

    async def update(self, item_id: str, item: TheEditModel) -> Optional[dict]:
        item_dict = item.model_dump(exclude={"id", "created_at"})
        item_dict["updated_at"] = datetime.utcnow()
        result = await db.db["the-edit"].update_one(
            {"_id": ObjectId(item_id)},
            {"$set": item_dict}
        )
        if result.modified_count:
            return await self.get_by_id(item_id)
        return None

    async def get_by_id(self, item_id: str) -> Optional[dict]:
        item = await db.db["the-edit"].find_one({"_id": ObjectId(item_id)})
        if item:
            item["id"] = str(item.pop("_id"))
            return item
        return None

    async def delete(self, item_id: str) -> bool:
        result = await db.db["the-edit"].delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count > 0
