from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    MONGO_URL: str = Field("mongodb://localhost:27017", alias="MONGODB_URI")
    MONGO_DB_NAME: str = "blended_stories"
    
    ADMIN_USERNAME: str = Field("admin", min_length=1)
    ADMIN_PASSWORD: str = Field(..., min_length=12)
    JWT_SECRET: str = Field(..., alias="SECRET_KEY", min_length=32)
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
