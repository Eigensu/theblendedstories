from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.utils.exceptions import global_exception_handler
from app.routers import (
    hero, what_is_tbs, footer,
    what_we_cover, tbs_nights, articles, tbs_talks, media, the_edit,
    members, newsletter, menu, location
)
from app.auth import oauth2_scheme, verify_password, create_access_token, create_refresh_token, TokenData
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.config import settings as app_settings
from app.utils.responses import success_response
from pydantic import BaseModel
from jose import jwt, JWTError

class RefreshRequest(BaseModel):
    refresh_token: str

app = FastAPI(title="The Blended Stories CMS", version="1.0.0")

# Restricted to known origins rather than "*": this API now issues member
# session tokens, so any page that can call it can act as a signed-in reader.
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.utils.exceptions import validation_exception_handler, http_exception_handler

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)


@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    
    # --- PRODUCTION COMPREHENSIVE DB DIAGNOSTIC ---
    try:
        from app.database import db
        print("\n" + "="*50)
        print("PRODUCTION DB DIAGNOSTIC START")
        
        # 1. The database name actually being used
        actual_db_name = db.db.name
        print(f"DATABASE NAME IN USE: {actual_db_name}")
        
        # 2. All collection names
        collections_list = await db.db.list_collection_names()
        print(f"ALL COLLECTIONS: {collections_list}")
        
        # 3. For each collection, count and active count
        cols = ["hero", "what_is_tbs", "tbs_nights", "what_we_cover", "the_edit", "tbs_talks"]
        for c in cols:
            coll = db.db[c]
            total_count = await coll.count_documents({})
            active_count = await coll.count_documents({"is_active": True})
            print(f"Collection [{c}] -> Total: {total_count} | Active: {active_count}")
        
        # 4. Print the first document from what_we_cover if one exists
        wwc_doc = await db.db["what_we_cover"].find_one()
        if wwc_doc:
            wwc_doc["_id"] = str(wwc_doc["_id"])
            print(f"FIRST DOC in what_we_cover: {wwc_doc}")
        else:
            print("FIRST DOC in what_we_cover: None (collection is empty)")
            
        print("PRODUCTION DB DIAGNOSTIC END")
        print("="*50 + "\n")
    except Exception as e:
        print(f"DIAGNOSTIC ERROR: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != app_settings.ADMIN_USERNAME or form_data.password != app_settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username})
    refresh_token = create_refresh_token(data={"sub": form_data.username})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@app.post("/auth/refresh")
async def refresh_token(req: RefreshRequest):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(req.refresh_token, app_settings.JWT_SECRET, algorithms=[app_settings.JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise credentials_exception
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    access_token = create_access_token(data={"sub": username})
    new_refresh_token = create_refresh_token(data={"sub": username})
    return success_response(data={"access_token": access_token, "refresh_token": new_refresh_token})

@app.get("/auth/me")
async def get_me(token: str = Depends(oauth2_scheme)):
    from app.auth import get_current_admin
    username = await get_current_admin(token)
    return success_response(data={"username": username})

app.include_router(hero.router)
app.include_router(what_is_tbs.router)
app.include_router(what_we_cover.router)
app.include_router(tbs_nights.router)
app.include_router(articles.router)
app.include_router(tbs_talks.router)
app.include_router(footer.router)
app.include_router(menu.router)
app.include_router(location.router)
app.include_router(the_edit.router)

app.include_router(members.router)
app.include_router(newsletter.router)

app.include_router(media.router)

@app.get("/")
def root():
    return success_response(message="Welcome to The Blended Stories CMS API")
