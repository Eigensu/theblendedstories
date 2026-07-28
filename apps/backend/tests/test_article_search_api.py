"""HTTP tests for GET /articles/search using FastAPI's TestClient.

The database layer is stubbed, so this needs neither MongoDB nor a running
server. It exercises the real router, including route ordering.

    python tests/test_article_search_api.py
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# app.config requires these; the values are irrelevant here.
os.environ.setdefault("ADMIN_PASSWORD", "x" * 12)
os.environ.setdefault("SECRET_KEY", "y" * 32)

from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.exceptions import RequestValidationError

from app.routers import articles
from app.services import article_service, article_search
from app.utils.exceptions import validation_exception_handler

ARTICLES = [
    {
        "id": "1", "slug": "the-linen-edit", "title": "The Linen Edit",
        "subtitle": "Summer fabrics worth the crease", "category": "Fashion",
        "author": "Anita Rao", "author_role": "Fashion Editor",
        "reading_time": "5 MIN READ", "cover_image": "https://img/1.jpg",
        "status": "published", "publish_date": "2026-06-01",
        "contentBlocks": [
            {"type": "text", "content": "Linen returned to the wardrobe this season."}
        ],
    },
    {
        "id": "2", "slug": "where-to-go-next", "title": "Where To Go Next",
        "subtitle": "Five hotels for a long weekend", "category": "Travel",
        "author": "Karan Mehta", "author_role": "Travel Writer",
        "reading_time": "4 MIN READ", "cover_image": "https://img/2.jpg",
        "status": "published", "publish_date": "2026-07-01",
        "contentBlocks": [{"type": "text", "content": "Suites dressed in crisp linen."}],
    },
    {
        "id": "3", "slug": "secret-draft", "title": "Unreleased Linen Story",
        "category": "Fashion", "author": "Ghost", "status": "draft",
        "publish_date": "2026-07-20",
        "contentBlocks": [{"type": "text", "content": "linen"}],
    },
]


async def fake_repo_get_all(query: dict | None = None):
    return [dict(article) for article in ARTICLES]


# Stub at the repository boundary rather than the service. The router imported
# get_all/get_by_slug into its own namespace, so patching the service module would
# not affect the routes anyway — and going one level lower means the real
# normalization and summary projection are exercised rather than mocked away.
article_service.repo.get_all = fake_repo_get_all
article_search.invalidate_cache()

app = FastAPI()
# Mirror main.py: validation errors are remapped to 400 app-wide, so the status
# codes asserted below match what the deployed API actually returns.
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.include_router(articles.router)

client = TestClient(app)

failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


response = client.get("/articles/search", params={"q": "linen"})
check("200 OK", response.status_code == 200, response.status_code)

payload = response.json()
check("success envelope", payload.get("success") is True)

data = payload["data"]
check("returns both published matches", len(data) == 2, len(data))
check("title match ranks first", data[0]["slug"] == "the-linen-edit",
      [d["slug"] for d in data])
check("draft not leaked", all(d["slug"] != "secret-draft" for d in data))
check("carries an excerpt", bool(data[0]["excerpt"]))
check("carries matched terms", data[0]["matched_terms"] == ["linen"],
      data[0]["matched_terms"])
check("omits contentBlocks", "contentBlocks" not in data[0])

response = client.get("/articles/search", params={"q": ""})
check("empty query returns an empty list",
      response.status_code == 200 and response.json()["data"] == [])

response = client.get("/articles/search", params={"q": "karan"})
check("author search works", response.json()["data"][0]["slug"] == "where-to-go-next")

response = client.get("/articles/search", params={"q": "lin"})
check("prefix search works", len(response.json()["data"]) == 2)

response = client.get("/articles/search", params={"q": "linen", "limit": 1})
check("limit is honoured", len(response.json()["data"]) == 1)

response = client.get("/articles/search", params={"q": "linen", "limit": 999})
check("limit above the cap is rejected with 400", response.status_code == 400,
      response.status_code)

response = client.get("/articles/search", params={"q": "linen", "limit": 0})
check("limit below the floor is rejected with 400", response.status_code == 400,
      response.status_code)

# Regression guard: /articles/search must be declared above /articles/{slug}, or
# the slug route swallows it and answers 404 "Article not found".
response = client.get("/articles/search")
check("bare /search is not matched as a slug",
      response.status_code == 200 and "detail" not in response.json(),
      response.status_code)

response = client.get("/articles/the-linen-edit")
check("slug lookup still resolves", response.status_code == 200, response.status_code)

# The article page and the archive read these off the summary list. Dropping any
# of them from _SUMMARY_FIELDS breaks prev/next, recommendations or the cards,
# and it fails silently at render rather than here.
LISTING_FIELDS = {
    "id", "slug", "title", "subtitle", "category", "cover_image",
    "hero_image", "reading_time", "publish_date", "display_order", "status",
}

response = client.get("/articles/", params={"summary": "true"})
check("summary list returns 200", response.status_code == 200, response.status_code)

summaries = response.json()["data"]
check("summary list is not empty", len(summaries) > 0)
check("summary omits article bodies",
      all("contentBlocks" not in item for item in summaries))
check("summary keeps every field the listings render",
      LISTING_FIELDS.issubset(summaries[0].keys()),
      sorted(LISTING_FIELDS - set(summaries[0].keys())) or "all present")

response = client.get("/articles/")
check("unsummarised list still carries bodies",
      "contentBlocks" in response.json()["data"][0])

print("\nAll search API tests passed." if not failures else f"\n{failures} test(s) failed.")
sys.exit(1 if failures else 0)
