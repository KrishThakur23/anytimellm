from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
import hashlib
import hmac
import json
import logging

from app.config import settings

logger = logging.getLogger(__name__)

class BillingProvider(ABC):
    """Abstract base class for all billing providers (Stripe, Razorpay, etc.)"""
    
    @abstractmethod
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """Verifies the webhook signature against the raw payload using the provider's secret."""
        pass
        
    @abstractmethod
    def parse_webhook_event(self, payload_dict: dict) -> Tuple[str, str]:
        """Parses the payload and returns the normalized (event_type, external_customer_id/business_id)."""
        pass

class RazorpayProvider(BillingProvider):
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """
        Razorpay webhook signature verification using HMAC-SHA256.
        """
        if not signature or not secret:
            return False
            
        try:
            expected_signature = hmac.new(
                secret.encode('utf-8'),
                payload.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            logger.error(f"Failed to verify Razorpay signature: {e}")
            return False

    def parse_webhook_event(self, payload_dict: dict) -> Tuple[str, str]:
        """
        Extracts Razorpay specific event type and the reference ID (which we use as business_id).
        """
        event_type = payload_dict.get("event", "unknown")
        
        # In Razorpay, notes usually carry custom metadata like business_id
        # Depending on the event, it could be under payload.payment.entity.notes
        try:
            if "payment" in payload_dict.get("payload", {}):
                entity = payload_dict["payload"]["payment"]["entity"]
                notes = entity.get("notes", {})
                business_id = notes.get("business_id", "")
                return event_type, business_id
            
            if "subscription" in payload_dict.get("payload", {}):
                entity = payload_dict["payload"]["subscription"]["entity"]
                notes = entity.get("notes", {})
                business_id = notes.get("business_id", "")
                return event_type, business_id
        except Exception as e:
            logger.error(f"Error parsing Razorpay event: {e}")
            
        return event_type, ""

# Factory to get the active provider
def get_billing_provider(provider_name: str) -> BillingProvider:
    if provider_name.lower() == "razorpay":
        return RazorpayProvider()
    # if provider_name.lower() == "stripe":
    #     return StripeProvider()
    raise ValueError(f"Unsupported billing provider: {provider_name}")
