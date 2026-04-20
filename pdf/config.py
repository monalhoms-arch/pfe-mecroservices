from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    APP_TITLE: str = "PDF Generation Service"
    PORT: int = 8002
    HOST: str = "127.0.0.1"

    # Database
    DATABASE_URL: str = "postgresql+psycopg2://postgres:598624713@localhost:5432/whatsapp_data"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
