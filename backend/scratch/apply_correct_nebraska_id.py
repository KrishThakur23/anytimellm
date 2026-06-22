from app.database import SessionLocal
from app.models import Business

db = SessionLocal()
try:
    nebraska = db.query(Business).filter(Business.name == "Nebraska").first()
    if nebraska:
        nebraska.api_settings["instagram_page_id"] = "17841464479767096"
        
        # Mark the JSON field as modified so SQLAlchemy saves it
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(nebraska, "api_settings")
        
        db.add(nebraska)
        db.commit()
        print("Successfully re-applied Nebraska's correct Instagram Page ID to '17841464479767096'!")
    else:
        print("Nebraska business not found!")
finally:
    db.close()
