import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, ingest, chat, webhook, users, integrations

# Setup logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

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

        conn.execute(text("ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_ai_paused BOOLEAN DEFAULT FALSE;"))
        
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

app = FastAPI(
    title="AnytimeLLM AI API Backend",
    description="Multi-tenant backend parsing uploads, running LangGraph agents, and servicing Web Widget/Meta WhatsApp chats.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    import time
    start_time = time.time()
    path = request.url.path
    query = request.url.query
    method = request.method
    print(f"\n>>> [REQUEST START] {method} {path}" + (f"?{query}" if query else ""))
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        print(f"<<< [REQUEST END] {method} {path} -> Status {response.status_code} ({process_time:.2f}ms)\n")
        return response
    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        print(f"<<< [REQUEST ERROR] {method} {path} -> {e} ({process_time:.2f}ms)\n")
        raise e

# Include routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(ingest.router)
app.include_router(chat.router)
app.include_router(webhook.router)
app.include_router(integrations.router)

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
