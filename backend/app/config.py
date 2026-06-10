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
    
    # Meta App Credentials for Embedded Signup Oauth
    META_APP_ID: str = Field(default="")
    META_APP_SECRET: str = Field(default="")
    META_WEBHOOK_VERIFY_TOKEN: str = Field(default="anytimellm_global_webhook_verify_token")
    

    
    # Google Cloud Vision Config
    GOOGLE_VISION_API_KEY: str = Field(default="")
    GOOGLE_APPLICATION_CREDENTIALS: str = Field(default="")
    GOOGLE_SERVICE_ACCOUNT_JSON: str = Field(default="")
    
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # JWT Auth Config
    JWT_SECRET_KEY: str = Field(default="anytimellm_secret_key_change_me_in_production")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440)
    GOOGLE_CLIENT_ID: str = Field(default="")


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
