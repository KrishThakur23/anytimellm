from app.database import SessionLocal
from app.models import Business

db = SessionLocal()
try:
    businesses = db.query(Business).all()
    for b in businesses:
        print("--------------------------------------------------")
        print(f"ID: {b.id}")
        print(f"Name: {b.name}")
        print(f"Instagram Provider: {b.api_settings.get('instagram_provider')}")
        print(f"Instagram Page ID: {b.api_settings.get('instagram_page_id')}")
        print(f"System Prompt: {b.api_settings.get('system_prompt')}")
    print("--------------------------------------------------")
finally:
    db.close()
