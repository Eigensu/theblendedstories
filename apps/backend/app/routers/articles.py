from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.schemas.article import ArticleModel
from app.services.article_service import get_all, get_by_id, get_by_slug, create, update, patch_fields, delete
from app.utils.responses import success_response
from app.auth import get_current_admin

router = APIRouter(prefix="/articles", tags=["articles"])

# Minimal schema for Top Picks homepage configuration
class ArticleTopPicksPatch(BaseModel):
    featured: bool
    display_order: int

@router.get("/")
async def list_articles(featured: Optional[bool] = None):
    items = await get_all(featured_only=featured)
    # Sort by display order (treat 0 as last)
    items = sorted(items, key=lambda x: x.get("display_order") if x.get("display_order", 0) > 0 else 999999)
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
    # Enforce unique slug
    existing = await get_by_slug(payload.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    created = await create(payload)
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
