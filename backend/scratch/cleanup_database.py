from app.database import SessionLocal
from app.models import Business

db = SessionLocal()
try:
    businesses = db.query(Business).all()
    for b in businesses:
        # Keep Nebraska's ID intact
        if b.name.lower() == "nebraska":
            print(f"Skipping active business: {b.name} (ID: {b.id})")
            continue
            
        # Clean up instagram settings for other businesses
        updated = False
        if "instagram_page_id" in b.api_settings:
            b.api_settings["instagram_page_id"] = None
            updated = True
        if "instagram_provider" in b.api_settings:
            b.api_settings["instagram_provider"] = None
            updated = True
            
        if updated:
            # Mark the JSON field as modified so SQLAlchemy saves it
            from sqlalchemy.orm.attributes import flag_modified
            flag_modified(b, "api_settings")
            db.add(b)
            print(f"Cleaned up settings for business: {b.name} (ID: {b.id})")
            
    db.commit()
    print("Database cleanup completed successfully!")
finally:
    db.close()
