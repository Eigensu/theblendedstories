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

print("\n8. Testing GET /articles/search")

# The search route must be declared above /{slug}; if it regresses below it the
# slug handler swallows the path and answers 404 "Article not found".
res = requests.get(f"{BASE_URL}/articles/search", params={"q": "the"})
if res.status_code != 200:
    print(f"GET /articles/search failed! {res.status_code} {res.text}")
    print("(A 404 here usually means /search slipped below /{slug} in articles.py)")
    sys.exit(1)
results = res.json()["data"]
print(f"GET /articles/search successful. {len(results)} result(s).")

if results:
    missing = [k for k in ("slug", "title", "excerpt", "matched_terms", "score")
               if k not in results[0]]
    if missing:
        print(f"Search result missing expected fields: {missing}")
        sys.exit(1)
    if "contentBlocks" in results[0]:
        print("Search results should not carry contentBlocks (payload bloat).")
        sys.exit(1)
    print("Search result shape is correct.")

# Drafts must never surface publicly.
all_articles = requests.get(f"{BASE_URL}/articles/").json()["data"]
draft_slugs = {a["slug"] for a in all_articles if a.get("status") != "published"}
if draft_slugs:
    leaked = draft_slugs & {r["slug"] for r in results}
    if leaked:
        print(f"Draft articles leaked into search results: {leaked}")
        sys.exit(1)
    print("Draft articles correctly excluded from search.")

res = requests.get(f"{BASE_URL}/articles/search", params={"q": ""})
if res.status_code != 200 or res.json()["data"] != []:
    print(f"Empty query should return an empty list! {res.status_code} {res.text}")
    sys.exit(1)
print("Empty query correctly returns no results.")

# 400, not 422: validation_exception_handler remaps RequestValidationError app-wide.
res = requests.get(f"{BASE_URL}/articles/search", params={"q": "the", "limit": 999})
if res.status_code != 400:
    print(f"Out-of-range limit should be rejected with 400! Got {res.status_code}")
    sys.exit(1)
print("Out-of-range limit correctly rejected.")

# A known slug must still resolve through the sibling route.
if all_articles:
    slug = all_articles[0]["slug"]
    res = requests.get(f"{BASE_URL}/articles/{slug}")
    if res.status_code != 200:
        print(f"GET /articles/{slug} regressed! {res.status_code}")
        sys.exit(1)
    print("Slug lookup still works alongside the search route.")

print("\nAll automated API tests passed successfully!")
