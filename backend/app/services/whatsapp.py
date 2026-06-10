import logging
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

def split_message(text: str, max_length: int = 1500) -> list[str]:
    """Splits a long message into chunks of at most max_length characters, keeping newlines/paragraphs intact where possible."""
    if len(text) <= max_length:
        return [text]
    
    chunks = []
    lines = text.split("\n")
    current_chunk = []
    current_length = 0
    
    for line in lines:
        line_len = len(line)
        addition = line_len + (1 if current_length > 0 else 0)
        
        if current_length + addition <= max_length:
            current_chunk.append(line)
            current_length += addition
        else:
            if current_chunk:
                chunks.append("\n".join(current_chunk))
                current_chunk = []
                current_length = 0
            
            # If a single line itself is longer than max_length, split it into chunks of max_length
            if len(line) > max_length:
                temp_line = line
                while len(temp_line) > max_length:
                    chunks.append(temp_line[:max_length])
                    temp_line = temp_line[max_length:]
                if temp_line:
                    current_chunk.append(temp_line)
                    current_length = len(temp_line)
            else:
                current_chunk.append(line)
                current_length = len(line)
                
    if current_chunk:
        chunks.append("\n".join(current_chunk))
        
    return chunks

async def send_whatsapp_message(business = None, to_phone: str = "", text: str = "") -> bool:
    """Dispatches a WhatsApp text message using Meta Cloud API, falling back to console mock."""
    provider = "mock"
    if business is not None:
        provider = business.api_settings.get("whatsapp_provider", "mock")

    phone_number = to_phone.replace("whatsapp:", "").strip()

    if provider == "meta":
        phone_id = business.api_settings.get("meta_phone_number_id") if business else None
        access_token = business.api_settings.get("meta_access_token") if business else None
        
        # If mock mode or credentials missing, log and return
        if access_token == "EAAQ_MOCK_LONG_LIVED_ACCESS_TOKEN_XYZ" or not phone_id or not access_token:
            print(
                f"\n"
                f"=== [MOCK META OUTGOING MESSAGE] ===\n"
                f"BUSINESS: {business.name if business else 'UNKNOWN'}\n"
                f"TO: {phone_number}\n"
                f"BODY: {text}\n"
                f"=====================================\n"
            )
            return True
            
        url = f"https://graph.facebook.com/v20.0/{phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {access_token}",
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
                if response.status_code in (200, 201):
                    logger.info(f"Meta WhatsApp message sent successfully to {phone_number}")
                    print(f"[META OUTBOX SUCCESS] Message sent to {phone_number} (Msg ID: {response_data.get('messages', [{}])[0].get('id')})")
                    return True
                else:
                    logger.error(f"Failed to send Meta message. Status {response.status_code}: {response.text}")
                    print(f"[META OUTBOX ERROR] Status {response.status_code}: {response.text}")
                    return False
            except Exception as e:
                logger.error(f"Exception raised while posting to Meta Graph API: {e}")
                print(f"[META OUTBOX ERROR] Exception: {e}")
                return False
    else:
        # Default Mock mode
        print(
            f"\n"
            f"=== [MOCK OUTGOING MESSAGE] ===\n"
            f"BUSINESS: {business.name if business else 'UNKNOWN'}\n"
            f"TO: {phone_number}\n"
            f"BODY: {text}\n"
            f"================================\n"
        )
        return True
