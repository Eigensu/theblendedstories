from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "the_blended_stories"
    
    ADMIN_USERNAME: str = Field("admin", min_length=1)
    ADMIN_PASSWORD: str = Field(..., min_length=12)
    JWT_SECRET: str = Field(..., alias="SECRET_KEY", min_length=32)
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Google sign-in for site members. Empty means the feature is off and
    # POST /auth/google returns 503 rather than failing deep inside the exchange.
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # Origins allowed to call this API. Comma-separated in the environment.
    CORS_ORIGINS: str = "http://localhost:3000,https://theblendedstories.in,https://www.theblendedstories.in"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def google_enabled(self) -> bool:
        return bool(self.GOOGLE_CLIENT_ID and self.GOOGLE_CLIENT_SECRET)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
