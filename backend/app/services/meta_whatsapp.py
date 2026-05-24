import logging
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

async def send_whatsapp_message(to_phone: str, text: str) -> bool:
    """Dispatches a WhatsApp text message to Meta Graph API, falling back to console mock if credentials are not configured."""
    # Standardize recipient phone format (remove prefix whatsapp: if stored)
    phone_number = to_phone.replace("whatsapp:", "").strip()
    
    if not settings.META_WA_ACCESS_TOKEN or not settings.META_WA_PHONE_NUMBER_ID:
        logger.info(
            f"\n"
            f"=== [MOCK WHATSAPP OUTGOING MESSAGE] ===\n"
            f"TO: {phone_number}\n"
            f"BODY: {text}\n"
            f"=========================================\n"
        )
        return True

    url = f"https://graph.facebook.com/v18.0/{settings.META_WA_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.META_WA_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone_number,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": text
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response_data = response.json()
            if response.status_code == 200:
                logger.info(f"WhatsApp message sent successfully to {phone_number} (Msg ID: {response_data.get('messages', [{}])[0].get('id')})")
                return True
            else:
                logger.error(f"Failed to send WhatsApp message. Meta API status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Exception raised while posting to Meta WhatsApp Graph API: {e}")
            return False
