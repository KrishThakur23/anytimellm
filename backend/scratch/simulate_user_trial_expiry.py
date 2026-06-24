import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path so app is importable
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import User, Subscription

def expire_user_trial(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email.lower().strip()).first()
        if not user:
            print(f"[ERROR] User with email '{email}' not found.")
            # List some active users
            users = db.query(User).limit(5).all()
            if users:
                print("Active users in DB:")
                for u in users:
                    print(f" - {u.email}")
            return
            
        sub = db.query(Subscription).filter(Subscription.business_id == user.business_id).first()
        if not sub:
            print(f"[ERROR] Subscription not found for user business ID {user.business_id}")
            return
            
        old_status = sub.status
        old_end_date = sub.trial_end_date
        
        # Set trial end date to 16 days ago and activate the status (if it was expired, we activate it first to see transition)
        sub.plan_type = "TRIAL"
        sub.status = "active"
        sub.trial_end_date = datetime.utcnow() - timedelta(days=16)
        
        db.commit()
        db.refresh(sub)
        
        print(f"[SUCCESS] Updated subscription for '{email}':")
        print(f" - Plan Type: {sub.plan_type}")
        print(f" - Old Status: {old_status} -> New Status: {sub.status}")
        print(f" - Old Trial End Date: {old_end_date} -> New Trial End Date: {sub.trial_end_date}")
        print("Now log in or refresh the dashboard page in your browser. You should be redirected to the pricing page and prompted to pay.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to update subscription: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scratch/simulate_user_trial_expiry.py <user_email>")
        # Print active users
        db = SessionLocal()
        users = db.query(User).limit(10).all()
        if users:
            print("\nAvailable users:")
            for u in users:
                print(f" - {u.email}")
        db.close()
    else:
        expire_user_trial(sys.argv[1])
