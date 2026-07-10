import urllib.request
import json
import traceback

url = "https://aivora-lac.vercel.app/api/v1/ai/chat"
headers = {"Content-Type": "application/json"}
data = json.dumps({"query": "Hello, tell me what Aivora does.", "session_id": None}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers=headers)
try:
    print(f"Connecting to {url}...")
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Response Headers:")
        for k, v in response.headers.items():
            print(f"{k}: {v}")
        print("\nReading Stream:")
        
        chunk_count = 0
        while True:
            chunk = response.read(1024)
            if not chunk:
                break
            chunk_count += 1
            print(chunk.decode('utf-8'), end="")
        print(f"\n[Finished reading {chunk_count} chunks]")
        
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    try:
        print("Error Body:", e.read().decode('utf-8'))
    except:
        pass
except Exception as e:
    traceback.print_exc()
