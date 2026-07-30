"""HTTP tests for the /menu/ routes using FastAPI's TestClient.

The repository is stubbed with an in-memory singleton, so this needs neither
MongoDB nor a running server. It exercises the real router and the real
normalization, including the admin auth dependency.

    python tests/test_menu_api.py
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# app.config requires these; the values are irrelevant here.
os.environ.setdefault("ADMIN_PASSWORD", "x" * 12)
os.environ.setdefault("SECRET_KEY", "y" * 32)

from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.exceptions import RequestValidationError

from app.auth import get_current_admin
from app.routers import menu as menu_router
from app.services import menu_service
from app.utils.exceptions import validation_exception_handler

# In-memory stand-in for the `menu` singleton. Stubbed at the repository boundary
# so the real service — slug minting, ordering, the defaults fallback — runs.
_stored: dict = {}


async def fake_get_singleton():
    return dict(_stored) if _stored else None


async def fake_update_singleton(data: dict):
    _stored.clear()
    _stored.update(data)
    return dict(_stored)


menu_service.repo.get_singleton = fake_get_singleton
menu_service.repo.update_singleton = fake_update_singleton

app = FastAPI()
# Mirror main.py: validation errors are remapped to 400 app-wide, so the status
# codes asserted below match what the deployed API actually returns.
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.include_router(menu_router.router)
# The PUT is admin-only; this test is about the taxonomy, not the JWT.
app.dependency_overrides[get_current_admin] = lambda: {"username": "admin"}

client = TestClient(app)

failures = 0


def check(label, condition, detail=""):
    global failures
    print(f"{'PASS' if condition else 'FAIL'}  {label} {detail}")
    if not condition:
        failures += 1


# --- cold database ---------------------------------------------------------

response = client.get("/menu/")
check("200 OK", response.status_code == 200, response.status_code)

payload = response.json()
check("success envelope", payload.get("success") is True)

sections = payload["data"]["sections"]
check("a cold database serves the shipped taxonomy", len(sections) == 7, len(sections))
check("sections carry slugs, labels and items",
      all(s.get("slug") and s.get("label") and s.get("items") for s in sections))
check("Fashion ships with its five words",
      len(sections[0]["items"]) == 5, len(sections[0]["items"]))


# --- saving ----------------------------------------------------------------

response = client.put("/menu/", json={
    "sections": [
        {
            "slug": "fashion",
            "label": "Style",  # renamed
            "items": [
                {"slug": "bridal", "label": "Weddings"},  # renamed
                {"label": "Menswear"},                    # brand new
            ],
        },
        {"label": "Food & Drink", "items": [{"label": "Cafés"}]},
    ]
})
check("PUT returns 200", response.status_code == 200, response.status_code)

saved = response.json()["data"]["sections"]
check("both sections saved", len(saved) == 2, len(saved))
check("renaming a section preserves its slug", saved[0]["slug"] == "fashion",
      saved[0]["slug"])
check("renaming a section updates its label", saved[0]["label"] == "Style")
check("renaming a word preserves its slug", saved[0]["items"][0]["slug"] == "bridal",
      saved[0]["items"][0]["slug"])
check("a new word is slugged from its label",
      saved[0]["items"][1]["slug"] == "menswear", saved[0]["items"][1]["slug"])
check("a new section is slugged from its label",
      saved[1]["slug"] == "food-and-drink", saved[1]["slug"])
check("accented labels slug to ASCII",
      saved[1]["items"][0]["slug"] == "cafes", saved[1]["items"][0]["slug"])
check("menu_title is filled in from the label",
      saved[0]["menu_title"] == "STYLE", saved[0]["menu_title"])


# --- reading back ----------------------------------------------------------

response = client.get("/menu/")
reread = response.json()["data"]["sections"]
check("GET now returns the saved menu, not the defaults", len(reread) == 2,
      len(reread))
check("order is preserved as saved",
      [s["slug"] for s in reread] == ["fashion", "food-and-drink"],
      [s["slug"] for s in reread])

# Re-saving what was just read must be a no-op. If it were not, every save would
# drift the slugs and quietly unfile articles.
response = client.put("/menu/", json={"sections": reread})
check("re-saving an untouched menu changes nothing",
      response.json()["data"]["sections"] == reread)


# --- emptying --------------------------------------------------------------

response = client.put("/menu/", json={"sections": []})
check("an emptied menu saves", response.json()["data"]["sections"] == [])

response = client.get("/menu/")
check("an emptied menu does not spring back to the defaults",
      response.json()["data"]["sections"] == [],
      response.json()["data"]["sections"])


# --- bad input -------------------------------------------------------------

response = client.put("/menu/", json={"sections": [{"items": []}]})
check("a section with no label is rejected with 400",
      response.status_code == 400, response.status_code)

print("\nAll menu API tests passed." if not failures else f"\n{failures} test(s) failed.")
sys.exit(1 if failures else 0)
