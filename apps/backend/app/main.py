from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.utils.exceptions import global_exception_handler
from app.routers import (
    hero, what_is_tbs, footer,
    what_we_cover, tbs_nights, the_edit, tbs_talks, media
)
from app.auth import oauth2_scheme, verify_password, create_access_token, TokenData
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.config import settings as app_settings
from app.utils.responses import success_response

app = FastAPI(title="The Blended Stories CMS", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

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
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me")
async def get_me(token: str = Depends(oauth2_scheme)):
    return success_response(data={"username": app_settings.ADMIN_USERNAME})

app.include_router(hero.router)
app.include_router(what_is_tbs.router)
app.include_router(what_we_cover.router)
app.include_router(tbs_nights.router)
app.include_router(the_edit.router)
app.include_router(tbs_talks.router)
app.include_router(footer.router)

app.include_router(media.router)

@app.get("/")
def root():
    return success_response(message="Welcome to The Blended Stories CMS API")
