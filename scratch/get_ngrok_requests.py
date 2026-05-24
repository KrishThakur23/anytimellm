import urllib.request
import json

try:
    with urllib.request.urlopen("http://127.0.0.1:4040/api/requests/http") as response:
        data = json.loads(response.read().decode())
        requests = data.get("requests", [])
        if not requests:
            print("NO_REQUESTS")
        for req in requests:
            req_info = req.get("request", {})
            resp_info = req.get("response", {})
            user_agent = req_info.get("headers", {}).get("User-Agent", [""])[0]
            print(f"Time: {req.get('start')} | Method: {req_info.get('method')} | URI: {req_info.get('uri')} | Status: {resp_info.get('status')} | UA: {user_agent}")
except Exception as e:
    print(f"ERROR: {e}")
