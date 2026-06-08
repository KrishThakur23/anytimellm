import urllib.request
import json
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from app.config import settings
DATABASE_URL = settings.DATABASE_URL

def setup_test_business():
    """Configures the first business in the DB with mock Meta settings for testing."""
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        from app.models import Business
        # Get first business
        biz = db.query(Business).first()
        if not biz:
            print("ERROR: No business found in the database. Please register a workspace first.")
            sys.exit(1)
            
        print(f"Found business: {biz.name} (ID: {biz.id})")
        
        # Inject mock Meta settings
        mock_settings = {
            "whatsapp_provider": "meta",
            "meta_access_token": "EAAQ_MOCK_LONG_LIVED_ACCESS_TOKEN_XYZ",
            "meta_phone_number_id": "1088451004357858",
            "meta_waba_id": "waba_mock_9999888877",
            "meta_display_name": f"{biz.name} (Mock)",
            "wa_verify_token": "anytimellm_verify_token"
        }
        biz.api_settings = {**biz.api_settings, **mock_settings}
        db.commit()
        print(f"Successfully configured test business settings in database for ID: {biz.id}")
        return biz.id
    except Exception as e:
        print(f"ERROR configuring test business: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

def send_mock_meta_webhook():
    """Fires a mock Meta WhatsApp JSON payload at the unified incoming webhook endpoint."""
    url = "http://localhost:8000/api/webhooks/whatsapp/incoming"
    headers = {
        "Content-Type": "application/json"
    }
    
    # Standard Meta incoming message payload structure
    data = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "waba_mock_9999888877",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "15550199",
                                "phone_number_id": "1088451004357858" # Must match test business settings
                            },
                            "contacts": [
                                {
                                    "profile": {
                                        "name": "Verification Tester"
                                    },
                                    "wa_id": "919999999999"
                                }
                            ],
                            "messages": [
                                {
                                    "from": "919999999999",
                                    "id": "wamid.HBgLOTkxOTk5OTk5OTk5OQY=",
                                    "timestamp": "1717234567",
                                    "text": {
                                        "body": "What products do you offer?"
                                    },
                                    "type": "text"
                                }
                            ]
                        },
                        "field": "messages"
                    }
                ]
            }
        ]
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    print(f"\nSending mock webhook payload to {url}...")
    try:
        with urllib.request.urlopen(req) as response:
            response_body = response.read().decode("utf-8")
            print(f"WEBHOOK RESPONSE: {response.code} - {response_body}")
            if response.code == 200 and "accepted" in response_body:
                print("SUCCESS: Webhook receiver successfully processed the multi-tenant routing event!")
            else:
                print("FAILURE: Webhook returned unexpected response.")
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"WEBHOOK ERROR: {e.code} - {e.read().decode('utf-8')}")
        else:
            print(f"WEBHOOK ERROR: {e}")

if __name__ == "__main__":
    setup_test_business()
    send_mock_meta_webhook()
