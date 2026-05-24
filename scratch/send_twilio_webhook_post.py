import urllib.request
import urllib.parse

# Local URL for testing backend processing
url = "http://localhost:8000/api/webhooks/whatsapp/7565af2b-0fd9-4668-b4a1-f0adcce945cf"

headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

payload = {
    "MessageSid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "Body": "Hello, do you have any shoes in stock?",
    "From": "whatsapp:+919810218674",
    "To": "whatsapp:+14155238886",
    "ProfileName": "Krish Thakur",
    "AccountSid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "SmsStatus": "received"
}

data = urllib.parse.urlencode(payload).encode("utf-8")
req = urllib.request.Request(url, data=data, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        print(f"STATUS: {response.code}")
        print(f"RESPONSE: {response.read().decode()}")
except Exception as e:
    if hasattr(e, 'read'):
        print(f"ERROR: {e.code} - {e.read().decode()}")
    else:
        print(f"ERROR: {e}")
