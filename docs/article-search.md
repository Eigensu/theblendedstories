# Article search

Keyword search across the article archive, reachable from every public page.

## How it behaves

A magnifier icon sits at the top right of every public route. Clicking it — or
pressing `Cmd/Ctrl + K`, or `/` — opens a full-screen overlay that searches as you
type. Results link straight to `/stories/<slug>`.

| Key | Action |
|---|---|
| `Cmd/Ctrl + K` | Open search from anywhere |
| `/` | Open search (ignored while typing in a field) |
| `↑` `↓` | Move through results |
| `Enter` | Open the highlighted result |
| `Esc` | Close and restore scroll |

Searching matches on title, subtitle, category, author, SEO description, editorial
note, and the **full body text** — content blocks, pull quotes, quote attributions,
and gallery captions.

## Architecture

```
SiteSearch.tsx  ──trigger + shortcuts──▶  SearchOverlay.tsx
                                               │ debounced fetch (250ms)
                                               ▼
                                  GET /articles/search?q=&limit=
                                               │
                                    article_service.search()
                                               │
                                    article_search.search()
                                               │
                                   cached index over articles
```

| File | Role |
|---|---|
| `apps/backend/app/services/article_search.py` | Index building, scoring, excerpts |
| `apps/backend/app/services/article_service.py` | `search()` wrapper, cache invalidation |
| `apps/backend/app/routers/articles.py` | `GET /articles/search` |
| `apps/frontend/src/components/search/SearchOverlay.tsx` | Overlay UI, fetching, keyboard |
| `apps/frontend/src/components/search/SiteSearch.tsx` | Trigger button, global shortcuts |
| `apps/frontend/src/app/(public)/layout.tsx` | Mounts search on all public routes |

## The endpoint

```
GET /articles/search?q=<query>&limit=<1..50>
```

`limit` defaults to 20. A query shorter than 2 characters returns an empty list
without touching the database. An out-of-range `limit` returns **400** — the app
remaps validation errors app-wide in `validation_exception_handler`.

```json
{
  "success": true,
  "data": [
    {
      "id": "6a67953abdc6b8b17317d1ce",
      "slug": "the-linen-edit",
      "title": "The Linen Edit",
      "subtitle": "Summer fabrics worth the crease",
      "category": "Fashion",
      "author": "Anita Rao",
      "reading_time": "5 MIN READ",
      "publish_date": "JUN 01, 2026",
      "cover_image": "https://…",
      "hero_image": "https://…",
      "excerpt": "…crisp linen and the pool faces west…",
      "matched_terms": ["linen"],
      "score": 12.0
    }
  ]
}
```

`contentBlocks` is deliberately omitted — the response is refetched on every
keystroke and full article bodies would make it far too large.

## Scoring

Each article is flattened into weighted buckets of tokens:

| Field | Weight |
|---|---|
| Title | 10 |
| Subtitle | 6 |
| Category | 5 |
| Author, author role | 4 |
| SEO description, editorial note | 3 |
| Body text | 1 |

Rules on top of the weights:

- **Prefix matches count at 0.6×.** Typing `lin` finds *Linen*, which is what makes
  type-ahead usable.
- **Body hits are capped at 3 per token.** Without this, a long article mentioning a
  word in passing outranks an article with it in the title. The cap is what keeps
  ranking intuitive — see the `body-hit cap` case in `test_article_search.py`.
- **All tokens must match (AND).** If that returns nothing, it falls back to ranking
  articles matching *any* token, scaled by how many matched, so one mistyped word
  does not wipe out good results.
- **Drafts are excluded.** Only `status == "published"` is indexed.
- Ties break on `publish_date`, newest first.

### Excerpts

When a query matches inside the body, the result carries a ~160-character snippet
centred on the first hit, so you can see *why* it matched.

When the match is in the title or category, `excerpt` comes back **empty on
purpose** — the opening line of the story has nothing to do with the query, and the
UI shows the subtitle instead, which does contain the matched term.

## Caching

The index is built from `get_all()` and cached for 60 seconds, so typing does not
re-read the collection on every keystroke. `article_service` clears it on every
write — `create`, `update`, `patch_fields`, and `delete` — so edits made in the
admin appear in search immediately rather than up to a minute later.

## Route ordering

`GET /articles/search` **must stay declared above `GET /articles/{slug}`** in
`routers/articles.py`.

FastAPI matches in declaration order and `/{slug}` is a single-segment match, so if
search drops below it the slug handler captures `/articles/search` and the endpoint
returns `404 Article not found`. `tests/test_article_routes.py` guards this.

## Scale

The corpus is tens of articles, where in-memory scoring is faster than a round trip
to a search index and supports prefix matching that a Mongo `$text` index does not.

If the archive grows into the thousands, replace the body of
`article_search.search()` with a Mongo text index or Atlas Search. Callers only
touch `search()` and `invalidate_cache()`, so the swap does not reach outside that
module.

## Known gaps

- No typo tolerance. `lnien` finds nothing; prefix matching only helps from the
  start of a word.
- No result highlighting inside the destination article.
- Results are not shareable — search state lives in the overlay, not the URL. A
  `/stories?q=` route would make results linkable and crawlable.
- The overlay has not been verified on a real mobile device.

## Tests

See `apps/backend/tests/README.md`. The three that need no setup:

```bash
cd apps/backend
python tests/test_article_search.py
python tests/test_article_search_api.py
python tests/test_article_routes.py
```
