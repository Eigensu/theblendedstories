"""Read-only inspection of a deployed database.

Takes its connection string from MONGODB_URI rather than embedding one. An
earlier version of this file hardcoded a production Atlas credential, which put
a live password in a public repository — never reintroduce one here. Point the
env var at whichever deployment you mean to inspect.

Read-only by construction: counts, find, and list_collection_names only.
"""

import os
import sys

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

uri = os.getenv("MONGODB_URI")
if not uri:
    print(
        "MONGODB_URI is not set. Export it or put it in apps/backend/.env — "
        "this script deliberately has no built-in connection string.",
        file=sys.stderr,
    )
    sys.exit(2)

db_name = os.getenv("MONGO_DB_NAME", "the_blended_stories")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    print("Connected to MongoDB.")
except Exception as exc:
    # The exception text can echo the URI back, credential included, so only the
    # type is printed here.
    print(f"Could not connect: {type(exc).__name__}", file=sys.stderr)
    sys.exit(1)

db = client[db_name]

print(f"\nDatabase name: {db.name}")
print(f"Collections: {db.list_collection_names()}")

cols = ["what_we_cover", "the_edit", "tbs_talks"]
for c in cols:
    coll = db[c]
    print(f"\n--- {c} ---")
    print("Total documents:", coll.count_documents({}))
    print("Where is_active == True:", coll.count_documents({"is_active": True}))
    print("Where is_active == False:", coll.count_documents({"is_active": False}))
    print(
        "Where is_active is missing:",
        coll.count_documents({"is_active": {"$exists": False}}),
    )

    docs = list(coll.find().limit(3))
    print("First 3 documents:")
    for d in docs:
        d["_id"] = str(d["_id"])
        print(d)

# Kept from the original: catches content written to the driver's default "test"
# database instead of the configured one.
print("\n--- Checking 'test' database ---")
db_test = client["test"]
test_collections = db_test.list_collection_names()
print("Collections in 'test':", test_collections)
for c in cols:
    if c in test_collections:
        coll = db_test[c]
        print(
            f"[{c}] Total:",
            coll.count_documents({}),
            "is_active:",
            coll.count_documents({"is_active": True}),
        )
