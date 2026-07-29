from datetime import datetime
from typing import Optional, Dict, Any, List
from bson import ObjectId
from app.database import db

class BaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def collection(self):
        return db.db[self.collection_name]

    def _format_doc(self, doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if doc and "_id" in doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    async def get_singleton(self) -> Optional[Dict[str, Any]]:
        # Used for collections like 'hero', 'footer' that only have 1 document
        return self._format_doc(await self.collection.find_one({"is_active": True}))

    async def update_singleton(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data["updated_at"] = datetime.utcnow()
        if "created_at" not in data or not data["created_at"]:
            data["created_at"] = datetime.utcnow()
            
        result = await self.collection.update_one(
            {"is_active": True},
            {"$set": data},
            upsert=True
        )
        return await self.get_singleton()

    async def get_all(self, query: dict = None) -> List[Dict[str, Any]]:
        if query is None:
            query = {}
        query["is_active"] = True
        cursor = self.collection.find(query).sort("display_order", 1)
        docs = await cursor.to_list(length=None)
        return [self._format_doc(doc) for doc in docs]

    async def get_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        return self._format_doc(await self.collection.find_one({"_id": ObjectId(id), "is_active": True}))

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["is_active"] = True
        result = await self.collection.insert_one(data)
        return await self.get_by_id(str(result.inserted_id))

    async def update(self, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        data["updated_at"] = datetime.utcnow()
        await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data}
        )
        return await self.get_by_id(id)

    async def delete_soft(self, id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def count_documents(self) -> int:
        return await self.collection.count_documents({"is_active": True})

    # --- Generic queries -------------------------------------------------
    # The methods above assume the CMS shape: one document per section, ordered
    # by display_order. Capture collections (waitlist entries, subscribers) are
    # ordered by when they arrived instead, which these cover without every such
    # service reaching past this class into Motor.

    async def find_one_by(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return self._format_doc(await self.collection.find_one({**query, "is_active": True}))

    async def find_many(
        self,
        query: Optional[Dict[str, Any]] = None,
        sort_field: str = "created_at",
        descending: bool = True,
    ) -> List[Dict[str, Any]]:
        cursor = self.collection.find({**(query or {}), "is_active": True}).sort(
            sort_field, -1 if descending else 1
        )
        docs = await cursor.to_list(length=None)
        return [self._format_doc(doc) for doc in docs]
