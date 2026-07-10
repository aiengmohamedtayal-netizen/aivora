import urllib.request
import time

url = "https://aivora-lac.vercel.app/api/v1/health"

for i in range(20):
    try:
        print(f"Checking {url} (Attempt {i+1})...")
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode('utf-8')
            print(f"Status: {status}, Body: {body}")
            if status == 200 and "healthy" in body:
                print("Production deployment is live and healthy!")
                break
    except Exception as e:
        print(f"Error: {e}")
    
    time.sleep(10)
