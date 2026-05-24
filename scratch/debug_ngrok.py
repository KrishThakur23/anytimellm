import urllib.request
import json

try:
    with urllib.request.urlopen("http://127.0.0.1:4040/api/requests/http") as response:
        data = json.loads(response.read().decode())
        requests = data.get("requests", [])
        if requests:
            # print the first request completely formatted as JSON to inspect fields
            print(json.dumps(requests[0], indent=2))
        else:
            print("No requests found.")
except Exception as e:
    print(f"Error: {e}")
