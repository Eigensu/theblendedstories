import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "the_blended_stories")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    collections = [
        "hero",
        "what_is_tbs",
        "tbs_nights",
        "what_we_cover",
        "the_edit",
        "tbs_talks"
    ]
    
    print("--- DOCUMENT COUNTS ---")
    for coll in collections:
        count = await db[coll].count_documents({})
        print(f"db.{coll}.countDocuments(): {count}")
        
    print("\n--- FIRST DOCUMENTS ---")
    for coll in collections:
        doc = await db[coll].find_one()
        # Convert ObjectId to string for printing
        if doc and "_id" in doc:
            doc["_id"] = str(doc["_id"])
        print(f"db.{coll}.findOne(): {doc}")

if __name__ == "__main__":
    asyncio.run(main())
