"""Keyword search over articles.

The corpus is small (tens of articles), so the index is built in memory from the
same records `article_service` already returns and kept behind a short TTL. If the
archive grows past a few thousand articles this should move to a Mongo text index
or Atlas Search — `search()` is the only function callers touch, so that swap does
not reach outside this module.
"""

import re
import time
from typing import Any, Callable, Coroutine

# Field weights. Body text is deliberately the lowest signal: a passing mention in
# a 3000-word story should never outrank a title match.
_TITLE_WEIGHT = 10.0
_SUBTITLE_WEIGHT = 6.0
_CATEGORY_WEIGHT = 5.0
_AUTHOR_WEIGHT = 4.0
_SUMMARY_WEIGHT = 3.0
_BODY_WEIGHT = 1.0

# A prefix hit ("lin" -> "linen") counts, but for less than a whole-word hit.
_PREFIX_RATIO = 0.6

# Cap how many times one token can score within body text, so length alone can't win.
_MAX_BODY_HITS_PER_TOKEN = 3

_EXCERPT_RADIUS = 80
_CACHE_TTL_SECONDS = 60

_MIN_QUERY_LENGTH = 2

_WORD_RE = re.compile(r"[a-z0-9]+")

# Cached index: (built_at, entries)
_cache: tuple[float, list[dict[str, Any]]] | None = None


def invalidate_cache() -> None:
    """Drop the cached index. Called after any article write."""
    global _cache
    _cache = None


def tokenize(text: str) -> list[str]:
    return _WORD_RE.findall(text.lower())


def _text_values(source: Any, keys: tuple[str, ...]) -> list[str]:
    """Non-empty string values for `keys`, or [] if `source` isn't a dict."""
    if not isinstance(source, dict):
        return []
    values = []
    for key in keys:
        value = source.get(key)
        if isinstance(value, str) and value.strip():
            values.append(value.strip())
    return values


def _collect_body_text(item: dict[str, Any]) -> str:
    """Flatten every piece of prose in an article into one searchable string."""
    parts: list[str] = []

    for block in item.get("contentBlocks") or []:
        parts.extend(_text_values(block, ("content", "quote", "author", "caption")))

    parts.extend(_text_values(item, ("pull_quote", "quote_author")))

    for entry in item.get("gallery") or []:
        parts.extend(_text_values(entry, ("caption",)))

    return "\n".join(parts)


def _build_entry(item: dict[str, Any]) -> dict[str, Any]:
    def field(name: str) -> str:
        value = item.get(name)
        return value.strip() if isinstance(value, str) else ""

    body_text = _collect_body_text(item)

    # Weighted buckets, each pre-tokenized so scoring is a set/count operation.
    weighted = [
        (_TITLE_WEIGHT, tokenize(field("title"))),
        (_SUBTITLE_WEIGHT, tokenize(field("subtitle"))),
        # Keywords sit in the category bucket: they are the same kind of signal, and
        # their slugs tokenize into the words an editor would actually search for
        # ("beauty-and-wellness" -> beauty, and, wellness).
        (
            _CATEGORY_WEIGHT,
            tokenize(
                f"{field('category')} {field('primary_keyword')} {field('sub_keyword')}"
            ),
        ),
        (_AUTHOR_WEIGHT, tokenize(f"{field('author')} {field('author_role')}")),
        (
            _SUMMARY_WEIGHT,
            tokenize(f"{field('seo_description')} {field('editorial_note')}"),
        ),
        (_BODY_WEIGHT, tokenize(body_text)),
    ]

    return {
        "item": item,
        "weighted": weighted,
        # Union of every token, used for the cheap "does this token appear at all" test.
        "all_tokens": {token for _, tokens in weighted for token in tokens},
        "body_text": body_text,
    }


def _token_score(token: str, weighted: list[tuple[float, list[str]]]) -> float:
    """Score one query token across all weighted fields of one article."""
    score = 0.0

    for weight, tokens in weighted:
        exact = 0
        prefix = 0
        for candidate in tokens:
            if candidate == token:
                exact += 1
            elif candidate.startswith(token):
                prefix += 1

        if not exact and not prefix:
            continue

        if weight == _BODY_WEIGHT:
            exact = min(exact, _MAX_BODY_HITS_PER_TOKEN)
            prefix = min(prefix, _MAX_BODY_HITS_PER_TOKEN)

        score += weight * exact + weight * _PREFIX_RATIO * prefix

    return score


def _token_matches(token: str, all_tokens: set[str]) -> bool:
    if token in all_tokens:
        return True
    return any(candidate.startswith(token) for candidate in all_tokens)


def _first_word_boundary_hit(lowered: str, token: str) -> int:
    """Index of the first occurrence of `token` that starts a word, else -1."""
    for match in re.finditer(re.escape(token), lowered):
        if match.start() == 0 or not lowered[match.start() - 1].isalnum():
            return match.start()
    return -1


def _snippet_bounds(body_text: str, hit_index: int) -> tuple[int, int]:
    """Window of `_EXCERPT_RADIUS` either side of the hit, snapped to word edges."""
    start = max(0, hit_index - _EXCERPT_RADIUS)
    end = min(len(body_text), hit_index + _EXCERPT_RADIUS)

    if start > 0:
        space = body_text.find(" ", start)
        if space != -1 and space < hit_index:
            start = space + 1

    if end < len(body_text):
        space = body_text.rfind(" ", hit_index, end)
        if space != -1:
            end = space

    return start, end


def _build_excerpt(body_text: str, tokens: list[str]) -> str:
    """Snippet of body text centred on the first matching token.

    Body matches are meaningless without context — this is what stops a hit deep in
    a story from looking like a random result.

    Returns "" when no token appears in the body. That is deliberate: for a title or
    category match, the opening line of the story is unrelated filler, and the caller
    shows the subtitle instead.
    """
    if not body_text:
        return ""

    lowered = body_text.lower()
    hit_index = -1
    for token in tokens:
        hit_index = _first_word_boundary_hit(lowered, token)
        if hit_index != -1:
            break

    if hit_index == -1:
        return ""

    start, end = _snippet_bounds(body_text, hit_index)
    snippet = body_text[start:end].strip().replace("\n", " ")
    prefix = "…" if start > 0 else ""
    suffix = "…" if end < len(body_text) else ""
    return f"{prefix}{snippet}{suffix}"


def _to_result(entry: dict[str, Any], score: float, tokens: list[str]) -> dict[str, Any]:
    """Trim to what the search UI renders. Full contentBlocks are never returned —
    the payload would balloon on every keystroke."""
    item = entry["item"]
    return {
        "id": item.get("id"),
        "slug": item.get("slug"),
        "title": item.get("title"),
        "subtitle": item.get("subtitle"),
        "category": item.get("category"),
        "author": item.get("author"),
        "reading_time": item.get("reading_time"),
        "publish_date": item.get("publish_date"),
        "cover_image": item.get("cover_image"),
        "hero_image": item.get("hero_image"),
        "excerpt": _build_excerpt(entry["body_text"], tokens),
        "matched_terms": tokens,
        "score": round(score, 3),
    }


async def _get_index(
    fetch_articles: Callable[[], Coroutine[Any, Any, list[dict[str, Any]]]],
) -> list[dict[str, Any]]:
    global _cache

    now = time.monotonic()
    if _cache is not None and now - _cache[0] < _CACHE_TTL_SECONDS:
        return _cache[1]

    items = await fetch_articles()
    # Drafts must never surface in public search.
    published = [item for item in items if item.get("status", "published") == "published"]
    entries = [_build_entry(item) for item in published]

    _cache = (now, entries)
    return entries


def _score_entry(entry: dict[str, Any], tokens: list[str]) -> tuple[float, int]:
    """Total score for one article, plus how many query tokens it matched."""
    score = 0.0
    matched = 0

    for token in tokens:
        token_score = _token_score(token, entry["weighted"])
        if token_score > 0 or _token_matches(token, entry["all_tokens"]):
            matched += 1
        score += token_score

    return score, matched


async def search(
    query: str,
    fetch_articles: Callable[[], Coroutine[Any, Any, list[dict[str, Any]]]],
    limit: int = 20,
) -> list[dict[str, Any]]:
    """Rank published articles against a keyword query.

    Requires every query token to match somewhere (AND); if that yields nothing,
    falls back to ranking articles that match any token (OR) so a single typo'd
    word doesn't wipe out otherwise good results.
    """
    tokens = tokenize(query or "")
    if not tokens or len(query.strip()) < _MIN_QUERY_LENGTH:
        return []

    entries = await _get_index(fetch_articles)

    strict: list[tuple[float, dict[str, Any]]] = []
    loose: list[tuple[float, dict[str, Any]]] = []

    for entry in entries:
        score, matched = _score_entry(entry, tokens)
        if score <= 0:
            continue

        if matched == len(tokens):
            strict.append((score, entry))
        else:
            # Partial matches rank below full ones, proportional to coverage.
            loose.append((score * matched / len(tokens), entry))

    ranked = strict or loose
    # Newest first breaks score ties, matching how the archive reads elsewhere.
    ranked.sort(
        key=lambda pair: (pair[0], pair[1]["item"].get("publish_date") or ""),
        reverse=True,
    )

    return [_to_result(entry, score, tokens) for score, entry in ranked[:limit]]
