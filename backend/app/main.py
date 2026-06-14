from contextlib import asynccontextmanager
import logging
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, ingest, chat, webhook, users, integrations, onboarding, integrations_instagram, webhook_instagram

# Setup logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Setup Rate Limiting
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup (in production, use Alembic migrations, but for developer-first build we create all tables automatically)
    try:
        logger.info("Initializing relational database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
        
        # Safe migration: add column is_ai_paused if it does not exist and create indexes
        from sqlalchemy import text
        with engine.connect() as conn:
            # Create users table if it does not exist
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY,
                    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    hashed_password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_business_id ON users (business_id);"))

            # Helper to safely add column depending on the database dialect
            def safe_add_column(table, column, definition):
                try:
                    if engine.dialect.name == "sqlite":
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {definition};"))
                    else:
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {column} {definition};"))
                    conn.commit()
                except Exception as e:
                    # If column already exists, we can ignore the error
                    err_msg = str(e).lower()
                    if "duplicate column name" in err_msg or "already exists" in err_msg:
                        pass
                    else:
                        logger.warning(f"Could not add column {column} to {table}: {e}")

            safe_add_column("conversations", "is_ai_paused", "BOOLEAN DEFAULT FALSE")
            safe_add_column("conversations", "ai_pause_reason", "VARCHAR(100)")
            safe_add_column("conversations", "ai_paused_at", "TIMESTAMP WITH TIME ZONE")
            safe_add_column("messages", "meta_message_id", "VARCHAR(255) UNIQUE")
            safe_add_column("businesses", "business_type", "VARCHAR(50)")
            safe_add_column("businesses", "onboarding_status", "VARCHAR(50) DEFAULT 'pending'")
            
            # Create missing indexes for critical foreign keys and filter fields
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_documents_business_id ON documents (business_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_catalogs_business_id ON catalogs (business_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_customers_business_id ON customers (business_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_customers_phone_number ON customers (phone_number);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_conversations_business_id ON conversations (business_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_conversations_customer_id ON conversations (customer_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_messages_conversation_id ON messages (conversation_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_orders_business_id ON orders (business_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_orders_customer_id ON orders (customer_id);"))
            
            conn.commit()
        logger.info("Database migration check and indexing completed successfully.")
    except Exception as migration_error:
        logger.warning(f"Database migration check skipped or failed: {migration_error}")
    except Exception as e:
        logger.error(f"Failed database table creation: {e}. Please ensure PostgreSQL is running.")
    yield

app = FastAPI(
    title="AnytimeLLM AI API Backend",
    description="Multi-tenant backend parsing uploads, running LangGraph agents, and servicing Web Widget/Meta WhatsApp chats.",
    version="1.0.0",
    lifespan=lifespan
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS configuration
allowed_origins_raw = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
allowed_origins = [origin.strip() for origin in allowed_origins_raw if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_BODY_SIZE = 25 * 1024 * 1024 # 25MB max to accommodate large file uploads, strict file limit enforced in ingest.py

@app.middleware("http")
async def security_and_logging_middleware(request: Request, call_next):
    import time
    start_time = time.time()
    path = request.url.path
    query = request.url.query
    method = request.method
    
    # Enforce global payload size limit
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > MAX_BODY_SIZE:
        logger.warning(f"Rejected oversized payload: {content_length} bytes from {request.client.host}")
        return JSONResponse(status_code=413, content={"detail": "Payload too large."})

    print(f"\n>>> [REQUEST START] {method} {path}" + (f"?{query}" if query else ""))
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        print(f"<<< [REQUEST END] {method} {path} -> Status {response.status_code} ({process_time:.2f}ms)\n")
    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logger.error(f"<<< [REQUEST ERROR] {method} {path} -> {e} ({process_time:.2f}ms)\n", exc_info=True)
        response = JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred. Please try again later."}
        )
    
    # Apply Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Include routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(ingest.router)
app.include_router(chat.router)
app.include_router(webhook.router)
app.include_router(integrations.router)
app.include_router(onboarding.router)
app.include_router(integrations_instagram.router)
app.include_router(webhook_instagram.router)

@app.api_route("/", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "healthy",
        "service": "AnytimeLLM Backend",
        "version": "1.0.0"
    }

@app.post("/")
def root_post_fallback():
    return {
        "status": "ignored",
        "message": "Root POST requests are ignored."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
