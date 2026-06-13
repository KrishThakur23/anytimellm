import logging
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

async def send_instagram_message(business = None, recipient_id: str = "", text: str = "") -> bool:
    """Dispatches an Instagram DM using Meta Graph API, falling back to console mock."""
    instagram_id = recipient_id.replace("instagram:", "").strip()
    provider = "mock"
    if business is not None:
        provider = business.api_settings.get("instagram_provider", "mock")

    if provider == "meta":
        page_id = business.api_settings.get("instagram_page_id") if business else None
        access_token = business.api_settings.get("instagram_access_token") if business else None
        
        # If mock mode or credentials missing, log and return
        if access_token == "EAAQ_MOCK_INSTAGRAM_ACCESS_TOKEN_XYZ" or not page_id or not access_token:
            print(
                f"\n"
                f"=== [MOCK META INSTAGRAM OUTGOING MESSAGE] ===\n"
                f"BUSINESS: {business.name if business else 'UNKNOWN'}\n"
                f"RECIPIENT INSTAGRAM ID: {instagram_id}\n"
                f"BODY: {text}\n"
                f"===============================================\n"
            )
            return True
            
        url = "https://graph.facebook.com/v20.0/me/messages"
        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "recipient": {"id": instagram_id},
            "message": {"text": text}
        }
        params = {
            "access_token": access_token
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, headers=headers, params=params)
                response_data = response.json()
                if response.status_code in (200, 201):
                    logger.info(f"Meta Instagram message sent successfully to {instagram_id}")
                    print(f"[META INSTAGRAM OUTBOX SUCCESS] Message sent to {instagram_id}")
                    return True
                else:
                    logger.error(f"Failed to send Meta Instagram message. Status {response.status_code}: {response.text}")
                    print(f"[META INSTAGRAM OUTBOX ERROR] Status {response.status_code}: {response.text}")
                    return False
            except Exception as e:
                logger.error(f"Exception raised while posting to Meta Graph API for Instagram: {e}")
                print(f"[META INSTAGRAM OUTBOX ERROR] Exception: {e}")
                return False
    else:
        # Default Mock mode
        print(
            f"\n"
            f"=== [MOCK INSTAGRAM OUTGOING MESSAGE] ===\n"
            f"BUSINESS: {business.name if business else 'UNKNOWN'}\n"
            f"RECIPIENT INSTAGRAM ID: {instagram_id}\n"
            f"BODY: {text}\n"
            f"==========================================\n"
        )
        return True
