import os
import requests
import sys
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

if not ADMIN_USERNAME:
    print("Error: ADMIN_USERNAME environment variable is missing.")
    sys.exit(1)

if not ADMIN_PASSWORD:
    print("Error: ADMIN_PASSWORD environment variable is missing.")
    sys.exit(1)

print("1. Testing Login...")
res = requests.post(f"{BASE_URL}/auth/login", data={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
if res.status_code != 200:
    print(f"Login failed! {res.status_code} {res.text}")
    sys.exit(1)
token = res.json()["access_token"]
print("Login successful. Token acquired.")

headers = {"Authorization": f"Bearer {token}"}

print("\n2. Testing GET /hero/")
res = requests.get(f"{BASE_URL}/hero/")
if res.status_code != 200:
    print(f"GET /hero/ failed! {res.text}")
    sys.exit(1)
hero_data = res.json()["data"]
print("GET /hero/ successful.")

print("\n3. Testing PUT /hero/")
hero_data["button_text"] = "Get Blended Updated"
res = requests.put(f"{BASE_URL}/hero/", json=hero_data, headers=headers)
if res.status_code != 200:
    print(f"PUT /hero/ failed! {res.text}")
    sys.exit(1)
print("PUT /hero/ successful.")

print("\n4. Testing GET /what-we-cover/")
res = requests.get(f"{BASE_URL}/what-we-cover/")
slides = res.json()["data"]
print(f"GET /what-we-cover/ successful. Found {len(slides)} slides.")

print("\n5. Testing POST /what-we-cover/")
new_slide = {
    "image_url": "test.jpg",
    "caption": "Test Slide",
    "display_order": 99,
    "visibility": True
}
res = requests.post(f"{BASE_URL}/what-we-cover/", json=new_slide, headers=headers)
if res.status_code != 200:
    print(f"POST /what-we-cover/ failed! {res.text}")
    sys.exit(1)
new_id = res.json()["data"]["id"]
print(f"POST /what-we-cover/ successful. New ID: {new_id}")

print("\n6. Testing DELETE /what-we-cover/")
res = requests.delete(f"{BASE_URL}/what-we-cover/{new_id}", headers=headers)
if res.status_code != 200:
    print(f"DELETE /what-we-cover/ failed! {res.text}")
    sys.exit(1)
print("DELETE /what-we-cover/ successful.")

print("\n7. Testing unauthenticated access")
res = requests.put(f"{BASE_URL}/hero/", json=hero_data)
if res.status_code == 401:
    print("Unauthenticated access correctly blocked (401).")
else:
    print(f"Unauthenticated access failed to block! {res.status_code}")
    sys.exit(1)

print("\nAll automated API tests passed successfully!")
