from app.database import SessionLocal
from app.models import Business

db = SessionLocal()
try:
    nebraska = db.query(Business).filter(Business.name == "Nebraska").first()
    if nebraska:
        print("NEBRASKA SETTINGS:")
        print(f"Name: {nebraska.name}")
        print(f"api_settings type: {type(nebraska.api_settings)}")
        print(f"api_settings keys and values:")
        for k, v in nebraska.api_settings.items():
            print(f"  {k}: {repr(v)} (type: {type(v)})")
    else:
        print("Nebraska business not found!")
finally:
    db.close()
