import sys
from pymongo import MongoClient

uri = "mongodb+srv://aagamratadia_db_user:P3DA0WcLcfuPd7PT@tbs.ush9tej.mongodb.net/?appName=TBS"
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    sys.exit(1)

# Check the expected database
expected_db_name = "the_blended_stories"
db = client[expected_db_name]

print(f"\nDatabase name: {db.name}")
print(f"Collections: {db.list_collection_names()}")

cols = ["what_we_cover", "the_edit", "tbs_talks"]
for c in cols:
    coll = db[c]
    print(f"\n--- {c} ---")
    print("Total documents:", coll.count_documents({}))
    print("Where is_active == True:", coll.count_documents({"is_active": True}))
    print("Where is_active == False:", coll.count_documents({"is_active": False}))
    print("Where is_active is missing:", coll.count_documents({"is_active": {"$exists": False}}))
    
    docs = list(coll.find().limit(3))
    print("First 3 documents:")
    for d in docs:
        d["_id"] = str(d["_id"])
        print(d)

print("\n--- Checking 'test' database ---")
db_test = client["test"]
print("Collections in 'test':", db_test.list_collection_names())
for c in cols:
    if c in db_test.list_collection_names():
        coll = db_test[c]
        print(f"[{c}] Total:", coll.count_documents({}), "is_active:", coll.count_documents({"is_active": True}))

