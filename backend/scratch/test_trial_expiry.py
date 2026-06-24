import sys
import os
from datetime import datetime, timedelta
import uuid

# Add parent directory to path so app is importable
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import Business, User, Subscription, SubscriptionHistory, AuditLog
from app.services.permissions import check_subscription_expiry, get_business_entitlements

def run_test():
    db = SessionLocal()
    try:
        print("[TEST] Registering mock business...")
        biz = Business(
            name="Test Expiry Business " + str(uuid.uuid4())[:8],
            api_settings={"system_prompt": "Hello!"}
        )
        db.add(biz)
        db.commit()
        db.refresh(biz)
        print(f"[TEST] Mock business created with ID: {biz.id}")

        print("[TEST] Registering mock user...")
        user = User(
            business_id=biz.id,
            email="test-expiry-" + str(uuid.uuid4())[:8] + "@example.com",
            hashed_password="mock_hashed_password"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"[TEST] Mock user created with ID: {user.id}")

        # 1. Verify lazy subscription initialization
        print("[TEST] Evaluating lazy subscription initialization...")
        sub = check_subscription_expiry(db, biz.id)
        assert sub is not None, "Subscription should be created lazily"
        assert sub.plan_type == "TRIAL", f"Expected TRIAL, got {sub.plan_type}"
        assert sub.status == "active", f"Expected active status, got {sub.status}"
        assert sub.trial_start_date is not None, "Trial start date should be set"
        assert sub.trial_end_date is not None, "Trial end date should be set"
        
        # Check if duration is 15 days
        duration = (sub.trial_end_date - sub.trial_start_date).days
        assert duration == 15, f"Expected 15-day trial, got {duration} days"
        print(f"[TEST] SUCCESS: 15-day active trial lazily created. Trial ends at: {sub.trial_end_date}")

        # Verify entitlement shows active status
        ent = get_business_entitlements(db, biz.id)
        assert ent["can_use_bot"] is True, "User should be allowed to use bot during active trial"
        assert user.trial_expired is False, "User trial_expired property should be False"
        print("[TEST] SUCCESS: Entitlements verified for active trial.")

        # 2. Mock Trial Expiry (set trial_end_date to 16 days ago)
        print("[TEST] Mocking trial expiry (setting end date to 16 days ago)...")
        sub.trial_end_date = datetime.utcnow() - timedelta(days=16)
        db.commit()
        
        # Evaluate subscription expiry
        sub = check_subscription_expiry(db, biz.id)
        assert sub.status == "expired", f"Expected status to transition to expired, got {sub.status}"
        assert sub.subscription_status_reason == "expired_trial", f"Expected expired_trial reason, got {sub.subscription_status_reason}"
        assert user.trial_expired is True, "User trial_expired property should be True"
        
        ent_expired = get_business_entitlements(db, biz.id)
        assert ent_expired["can_use_bot"] is False, "User should NOT be allowed to use bot after trial expiry"
        print("[TEST] SUCCESS: Expiry transition and entitlements blocking verified.")

        # 3. Simulate checkout upgrade to STARTER
        print("[TEST] Simulating self-serve checkout upgrade to STARTER...")
        old_plan = sub.plan_type
        sub.plan_type = "STARTER"
        sub.status = "active"
        sub.subscription_status_reason = "paid"
        sub.trial_start_date = None
        sub.trial_end_date = None
        
        now = datetime.utcnow()
        sub.subscription_start_date = now
        sub.subscription_end_date = now + timedelta(days=30)
        
        # Record history
        amount = 999.00
        history = SubscriptionHistory(
            business_id=biz.id,
            old_plan=old_plan,
            new_plan="STARTER",
            status_change="upgraded",
            amount=amount,
            provider="simulated_checkout",
            timestamp=now
        )
        db.add(history)
        db.commit()
        
        # Re-evaluate
        db.refresh(user)
        assert user.trial_expired is False, "User trial_expired should be False after upgrade"
        assert sub.plan_type == "STARTER", f"Expected STARTER plan, got {sub.plan_type}"
        assert sub.status == "active", f"Expected active status, got {sub.status}"
        
        ent_upgraded = get_business_entitlements(db, biz.id)
        assert ent_upgraded["can_use_bot"] is True, "User should be allowed to use bot after upgrading to STARTER"
        print("[TEST] SUCCESS: Upgraded subscription and restored entitlements verified.")

        # Clean up
        print("[TEST] Cleaning up test records...")
        db.delete(history)
        db.delete(user)
        db.delete(sub)
        db.delete(biz)
        db.commit()
        print("[TEST] Clean up completed.")
        print("\n=== ALL TESTS PASSED SUCCESSFULLY ===")

    except Exception as e:
        db.rollback()
        print(f"[TEST] FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    run_test()
