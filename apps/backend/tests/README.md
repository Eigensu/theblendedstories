# Backend tests

Plain scripts — no pytest. Each exits non-zero on failure, so they work in CI as-is.
Run them from `apps/backend`.

## No setup required

These stub the database and construct the app in-process. Nothing to start.

```bash
python tests/test_article_search.py       # search scoring and ranking
python tests/test_article_search_api.py   # GET /articles/search over HTTP
python tests/test_article_routes.py       # article route declaration order
```

`test_article_routes.py` is the guard for a specific trap: FastAPI matches routes in
declaration order, and `/articles/{slug}` is a single-segment match. If
`/articles/search` is ever moved below it, the slug handler swallows the path and
search starts returning `404 Article not found`. Keep this test green.

## Requires a running server

```bash
export ADMIN_USERNAME=admin ADMIN_PASSWORD=... BASE_URL=http://localhost:8000
python tests/test_api.py       # full CMS smoke test, including search (section 8)
python tests/test_errors.py    # article validation error paths
```

`test_api.py` mutates data — it writes to `hero` and creates then deletes a
`what_we_cover` slide. Point it at a local or staging database, never production.

`test_errors.py` has credentials hardcoded at the top; edit them to match your
local admin before running.

## Seeding sample data locally

```bash
python tests/seed_local_articles.py
```

Loads the ten sample articles from `articles_data_10.json` into
`the_blended_stories.articles` on `mongodb://localhost:27017`, marking the last one
as a draft so you can verify drafts stay out of search results.

This **wipes the articles collection** before inserting, and refuses to run against
any URI that is not localhost.

## Running everything that needs no setup

```bash
for t in tests/test_article_search.py tests/test_article_search_api.py tests/test_article_routes.py; do
  python "$t" || exit 1
done
```
