import logging
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

async def send_whatsapp_message(to_phone: str, text: str) -> bool:
    """Dispatches a WhatsApp text message using Twilio Messages API, falling back to console mock if credentials are not configured."""
    # Standardize recipient phone format (must have whatsapp: prefix for Twilio)
    recipient = to_phone.strip()
    if not recipient.startswith("whatsapp:"):
        recipient = f"whatsapp:{recipient}"
    
    sender = settings.TWILIO_PHONE_NUMBER.strip()
    if sender and not sender.startswith("whatsapp:"):
        sender = f"whatsapp:{sender}"

    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not sender:
        print(
            f"\n"
            f"=== [MOCK TWILIO OUTGOING MESSAGE] ===\n"
            f"TO: {recipient}\n"
            f"FROM: {sender if sender else 'MOCK_SENDER'}\n"
            f"BODY: {text}\n"
            f"=======================================\n"
        )
        return True

    url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    auth = (settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    data = {
        "To": recipient,
        "From": sender,
        "Body": text
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, data=data, auth=auth)
            response_data = response.json()
            if response.status_code in (200, 201):
                logger.info(f"Twilio WhatsApp message sent successfully to {recipient} (SID: {response_data.get('sid')})")
                print(f"[TWILIO OUTBOX SUCCESS] Message sent to {recipient} (SID: {response_data.get('sid')})")
                return True
            else:
                logger.error(f"Failed to send Twilio message. Twilio API status {response.status_code}: {response.text}")
                print(f"[TWILIO OUTBOX ERROR] Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Exception raised while posting to Twilio API: {e}")
            print(f"[TWILIO OUTBOX ERROR] Exception: {e}")
            return False
