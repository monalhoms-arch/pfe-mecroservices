from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_TITLE: str = "Khidmati GPS Core"
    PORT: int = 8001
    HOST: str = "127.0.0.1"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
