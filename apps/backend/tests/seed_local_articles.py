"""Seed a LOCAL MongoDB with the repo's sample articles, for manual testing.

Maps articles_data_10.json into the ArticleModel shape and marks the last entry
as a draft, so you can confirm drafts stay out of search results.

Refuses to run against anything that is not localhost — this wipes the articles
collection before inserting.

    python tests/seed_local_articles.py
"""

import json
import sys
import uuid
from datetime import datetime
from pathlib import Path

from pymongo import MongoClient

REPO_ROOT = Path(__file__).resolve().parents[3]
SAMPLE_DATA = REPO_ROOT / "articles_data_10.json"

URI = "mongodb://localhost:27017"
DB_NAME = "the_blended_stories"

if "localhost" not in URI and "127.0.0.1" not in URI:
    print("Refusing to seed a non-local database.")
    sys.exit(1)

if not SAMPLE_DATA.exists():
    print(f"Sample data not found at {SAMPLE_DATA}")
    sys.exit(1)

client = MongoClient(URI, serverSelectionTimeoutMS=3000)
collection = client[DB_NAME]["articles"]

raw = json.loads(SAMPLE_DATA.read_text())

collection.delete_many({})

documents = []
for index, article in enumerate(raw):
    blocks = [
        {"id": str(uuid.uuid4()), "type": "text", "content": paragraph}
        for paragraph in (article.get("content") or [])
        if paragraph.strip()
    ]
    if article.get("quote"):
        blocks.insert(
            min(2, len(blocks)),
            {
                "id": str(uuid.uuid4()),
                "type": "quote",
                "quote": article["quote"],
                "author": article.get("author", ""),
            },
        )

    documents.append({
        "title": article["title"],
        "slug": article["slug"],
        "subtitle": article.get("description", ""),
        "category": article.get("category", ""),
        "author": article.get("author", ""),
        "author_image": article.get("authorImage", ""),
        "author_role": article.get("subcategory", ""),
        "hero_image": article.get("heroImage", ""),
        "cover_image": article.get("heroImage", ""),
        "reading_time": article.get("readingTime", ""),
        "publish_date": article.get("date", ""),
        "contentBlocks": blocks,
        "pull_quote": article.get("quote", ""),
        "quote_author": article.get("author", ""),
        "editorial_note": article.get("editorNote", ""),
        "gallery": [{"image": image, "caption": ""}
                    for image in article.get("galleryImages", [])],
        "related_articles": article.get("relatedArticles", []),
        "status": "draft" if index == len(raw) - 1 else "published",
        "featured": index < 4,
        "display_order": index + 1,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })

collection.insert_many(documents)

print(f"Seeded {collection.count_documents({})} articles into {DB_NAME}.articles")
print(f"  published: {collection.count_documents({'status': 'published'})}")
print(f"  draft:     {collection.count_documents({'status': 'draft'})}")
for document in collection.find({}, {"title": 1, "status": 1}):
    print(f"   [{document['status']:9}] {document['title']}")
