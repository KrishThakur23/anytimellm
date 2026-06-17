from sqlalchemy.orm import Session
from app.models import ConversionEvent
from uuid import UUID

def log_conversion_event(db: Session, business_id: UUID, event_type: str):
    # Only insert if it doesn't exist to prevent duplicates for 'First' events
    # Or just log all of them. Let's log all of them but maybe deduplicate 'First Conversation'
    
    if event_type in ['Knowledge Uploaded', 'First Conversation', 'WhatsApp Connected']:
        existing = db.query(ConversionEvent).filter_by(
            business_id=business_id, 
            event_type=event_type
        ).first()
        if existing:
            return
            
    event = ConversionEvent(business_id=business_id, event_type=event_type)
    db.add(event)
    db.commit()

