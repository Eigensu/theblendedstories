from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated, Optional
from pydantic import BaseModel
from app.schemas.article import ArticleModel
from app.services.article_service import get_all, get_by_id, get_by_slug, create, update, patch_fields, delete, search
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/articles", tags=["articles"])

# Minimal schema for Top Picks homepage configuration
class ArticleTopPicksPatch(BaseModel):
    featured: bool
    display_order: int

@router.get("/")
async def list_articles(
    featured: Optional[bool] = None,
    summary: bool = False,
    location_main: Optional[str] = None,
    location_sub: Optional[str] = None,
    city: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
):
    """Set summary=true to omit article bodies — listings never render them.

    Optional filters:
    - category: exact-match on the article's category field
    - status: 'draft' or 'published'
    - location_main/location_sub: the visitor's default/cookied city — never
      excludes anything, just sorts that city's articles to the top
    - city: an explicit city pick (e.g. the footer's location links) — hard
      filters to only that city's articles
    """
    location_main = location_main or None
    location_sub = location_sub or None
    city = city or None

    items = await get_all(
        featured_only=featured,
        summary=summary,
        location_main=location_main,
        location_sub=location_sub,
        city=city,
        category=category,
        status=status,
    )

    return success_response(data=items)

# NOTE: must stay above `/{slug}` — FastAPI matches in declaration order and the
# single-segment slug route would otherwise swallow /articles/search as a 404.
@router.get("/search")
async def search_articles(
    q: Annotated[str, Query(description="Keyword query")] = "",
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
):
    items = await search(q, limit=limit)
    return success_response(data=items)

@router.get("/{slug}")
async def get_article_by_slug(slug: str):
    item = await get_by_slug(slug)
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    return success_response(data=item)

@router.get("/id/{item_id}")
async def get_article_by_id(item_id: str):
    item = await get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    return success_response(data=item)

@router.post("/", dependencies=[Depends(get_current_admin)])
async def create_article(payload: ArticleModel):
    # Auto-generate a unique slug for untitled drafts
    if not payload.slug:
        import uuid
        payload.slug = f"untitled-draft-{uuid.uuid4().hex[:8]}"
        print(f"DEBUG: Auto-generated slug: {payload.slug}")
    else:
        print(f"DEBUG: Slug is present: {payload.slug}")
        
    # Enforce unique slug
    existing = await get_by_slug(payload.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    created = await create(payload)
    print(f"DEBUG: Created data: {created.get('slug')}")
    return success_response(data=created, message="Created successfully")

@router.put("/{item_id}", dependencies=[Depends(get_current_admin)])
async def update_article(item_id: str, payload: ArticleModel):
    # Enforce unique slug
    existing = await get_by_slug(payload.slug)
    if existing and str(existing.get("id")) != item_id:
        raise HTTPException(status_code=400, detail="Slug already exists")
    updated = await update(item_id, payload)
    return success_response(data=updated, message="Updated successfully")

@router.patch("/{item_id}/top-picks", dependencies=[Depends(get_current_admin)])
async def patch_article_top_picks(item_id: str, payload: ArticleTopPicksPatch):
    """Update only featured and display_order. Used by Top Picks homepage editor."""
    updated = await patch_fields(item_id, payload.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Article not found")
    return success_response(data=updated, message="Updated successfully")

@router.delete("/{item_id}", dependencies=[Depends(get_current_admin)])
async def delete_article(item_id: str):
    await delete(item_id)
    return success_response(message="Deleted successfully")
