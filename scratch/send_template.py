import urllib.request
import json

url = "https://graph.facebook.com/v25.0/1088451004357858/messages"
headers = {
    "Authorization": "Bearer EAAQiUeDJr40BRmo6nxS1tTqaMFPXhZAXWG3PkryKvZBg9F4X1Q5BZAH6KltoBKnat3ny2k3owacQPxfE2nKdfY8bW2kBfADZAtrvh3mD0qnTZAu63StGAZBfGfts6OeoVZCfWaBZAYAphJNWIXBS16wPQ7ZC2nGb3PlsOA5kHRBGv4vlgMTSYBdZBmfuACIVsmv6UcF81Yar5E2AkNI2VTZAYPCEZB3zVwSTZAcZBLCPTkmNdvMKRSnVqiNtJEALcZAqpysgoFawDDPL08IgRZAzQHiJtPwfZAAZDZD",
    "Content-Type": "application/json"
}
data = {
    "messaging_product": "whatsapp",
    "to": "919810218674",
    "type": "template",
    "template": {
        "name": "jaspers_market_order_confirmation_v1",
        "language": { "code": "en_US" },
        "components": [
            {
                "type": "body",
                "parameters": [
                    { "type": "text", "text": "John Doe" },
                    { "type": "text", "text": "123456" },
                    { "type": "text", "text": "May 21, 2026" }
                ]
            }
        ]
    }
}

req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers, method="POST")
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except Exception as e:
    # Print detailed error response if possible
    if hasattr(e, 'read'):
        print(f"ERROR: {e.code} - {e.read().decode()}")
    else:
        print(f"ERROR: {e}")
