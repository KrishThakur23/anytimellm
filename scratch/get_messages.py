import os
import sys

sys.path.append(r"c:\Users\ACER\Desktop\anytimellm\backend")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Message

DATABASE_URL = "postgresql://postgres:postgrespassword@localhost:5432/anytimellm"

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    # Get last 5 messages ordered by created_at desc
    messages = db.query(Message).order_by(Message.created_at.desc()).limit(5).all()
    if not messages:
        print("NO_MESSAGES")
    for m in messages:
        print(f"ID: {m.id} | Sender: {m.sender} | Content: {m.content} | Created At: {m.created_at}")
    db.close()
except Exception as e:
    print(f"ERROR: {e}")
