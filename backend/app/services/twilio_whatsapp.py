import logging
import asyncio
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

async def send_whatsapp_message(to_phone: str, text: str) -> bool:
    """Dispatches a WhatsApp text message using Twilio Messages API, falling back to console mock if credentials are not configured."""
    # Standardize recipient phone format (must have whatsapp: prefix for Twilio)
    recipient = to_phone.strip()
    if not recipient.startswith("whatsapp:"):
        recipient = f"whatsapp:{recipient}"
    
    sender = settings.TWILIO_PHONE_NUMBER.strip()
    if sender and not sender.startswith("whatsapp:"):
        sender = f"whatsapp:{sender}"

    chunks = split_message(text, 1500)
    num_chunks = len(chunks)

    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not sender:
        for i, chunk in enumerate(chunks):
            if i > 0:
                await asyncio.sleep(0.5)
            part_suffix = f" (Part {i+1}/{num_chunks})" if num_chunks > 1 else ""
            print(
                f"\n"
                f"=== [MOCK TWILIO OUTGOING MESSAGE{part_suffix}] ===\n"
                f"TO: {recipient}\n"
                f"FROM: {sender if sender else 'MOCK_SENDER'}\n"
                f"BODY: {chunk}\n"
                f"=======================================\n"
            )
        return True

    url = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    auth = (settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

    overall_success = True
    async with httpx.AsyncClient() as client:
        for i, chunk in enumerate(chunks):
            if i > 0:
                await asyncio.sleep(0.5)
            
            data = {
                "To": recipient,
                "From": sender,
                "Body": chunk
            }
            try:
                response = await client.post(url, data=data, auth=auth)
                response_data = response.json()
                part_suffix = f" (Part {i+1}/{num_chunks})" if num_chunks > 1 else ""
                if response.status_code in (200, 201):
                    logger.info(f"Twilio WhatsApp message sent successfully to {recipient}{part_suffix} (SID: {response_data.get('sid')})")
                    print(f"[TWILIO OUTBOX SUCCESS] Message sent to {recipient}{part_suffix} (SID: {response_data.get('sid')})")
                else:
                    logger.error(f"Failed to send Twilio message{part_suffix}. Twilio API status {response.status_code}: {response.text}")
                    print(f"[TWILIO OUTBOX ERROR] Status {response.status_code}: {response.text}")
                    overall_success = False
            except Exception as e:
                part_suffix = f" (Part {i+1}/{num_chunks})" if num_chunks > 1 else ""
                logger.error(f"Exception raised while posting to Twilio API{part_suffix}: {e}")
                print(f"[TWILIO OUTBOX ERROR] Exception{part_suffix}: {e}")
                overall_success = False

    return overall_success
