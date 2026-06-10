import urllib.request
import json

try:
    with urllib.request.urlopen("http://127.0.0.1:4040/api/tunnels") as response:
        data = json.loads(response.read().decode())
        tunnels = data.get("tunnels", [])
        if tunnels:
            for t in tunnels:
                if t.get("proto") == "https":
                    print(f"ACTIVE HTTPS TUNNEL: {t.get('public_url')}")
                    print(f"WhatsApp Webhook URL: {t.get('public_url')}/api/webhooks/whatsapp/incoming")
        else:
            print("No active ngrok tunnels found. Please start ngrok locally using: ngrok http 8000")
except Exception as e:
    print(f"Error querying ngrok. Is ngrok running? Details: {e}")
