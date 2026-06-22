from app.database import SessionLocal
from app.models import Business

db = SessionLocal()
try:
    nebraska = db.query(Business).filter(Business.name == "Nebraska").first()
    if nebraska:
        nebraska.api_settings["instagram_page_id"] = "1172523475939869"
        
        # Mark the JSON field as modified so SQLAlchemy saves it
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(nebraska, "api_settings")
        
        db.add(nebraska)
        db.commit()
        print("Successfully reverted Nebraska's Instagram Page ID back to '1172523475939869'!")
    else:
        print("Nebraska business not found!")
finally:
    db.close()
