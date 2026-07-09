import urllib.request
import json
import traceback

url = "http://localhost:8000/api/v1/ai/chat"
headers = {"Content-Type": "application/json"}
data = json.dumps({"query": "Hello", "session_id": None}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Body:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("Error Body:", e.read().decode('utf-8'))
except Exception as e:
    traceback.print_exc()
