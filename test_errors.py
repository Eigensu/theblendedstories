import requests
import sys

base_url = 'http://localhost:8000'

def login():
    response = requests.post(f"{base_url}/auth/login", data={"username": "admin", "password": "adminadminadmin"})
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print("Login failed")
        sys.exit(1)

token = login()
headers = {"Authorization": f"Bearer {token}"}

def test_success():
    payload = {
        "title": "Success Article",
        "slug": "success-article",
        "category": "Culture",
        "author": "Jane Doe",
        "author_image": "http://example.com/jane.jpg",
        "author_role": "Editor",
        "hero_image": "http://example.com/hero.jpg",
        "cover_image": "http://example.com/cover.jpg",
        "reading_time": "5 Min Read",
        "publish_date": "2026-07-23",
        "contentBlocks": [],
        "featured": False,
        "display_order": 1,
        "status": "draft"
    }
    r = requests.post(f"{base_url}/articles/", json=payload, headers=headers)
    print("Test Success:", r.status_code, r.json())

def test_validation_error():
    payload = {
        "title": "Validation Error Article",
        "slug": "validation-error-article",
        "category": "Culture",
        "author": "Jane Doe",
        "author_image": "http://example.com/jane.jpg",
        "author_role": "Editor",
        "hero_image": "http://example.com/hero.jpg",
        "cover_image": "http://example.com/cover.jpg",
        "reading_time": "5 Min Read",
        "publish_date": "2026-07-23",
        "contentBlocks": [
            {
                "id": "block-1",
                "type": "invalid_type",
                "content": "Hello"
            }
        ],
        "featured": False,
        "display_order": 1,
        "status": "draft",
        "password": "this_should_be_masked"
    }
    r = requests.post(f"{base_url}/articles/", json=payload, headers=headers)
    print("Test Validation Error:", r.status_code, r.json())

def test_business_error():
    payload = {
        "title": "Success Article",
        "slug": "success-article",
        "category": "Culture",
        "author": "Jane Doe",
        "author_image": "http://example.com/jane.jpg",
        "author_role": "Editor",
        "hero_image": "http://example.com/hero.jpg",
        "cover_image": "http://example.com/cover.jpg",
        "reading_time": "5 Min Read",
        "publish_date": "2026-07-23",
        "contentBlocks": [],
        "featured": False,
        "display_order": 1,
        "status": "draft"
    }
    r = requests.post(f"{base_url}/articles/", json=payload, headers=headers)
    print("Test Business Error:", r.status_code, r.json())

test_success()
test_validation_error()
test_business_error()
