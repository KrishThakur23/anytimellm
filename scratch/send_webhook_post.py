import urllib.request
import json

url = "https://trichonotid-pei-askance.ngrok-free.dev/api/webhooks/whatsapp/7565af2b-0fd9-4668-b4a1-f0adcce945cf"
headers = {
    "Content-Type": "application/json"
}
payload = {
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "1009231178199082",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15556481025",
              "phone_number_id": "1088451004357858"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Krish Thakur"
                },
                "wa_id": "919810218674",
                "user_id": "IN.1410018717833190",
                "country_code": "IN"
              }
            ],
            "messages": [
              {
                "from": "919810218674",
                "from_user_id": "IN.1410018717833190",
                "id": "wamid.HBgMOTE5ODEwMjE4Njc0FQIAEhggQUM4Q0I2MzlGQzA0NDhFOUIwOTJGMjVERTZCRDY3MTMA",
                "timestamp": "1779372805",
                "text": {
                  "body": "Hey"
                },
                "from_logical_id": "95000398405635",
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

req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers, method="POST")
try:
    with urllib.request.urlopen(req) as response:
        print(f"STATUS: {response.code}")
        print(f"RESPONSE: {response.read().decode()}")
except Exception as e:
    if hasattr(e, 'read'):
        print(f"ERROR: {e.code} - {e.read().decode()}")
    else:
        print(f"ERROR: {e}")
