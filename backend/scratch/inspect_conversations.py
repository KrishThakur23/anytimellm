from app.database import SessionLocal
from app.models import Customer, Conversation, Message, Business

db = SessionLocal()
try:
    print("CUSTOMERS:")
    customers = db.query(Customer).all()
    for c in customers:
        if "instagram" in c.phone_number:
            print(f"Customer ID: {c.id} | Name: {c.name} | Phone: {c.phone_number} | Business ID: {c.business_id}")
            # Find business name
            biz = db.query(Business).filter(Business.id == c.business_id).first()
            print(f"  Belongs to Business: {biz.name if biz else 'None'}")
            
            # Find conversations
            convs = db.query(Conversation).filter(Conversation.customer_id == c.id).all()
            for cv in convs:
                print(f"  Conv ID: {cv.id} | Channel: {cv.channel} | Status: {cv.status} | Business ID: {cv.business_id}")
                # Find messages
                msgs = db.query(Message).filter(Message.conversation_id == cv.id).order_by(Message.created_at.asc()).all()
                for m in msgs:
                    print(f"    [{m.sender} at {m.created_at}]: {m.content}")
finally:
    db.close()
