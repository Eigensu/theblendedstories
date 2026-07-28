"""Unit tests for the article search scoring in app/services/article_search.py.

No database and no running server — `search()` takes the article fetcher as an
argument, so the corpus is supplied inline.

    python tests/test_article_search.py
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services import article_search as search_module

ARTICLES = [
    {
        "id": "1",
        "slug": "the-linen-edit",
        "title": "The Linen Edit",
        "subtitle": "Summer fabrics worth the crease",
        "category": "Fashion",
        "author": "Anita Rao",
        "author_role": "Fashion Editor",
        "status": "published",
        "publish_date": "2026-06-01",
        "contentBlocks": [
            {
                "type": "text",
                "content": "Linen has returned to the wardrobe this season. "
                           "Designers in Milan leaned hard into it.",
            },
            {"type": "quote", "quote": "Nothing beats linen in July.", "author": "Masaba"},
        ],
    },
    {
        "id": "2",
        "slug": "where-to-go-next",
        "title": "Where To Go Next",
        "subtitle": "Five hotels for a long weekend",
        "category": "Travel",
        "author": "Karan Mehta",
        "author_role": "Travel Writer",
        "status": "published",
        "publish_date": "2026-07-01",
        "contentBlocks": [
            {
                "type": "text",
                "content": "The suites are dressed in crisp linen and the pool "
                           "faces west toward the hills.",
            }
        ],
    },
    {
        "id": "3",
        "slug": "secret-draft",
        "title": "Unreleased Linen Story",
        "subtitle": "Draft",
        "category": "Fashion",
        "author": "Ghost",
        "status": "draft",
        "publish_date": "2026-07-20",
        "contentBlocks": [{"type": "text", "content": "linen linen linen"}],
    },
]

failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


async def main():
    async def fetch():
        return ARTICLES

    async def run(query, **kwargs):
        # The index is cached for 60s; clear it so each case starts clean.
        search_module.invalidate_cache()
        return await search_module.search(query, fetch, **kwargs)

    results = await run("linen")
    slugs = [r["slug"] for r in results]
    check("title match ranks first", results and results[0]["slug"] == "the-linen-edit", slugs)
    check("draft excluded", "secret-draft" not in slugs, slugs)
    check("body-only match included", "where-to-go-next" in slugs, slugs)
    check("no contentBlocks in payload", "contentBlocks" not in results[0])

    body_hit = next(r for r in results if r["slug"] == "where-to-go-next")
    check("body hit carries an excerpt", bool(body_hit["excerpt"]), repr(body_hit["excerpt"]))

    # A title match should fall back to the subtitle in the UI, so the excerpt is
    # deliberately empty rather than showing unrelated opening prose.
    title_hit = next(r for r in results if r["slug"] == "the-linen-edit")
    check("title hit excerpt comes from the body it matched", bool(title_hit["excerpt"]))

    check("prefix match works", "the-linen-edit" in [r["slug"] for r in await run("lin")])

    results = await run("linen hotels")
    check(
        "multi-token AND narrows to the full match",
        results and results[0]["slug"] == "where-to-go-next",
        [r["slug"] for r in results],
    )

    check("OR fallback when AND matches nothing", len(await run("linen zzzznomatch")) > 0)

    check("empty query returns nothing", await run("") == [])
    check("single character returns nothing", await run("a") == [])
    check("unmatched query returns nothing", await run("qqqqzzz") == [])

    check("category is searchable", "the-linen-edit" in [r["slug"] for r in await run("fashion")])

    results = await run("karan")
    check("author is searchable", results and results[0]["slug"] == "where-to-go-next")

    check("quote attribution is searchable",
          "the-linen-edit" in [r["slug"] for r in await run("Masaba")])

    check("limit is respected", len(await run("linen", limit=1)) == 1)

    # Body hits are capped per token, so length alone must not beat a title match.
    spam = {
        "id": "4", "slug": "spam", "title": "Unrelated", "subtitle": "",
        "category": "Travel", "author": "X", "status": "published",
        "publish_date": "2026-01-01",
        "contentBlocks": [{"type": "text", "content": "linen " * 50}],
    }

    async def fetch_with_spam():
        return [ARTICLES[0], spam]

    search_module.invalidate_cache()
    results = await search_module.search("linen", fetch_with_spam)
    check(
        "body-hit cap keeps a title match on top",
        results[0]["slug"] == "the-linen-edit",
        [(r["slug"], r["score"]) for r in results],
    )

    print("\nAll search unit tests passed." if not failures
          else f"\n{failures} test(s) failed.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
