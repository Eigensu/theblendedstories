from datetime import datetime

from app.repositories.base_repo import BaseRepository
from uuid import uuid4

from app.schemas.article import ArticleModel
from app.services import article_search

repo = BaseRepository("articles")


def _publication_timestamp(item: dict) -> float | None:
    publish_date = item.get("publish_date")
    if isinstance(publish_date, str) and publish_date.strip():
        try:
            return datetime.fromisoformat(publish_date.strip()).timestamp()
        except ValueError:
            pass

    created_at = item.get("created_at")
    if isinstance(created_at, datetime):
        try:
            return created_at.timestamp()
        except (OverflowError, OSError, ValueError):
            return None

    return None


def _article_sort_key_latest(item: dict) -> tuple[float, str]:
    publication_timestamp = _publication_timestamp(item)
    publication_sort = (
        float("inf") if publication_timestamp is None else -publication_timestamp
    )
    slug = str(item.get("slug") or "")
    return (publication_sort, slug)

def _article_sort_key_featured(item: dict) -> tuple[int, int, float, str]:
    display_order = item.get("display_order")
    latest_sort = _article_sort_key_latest(item)
    if isinstance(display_order, int) and display_order > 0:
        return (0, display_order, *latest_sort)
    return (1, 0, *latest_sort)

async def _fetch_sorted_articles(query: dict | None = None, featured_only: bool = False) -> list[dict]:
    cursor = repo.collection.find({**(query or {}), "is_active": True})
    items = await cursor.to_list(length=None)
    sort_key = _article_sort_key_featured if featured_only else _article_sort_key_latest
    return sorted(items, key=sort_key)


def _new_block_id() -> str:
    return str(uuid4())


def _normalize_image_items(block: dict) -> list[dict]:
    """Collect an image block's row of images.

    `images` is the current shape. Blocks written before it existed carry a
    single `image`/`caption` pair at the top level, so those fall back to a
    one-item row and read identically.
    """
    items: list[dict] = []
    raw_items = block.get("images")

    if isinstance(raw_items, list):
        for raw_item in raw_items:
            if not isinstance(raw_item, dict):
                continue
            image = raw_item.get("image") or ""
            if not image:
                continue
            items.append(
                {
                    "image": image,
                    "caption": raw_item.get("caption") or "",
                    "link": raw_item.get("link") or "",
                }
            )

    if not items and block.get("image"):
        items.append(
            {
                "image": block["image"],
                "caption": block.get("caption") or "",
                "link": block.get("link") or "",
            }
        )

    return items


def _normalize_block(block: dict) -> dict | None:
    if not isinstance(block, dict):
        return None

    block_id = block.get("id") or _new_block_id()
    block_type = block.get("type")

    if block_type == "text":
        return {
            "id": block_id,
            "type": "text",
            "content": block.get("content") or "",
        }

    if block_type == "quote":
        return {
            "id": block_id,
            "type": "quote",
            "quote": block.get("quote") or "",
            "author": block.get("author") or "",
        }

    if block_type == "image":
        images = _normalize_image_items(block)
        first_image = images[0] if images else {}
        return {
            "id": block_id,
            "type": "image",
            "images": images,
            # Mirrors of the first image, kept so anything still reading the
            # single-image shape renders instead of going blank.
            "image": first_image.get("image", ""),
            "caption": first_image.get("caption", ""),
            "link": first_image.get("link", ""),
        }

    return None


def _legacy_content_to_blocks(content: list[str]) -> list[dict]:
    return [
        {
            "id": _new_block_id(),
            "type": "text",
            "content": paragraph,
        }
        for paragraph in content
        if isinstance(paragraph, str) and paragraph.strip()
    ]


def _normalize_article_record(item: dict | None) -> dict | None:
    if not item:
        return item

    normalized_item = dict(item)
    existing_blocks = normalized_item.get("contentBlocks") or []
    normalized_blocks = []

    for block in existing_blocks:
      normalized_block = _normalize_block(block)
      if normalized_block:
          normalized_blocks.append(normalized_block)

    if not normalized_blocks:
        normalized_blocks = _legacy_content_to_blocks(normalized_item.get("content") or [])

    normalized_item["contentBlocks"] = normalized_blocks
    normalized_item["content"] = [
        block["content"]
        for block in normalized_blocks
        if block.get("type") == "text" and block.get("content")
    ]
    return normalized_item


def _prepare_article_payload(payload: ArticleModel) -> dict:
    data = payload.model_dump(exclude_unset=True, exclude={"id"})

    # A title keeps the line breaks an editor typed — the hero renders it with
    # `white-space: pre-line`. Only the outer whitespace goes, so a stray
    # trailing Enter cannot leave a gap under the title.
    if isinstance(data.get("title"), str):
        data["title"] = data["title"].strip()

    incoming_blocks = data.get("contentBlocks") or []
    normalized_blocks = []

    for block in incoming_blocks:
        normalized_block = _normalize_block(block)
        if normalized_block:
            normalized_blocks.append(normalized_block)

    if not normalized_blocks:
        normalized_blocks = _legacy_content_to_blocks(data.get("content") or [])

    data["contentBlocks"] = normalized_blocks
    data.pop("content", None)
    return data

# Everything a listing needs (cards, prev/next, recommendations) and nothing more.
# Excludes contentBlocks/content, which dominate the payload and are only ever
# read for the single article actually being displayed.
_SUMMARY_FIELDS = (
    "id",
    "slug",
    "title",
    "subtitle",
    "category",
    # The /topics pages filter and group entirely off these two, and they read the
    # summary list — drop either and every keyword page renders empty.
    "primary_keyword",
    "sub_keyword",
    "location_main",
    "location_sub",
    "author",
    "cover_image",
    "hero_image",
    "reading_time",
    "publish_date",
    "featured",
    "display_order",
    "status",
)


def _summarize_article_record(item: dict) -> dict:
    return {field: item.get(field) for field in _SUMMARY_FIELDS}


async def get_all(
    featured_only: bool = False,
    summary: bool = False,
    location_main: str | None = None,
    location_sub: str | None = None,
):
    query: dict[str, object] = {}
    if location_main:
        query["location_main"] = location_main
    if location_sub:
        query["location_sub"] = location_sub

    items = await _fetch_sorted_articles(query, featured_only)
    if featured_only:
        items = [item for item in items if item.get("featured") is True]
    if summary:
        # Skip block normalization entirely — it is pure waste when the blocks
        # are about to be dropped.
        return [_summarize_article_record(item) for item in items]
    return [_normalize_article_record(item) for item in items]

async def get_by_id(item_id: str):
    return _normalize_article_record(await repo.get_by_id(item_id))

async def get_by_slug(slug: str):
    items = await repo.get_all()
    for item in items:
        if item.get("slug") == slug:
            return _normalize_article_record(item)
    return None

async def search(query: str, limit: int = 20):
    """Keyword search over published articles, ranked by relevance."""
    return await article_search.search(query, get_all, limit=limit)

async def create(payload: ArticleModel):
    article_search.invalidate_cache()
    return _normalize_article_record(await repo.create(_prepare_article_payload(payload)))

async def update(item_id: str, payload: ArticleModel):
    article_search.invalidate_cache()
    return _normalize_article_record(await repo.update(item_id, _prepare_article_payload(payload)))

async def patch_fields(item_id: str, fields: dict):
    """Partial update — only sets the provided fields (e.g. featured, display_order)."""
    article_search.invalidate_cache()
    return _normalize_article_record(await repo.update(item_id, fields))

async def delete(item_id: str):
    article_search.invalidate_cache()
    return await repo.delete_soft(item_id)
