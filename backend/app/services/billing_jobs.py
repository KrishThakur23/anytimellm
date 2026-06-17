import logging
from datetime import datetime, timedelta
from sqlalchemy import func

from app.database import SessionLocal
from app.models import Subscription, UsageSnapshot, Conversation, Document, Order, BillingWebhookEvent

logger = logging.getLogger(__name__)

def sweep_expired_subscriptions():
    """
    Background job that runs periodically to formally transition subscriptions that 
    have passed their grace period into an expired state. Most expiry happens via 
    lazy evaluation, but this ensures the DB reflects reality for analytics and emails.
    """
    logger.info("Running background sweep for expired subscriptions...")
    db = SessionLocal()
    try:
        from app.services.permissions import check_subscription_expiry
        
        # Find all active or past_due subscriptions
        subs = db.query(Subscription).filter(Subscription.status.in_(["active", "past_due"])).all()
        for sub in subs:
            # We rely on the core logic function to enforce the 24h grace period
            check_subscription_expiry(db, sub.business_id)
            
    except Exception as e:
        logger.error(f"Error during sweep_expired_subscriptions: {e}")
    finally:
        db.close()

def generate_daily_usage_snapshots():
    """
    Runs daily (usually around midnight UTC) to aggregate and lock the usage snapshot
    for every business. Critical for billing disputes and analytics.
    """
    logger.info("Generating daily usage snapshots...")
    db = SessionLocal()
    try:
        today = datetime.utcnow().date()
        yesterday_start = datetime.combine(today - timedelta(days=1), datetime.min.time())
        yesterday_end = datetime.combine(today - timedelta(days=1), datetime.max.time())
        
        subs = db.query(Subscription).all()
        for sub in subs:
            biz_id = sub.business_id
            
            # Count conversations created yesterday
            conv_count = db.query(func.count(Conversation.id)).filter(
                Conversation.business_id == biz_id,
                Conversation.created_at >= yesterday_start,
                Conversation.created_at <= yesterday_end
            ).scalar() or 0
            
            # Count documents
            doc_count = db.query(func.count(Document.id)).filter(
                Document.business_id == biz_id
            ).scalar() or 0
            
            # Orders created yesterday
            order_count = db.query(func.count(Order.id)).filter(
                Order.business_id == biz_id,
                Order.created_at >= yesterday_start,
                Order.created_at <= yesterday_end
            ).scalar() or 0
            
            snapshot = UsageSnapshot(
                business_id=biz_id,
                date=today - timedelta(days=1),
                conversation_count=conv_count,
                document_count=doc_count,
                order_count=order_count,
                revenue_assisted=0.0 # Hook to actual order values when cart logic exists
            )
            db.add(snapshot)
            
        db.commit()
    except Exception as e:
        logger.error(f"Error generating daily usage snapshots: {e}")
        db.rollback()
    finally:
        db.close()

def retry_failed_webhooks():
    """
    Idempotent job to retry webhook events that failed to process.
    """
    logger.info("Retrying failed webhooks...")
    db = SessionLocal()
    try:
        failed_events = db.query(BillingWebhookEvent).filter(
            BillingWebhookEvent.status == "failed",
            BillingWebhookEvent.retry_count < 3
        ).all()
        
        for event in failed_events:
            # Re-process logic would go here. For now, just increment and mark pending.
            event.retry_count += 1
            event.status = "pending"
            
        db.commit()
    except Exception as e:
        logger.error(f"Error retrying failed webhooks: {e}")
        db.rollback()
    finally:
        db.close()
