from app.repositories.base_repo import BaseRepository
from uuid import uuid4

from app.schemas.article import ArticleModel

repo = BaseRepository("articles")


def _new_block_id() -> str:
    return str(uuid4())


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
        return {
            "id": block_id,
            "type": "image",
            "image": block.get("image") or "",
            "caption": block.get("caption") or "",
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

async def get_all(featured_only: bool = False):
    items = await repo.get_all()
    if featured_only:
        items = [item for item in items if item.get("featured") is True]
    return [_normalize_article_record(item) for item in items]

async def get_by_id(item_id: str):
    return _normalize_article_record(await repo.get_by_id(item_id))

async def get_by_slug(slug: str):
    items = await repo.get_all()
    for item in items:
        if item.get("slug") == slug:
            return _normalize_article_record(item)
    return None

async def create(payload: ArticleModel):
    return _normalize_article_record(await repo.create(_prepare_article_payload(payload)))

async def update(item_id: str, payload: ArticleModel):
    return _normalize_article_record(await repo.update(item_id, _prepare_article_payload(payload)))

async def patch_fields(item_id: str, fields: dict):
    """Partial update — only sets the provided fields (e.g. featured, display_order)."""
    return _normalize_article_record(await repo.update(item_id, fields))

async def delete(item_id: str):
    return await repo.delete_soft(item_id)
