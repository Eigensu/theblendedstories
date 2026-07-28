"""Auth-scope and newsletter tests for the member routes.

The database and the Google exchange are both stubbed, so this needs neither
MongoDB nor network access. The point of most of it is one property: admin
tokens and member tokens are signed with the same secret, so only the `scope`
claim separates a CMS operator from a signed-in reader.

    python tests/test_member_auth.py
"""

import asyncio
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault("ADMIN_PASSWORD", "x" * 12)
os.environ.setdefault("SECRET_KEY", "y" * 32)
os.environ.setdefault("ADMIN_USERNAME", "admin")

from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.exceptions import RequestValidationError

from app import auth
from app.routers import members, newsletter
from app.services import google_oauth, member_service, newsletter_service
from app.utils.exceptions import validation_exception_handler


# --- In-memory stand-in for the two collections ---------------------------

class FakeRepo:
    def __init__(self):
        self.docs = {}
        self._next = 1

    async def find_one_by(self, query):
        for doc in self.docs.values():
            if all(doc.get(k) == v for k, v in query.items()):
                return dict(doc)
        return None

    async def find_many(self, query=None, sort_field="created_at", descending=True):
        return [dict(d) for d in self.docs.values()]

    async def update_one_by(self, query, data):
        for doc_id, doc in self.docs.items():
            if all(doc.get(k) == v for k, v in query.items()):
                self.docs[doc_id] = {**doc, **data}
                return True
        return False

    async def create(self, data):
        doc_id = str(self._next)
        self._next += 1
        self.docs[doc_id] = {**data, "id": doc_id, "is_active": True}
        return dict(self.docs[doc_id])

    async def get_by_id(self, doc_id):
        doc = self.docs.get(doc_id)
        return dict(doc) if doc else None

    async def update(self, doc_id, data):
        if doc_id in self.docs:
            self.docs[doc_id] = {**self.docs[doc_id], **data}
        return await self.get_by_id(doc_id)


member_service.repo = FakeRepo()
newsletter_service.repo = FakeRepo()

GOOGLE_PROFILE = {
    "sub": "google-oauth2|12345",
    "email": "Reader@Example.com",
    "name": "A Reader",
    "picture": "https://lh3.googleusercontent.com/a/abc",
}


async def fake_profile_from_code(code: str):
    if code != "good-code":
        raise google_oauth.GoogleAuthError("invalid_grant")
    return dict(GOOGLE_PROFILE)


google_oauth.profile_from_code = fake_profile_from_code

app = FastAPI()
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.include_router(members.router)
app.include_router(newsletter.router)

client = TestClient(app)

failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


def bearer(token):
    return {"Authorization": f"Bearer {token}"}


# --- Sign-in --------------------------------------------------------------

response = client.post("/members/auth/google", json={"code": "good-code"})
check("google sign-in returns 200", response.status_code == 200, response.status_code)

payload = response.json()
check("success envelope", payload.get("success") is True)

data = payload["data"]
member_access = data["access_token"]
member_refresh = data["refresh_token"]

check("returns an access token", bool(member_access))
check("email is normalized to lowercase",
      data["user"]["email"] == "reader@example.com", data["user"]["email"])
check("google_sub is never sent to the browser", "google_sub" not in data["user"])
check("subscribed to the newsletter on sign-up",
      data["user"]["newsletter_subscribed"] is True)

response = client.post("/members/auth/google", json={"code": "bad-code"})
check("a bad code is a 400, not a 500", response.status_code == 400, response.status_code)
check("google's error text is not leaked to the client",
      "invalid_grant" not in response.text, response.text)

response = client.post("/members/auth/google", json={})
check("missing code is rejected with 400", response.status_code == 400, response.status_code)


# A server with no Google credentials is an operator problem, not a bad request.
async def unconfigured(code: str):
    raise google_oauth.GoogleNotConfigured("no client id")


google_oauth.profile_from_code = unconfigured
response = client.post("/members/auth/google", json={"code": "good-code"})
check("unconfigured server returns 503, not 400", response.status_code == 503,
      response.status_code)
google_oauth.profile_from_code = fake_profile_from_code


# --- Signing in twice must not create a second member ---------------------

before = len(member_service.repo.docs)
client.post("/members/auth/google", json={"code": "good-code"})
check("signing in again reuses the same member record",
      len(member_service.repo.docs) == before, len(member_service.repo.docs))


# --- Scope separation: the whole point ------------------------------------

admin_access = auth.create_access_token({"sub": "admin"})

response = client.get("/members/", headers=bearer(admin_access))
check("admin token can list members", response.status_code == 200, response.status_code)

response = client.get("/members/", headers=bearer(member_access))
check("MEMBER TOKEN CANNOT list members", response.status_code == 401, response.status_code)

response = client.get("/newsletter/subscribers", headers=bearer(member_access))
check("MEMBER TOKEN CANNOT read the subscriber list",
      response.status_code == 401, response.status_code)

response = client.get("/newsletter/subscribers", headers=bearer(admin_access))
check("admin token can read the subscriber list",
      response.status_code == 200, response.status_code)

response = client.get("/newsletter/subscribers")
check("no token is rejected", response.status_code == 401, response.status_code)

response = client.get("/members/me", headers=bearer(admin_access))
check("ADMIN TOKEN CANNOT pose as a member", response.status_code == 401, response.status_code)

response = client.get("/members/me", headers=bearer(member_access))
check("member token reads its own profile", response.status_code == 200, response.status_code)

# A refresh token must never be usable as an access token.
response = client.get("/members/me", headers=bearer(member_refresh))
check("refresh token is not accepted as an access token",
      response.status_code == 401, response.status_code)

# Legacy admin tokens predate the scope claim and must keep working.
legacy_admin = auth.jwt.encode(
    {"sub": "admin", "type": "access", "exp": auth.datetime.utcnow() + auth.timedelta(minutes=5)},
    auth.settings.JWT_SECRET,
    algorithm=auth.settings.JWT_ALGORITHM,
)
response = client.get("/members/", headers=bearer(legacy_admin))
check("admin token issued before scopes existed still works",
      response.status_code == 200, response.status_code)


# --- Refresh --------------------------------------------------------------

response = client.post("/members/auth/refresh", json={"refresh_token": member_refresh})
check("member refresh returns a new token", response.status_code == 200, response.status_code)

response = client.post("/members/auth/refresh", json={"refresh_token": member_access})
check("an access token cannot be used to refresh",
      response.status_code == 401, response.status_code)

admin_refresh = auth.create_refresh_token({"sub": "admin"})
response = client.post("/members/auth/refresh", json={"refresh_token": admin_refresh})
check("an ADMIN refresh token cannot mint a member session",
      response.status_code == 401, response.status_code)


# --- Newsletter -----------------------------------------------------------

response = client.post("/newsletter/subscribe", json={"email": "New@Person.com"})
check("public subscribe returns 200", response.status_code == 200, response.status_code)

count_after_first = len(newsletter_service.repo.docs)
client.post("/newsletter/subscribe", json={"email": "new@person.com"})
check("subscribing twice does not duplicate (case-insensitive)",
      len(newsletter_service.repo.docs) == count_after_first,
      len(newsletter_service.repo.docs))

response = client.post("/newsletter/subscribe", json={"email": "not-an-email"})
check("a malformed email is rejected with 400", response.status_code == 400,
      response.status_code)

subscribers = client.get("/newsletter/subscribers", headers=bearer(admin_access)).json()["data"]
sources = {s["email"]: s["source"] for s in subscribers}
check("google sign-up is recorded with its own source",
      sources.get("reader@example.com") == "google_signup", sources)
check("popup signup is recorded with its own source",
      sources.get("new@person.com") == "popup", sources)


# --- Unsubscribing is not undone by signing in again ----------------------

async def scenario():
    await member_service.set_newsletter_subscribed("1", False)
    await member_service.upsert_from_google(dict(GOOGLE_PROFILE))
    return await member_service.get_by_id("1")


user = asyncio.run(scenario())
check("signing in again does not silently re-subscribe an opted-out member",
      user["newsletter_subscribed"] is False, user["newsletter_subscribed"])


print()
if failures:
    print(f"{failures} check(s) failed")
    sys.exit(1)
print("All member auth checks passed")
