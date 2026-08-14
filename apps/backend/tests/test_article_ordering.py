"""Ordering checks for app/services/article_service.py.

This script stubs the repository boundary so it can run without MongoDB.

    python tests/test_article_ordering.py
"""

import asyncio
import types
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


if "bson" not in sys.modules:
    bson_stub = types.ModuleType("bson")

    class ObjectId:  # noqa: D401 - tiny stub for import-time compatibility.
        pass

    bson_stub.ObjectId = ObjectId
    sys.modules["bson"] = bson_stub

if "app.database" not in sys.modules:
    database_stub = types.ModuleType("app.database")
    database_stub.db = types.SimpleNamespace(db={})
    sys.modules["app.database"] = database_stub

from app.services import article_service


class FakeCursor:
    def __init__(self, docs):
        self.docs = docs

    async def to_list(self, length=None):
        if length is None:
            return [dict(doc) for doc in self.docs]
        return [dict(doc) for doc in self.docs[:length]]


class FakeCollection:
    def __init__(self, docs):
        self.docs = [dict(doc) for doc in docs]

    def find(self, query):
        def matches(doc):
            for key, value in query.items():
                if doc.get(key) != value:
                    return False
            return True

        return FakeCursor([doc for doc in self.docs if matches(doc)])


class FakeRepo:
    def __init__(self, docs):
        self.collection = FakeCollection(docs)


def make_article(slug, publish_date, *, display_order=None, featured=False, status="published"):
    return {
        "id": slug,
        "slug": slug,
        "title": slug.replace("-", " ").title(),
        "subtitle": slug,
        "category": "Lifestyle",
        "author": "Editor",
        "author_image": "",
        "author_role": "Editor",
        "hero_image": "",
        "cover_image": "",
        "reading_time": "5 Min Read",
        "publish_date": publish_date,
        "featured": featured,
        "display_order": display_order,
        "status": status,
        "is_active": True,
    }


failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


async def run_listing(docs, *, featured_only=False, summary=False):
    article_service.repo = FakeRepo(docs)
    items = await article_service.get_all(featured_only=featured_only, summary=summary)
    return [item["slug"] for item in items]


async def main():
    auto_articles = [
        make_article("aug-13", "2026-08-13"),
        make_article("aug-10", "2026-08-10"),
        make_article("aug-06", "2026-08-06"),
        make_article("aug-02", "2026-08-02"),
    ]

    check(
        "existing auto-ordered articles are newest first",
        (auto_ordered := await run_listing(auto_articles)) == [
            "aug-13",
            "aug-10",
            "aug-06",
            "aug-02",
        ],
        auto_ordered,
    )

    new_auto_articles = auto_articles + [make_article("aug-14", "2026-08-14")]
    new_auto_ordered = await run_listing(new_auto_articles)
    check(
        "new auto-published article appears first",
        new_auto_ordered[0] == "aug-14",
        new_auto_ordered,
    )

    manual_and_auto = [
        make_article("manual-one", "2026-07-01", display_order=1),
        make_article("manual-two", "2026-07-02", display_order=2),
        make_article("auto-new", "2026-08-14"),
        make_article("auto-old", "2026-08-01"),
    ]
    manual_and_auto_ordered = await run_listing(manual_and_auto)
    check(
        "manual display order takes precedence over date",
        manual_and_auto_ordered == [
            "manual-one",
            "manual-two",
            "auto-new",
            "auto-old",
        ],
        manual_and_auto_ordered,
    )

    changed_manual = [
        make_article("manual-one", "2026-07-01", display_order=3),
        make_article("manual-two", "2026-07-02", display_order=1),
        make_article("auto-new", "2026-08-14"),
    ]
    changed_manual_ordered = await run_listing(changed_manual)
    check(
        "changing manual order immediately changes position",
        changed_manual_ordered == ["manual-two", "manual-one", "auto-new"],
        changed_manual_ordered,
    )

    fallback_auto = [
        make_article("manual-now-auto", "2026-07-01", display_order=None),
        make_article("newer-auto", "2026-08-14"),
        make_article("older-auto", "2026-08-01"),
    ]
    fallback_auto_ordered = await run_listing(fallback_auto)
    check(
        "clearing manual order falls back to publish date",
        fallback_auto_ordered == ["newer-auto", "older-auto", "manual-now-auto"],
        fallback_auto_ordered,
    )

    featured_articles = [
        make_article("featured-manual", "2026-07-01", display_order=2, featured=True),
        make_article("featured-auto", "2026-08-14", featured=True),
        make_article("not-featured", "2026-08-15", featured=False),
    ]
    featured_ordered = await run_listing(featured_articles, featured_only=True)
    check(
        "featured-only listing preserves the same ordering rule",
        featured_ordered == [
            "featured-manual",
            "featured-auto",
        ],
        featured_ordered,
    )

    # Summary mode should still honor the same backend order.
    summary_ordered = await run_listing(manual_and_auto, summary=True)
    check(
        "summary lists use the same ordering",
        summary_ordered == ["manual-one", "manual-two", "auto-new", "auto-old"],
        summary_ordered,
    )

    print("\nAll article ordering tests passed." if not failures else f"\n{failures} test(s) failed.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))