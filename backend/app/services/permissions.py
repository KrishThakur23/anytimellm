import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Subscription, PlanEntitlement, AuditLog, Business, Document, Conversation

logger = logging.getLogger(__name__)

def check_subscription_expiry(db: Session, business_id: UUID) -> Subscription:
    """
    Lazy evaluates the subscription status. If the subscription or trial has passed its end date 
    plus the 24-hour grace period, it transitions the status to 'expired'.
    """
    sub = db.query(Subscription).filter(Subscription.business_id == business_id).first()
    now = datetime.utcnow()
    
    if not sub:
        # Fallback creation if missing (should not happen in prod with proper onboarding)
        sub = Subscription(
            business_id=business_id,
            plan_type="TRIAL",
            status="active",
            trial_start_date=now,
            trial_end_date=now + timedelta(days=15)
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
        return sub

    # If it is a TRIAL and trial dates are not set yet, initialize them
    if sub.plan_type == "TRIAL" and (sub.trial_start_date is None or sub.trial_end_date is None):
        start_dt = sub.created_at if sub.created_at else now
        sub.trial_start_date = start_dt
        sub.trial_end_date = start_dt + timedelta(days=15)
        db.commit()
        db.refresh(sub)

    # Determine applicable end date
    end_date = sub.subscription_end_date if sub.plan_type != "TRIAL" else sub.trial_end_date

    # Ensure timezone awareness if your db returns aware datetimes
    if end_date and end_date.tzinfo:
        from datetime import timezone
        now = datetime.now(timezone.utc).astimezone(end_date.tzinfo)

    if end_date and sub.status in ["active", "past_due"]:
        # Check grace period (24 hours)
        if now > end_date + timedelta(hours=24):
            sub.status = "expired"
            sub.subscription_status_reason = f"expired_{sub.plan_type.lower()}"
            
            # Log to AuditLog
            audit = AuditLog(
                business_id=business_id,
                action="subscription_expired",
                entity_type="subscription",
                entity_id=str(sub.id),
                details={"reason": sub.subscription_status_reason, "end_date": str(end_date)}
            )
            db.add(audit)
            db.commit()
            db.refresh(sub)
            logger.info(f"Business {business_id} transitioned to expired state.")

    return sub

def get_business_entitlements(db: Session, business_id: UUID) -> Dict[str, Any]:
    """
    Returns the current entitlements for a business, factoring in their subscription status.
    If expired or suspended, premium features are disabled.
    """
    sub = check_subscription_expiry(db, business_id)
    
    entitlements = db.query(PlanEntitlement).filter(PlanEntitlement.plan_type == sub.plan_type).first()
    
    if not entitlements:
        # Fallback to defaults if missing
        return {
            "max_documents": 20,
            "max_conversations": 500,
            "max_agents": 1,
            "max_products": 50,
            "max_integrations": 2,
            "max_users": 1,
            "can_use_bot": sub.status in ["active", "past_due"],
            "status": sub.status
        }
        
    return {
        "max_documents": entitlements.max_documents,
        "max_conversations": entitlements.max_conversations,
        "max_agents": entitlements.max_agents,
        "max_products": entitlements.max_products,
        "max_integrations": entitlements.max_integrations,
        "max_users": entitlements.max_users,
        "can_use_bot": sub.status in ["active", "past_due"],
        "status": sub.status
    }

def check_can_use_bot(db: Session, business_id: UUID) -> bool:
    """Convenience method to quickly check if a business can use the AI bot."""
    ent = get_business_entitlements(db, business_id)
    return ent.get("can_use_bot", False)

def check_document_limit(db: Session, business_id: UUID) -> bool:
    """Checks if the business can upload another document based on their entitlements."""
    ent = get_business_entitlements(db, business_id)
    max_docs = ent.get("max_documents", 0)
    
    if max_docs == -1: # Unlimited
        return True
        
    current_docs = db.query(func.count(Document.id)).filter(Document.business_id == business_id).scalar()
    return current_docs < max_docs

def check_conversation_limit(db: Session, business_id: UUID) -> bool:
    """
    Checks if the business can start/continue a conversation based on the 24-hour limit logic.
    (Currently simplified to absolute count for MVP, but should evaluate unique customers within 24h).
    """
    ent = get_business_entitlements(db, business_id)
    max_convos = ent.get("max_conversations", 0)
    
    if max_convos == -1: # Unlimited
        return True
        
    # We define a 'conversation' conceptually as unique customers interacted with in the last 30 days
    # (In a full implementation, you'd calculate rolling 30-day active customers)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    current_convos = (
        db.query(func.count(func.distinct(Conversation.customer_id)))
        .filter(Conversation.business_id == business_id)
        .filter(Conversation.created_at >= thirty_days_ago)
        .scalar()
    )
    
    return current_convos < max_convos
