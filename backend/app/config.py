from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="postgresql://postgres:postgrespassword@localhost:5432/anytimellm")
    PINECONE_API_KEY: str = Field(default="")
    PINECONE_INDEX_NAME: str = Field(default="anytimellm")
    GEMINI_API_KEY: str = Field(default="")
    OPENAI_API_KEY: str = Field(default="")
    
    # Meta WhatsApp Config
    META_WA_PHONE_NUMBER_ID: str = Field(default="")
    META_WA_ACCESS_TOKEN: str = Field(default="")
    META_WA_VERIFY_TOKEN: str = Field(default="anytimellm_verify_token")
    
    # Twilio WhatsApp Config
    TWILIO_ACCOUNT_SID: str = Field(default="")
    TWILIO_AUTH_TOKEN: str = Field(default="")
    TWILIO_PHONE_NUMBER: str = Field(default="")
    
    # Google Cloud Vision Config
    GOOGLE_VISION_API_KEY: str = Field(default="")
    GOOGLE_APPLICATION_CREDENTIALS: str = Field(default="")
    
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
