"""Guards the declaration order of the article routes.

FastAPI matches routes in declaration order. `/articles/{slug}` is a
single-segment match, so if `/articles/search` is ever moved below it the search
endpoint silently starts returning 404 "Article not found" instead of results.
This asserts both the ordering and the actual resolution through Starlette's
matcher.

    python tests/test_article_routes.py
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault("ADMIN_PASSWORD", "x" * 12)
os.environ.setdefault("SECRET_KEY", "y" * 32)

from starlette.routing import Match

from app.routers import articles

failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


routes = [(r.path, sorted(r.methods)[0], r.endpoint.__name__) for r in articles.router.routes]

print("Declared route order:")
for path, method, name in routes:
    print(f"  {method:6} {path:30} -> {name}")
print()

paths = [path for path, _, _ in routes]
search_index = paths.index("/articles/search")
slug_index = paths.index("/articles/{slug}")
check("/search is declared before /{slug}", search_index < slug_index,
      f"(search at {search_index}, slug at {slug_index})")


def resolve(path):
    scope = {
        "type": "http", "method": "GET", "path": path,
        "headers": [], "query_string": b"", "root_path": "",
    }
    for route in articles.router.routes:
        match, _ = route.matches(scope)
        if match == Match.FULL:
            return route.endpoint.__name__
    return None


check("GET /articles/search resolves to the search handler",
      resolve("/articles/search") == "search_articles", resolve("/articles/search"))
check("GET /articles/<slug> resolves to the slug handler",
      resolve("/articles/the-linen-edit") == "get_article_by_slug",
      resolve("/articles/the-linen-edit"))
check("GET /articles/id/<id> resolves to the id handler",
      resolve("/articles/id/abc123") == "get_article_by_id",
      resolve("/articles/id/abc123"))

print("\nAll route ordering tests passed." if not failures else f"\n{failures} test(s) failed.")
sys.exit(1 if failures else 0)
