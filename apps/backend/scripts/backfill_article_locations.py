"""One-off backfill: set location_main/location_sub on existing articles.

Every article filed before the location taxonomy existed defaults to India /
Mumbai — the only region/city shipped in DEFAULT_LOCATION_REGIONS today. Only
touches active articles that don't already have a location set, so re-running
after an editor has filed real locations won't clobber their work.

Dry-run by default — prints what it would change without writing:

    python scripts/backfill_article_locations.py
    python scripts/backfill_article_locations.py --apply
"""

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.schemas.location import DEFAULT_LOCATION_MAIN, DEFAULT_LOCATION_SUB


async def main(apply: bool) -> None:
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    collection = client[settings.MONGO_DB_NAME]["articles"]

    query = {
        "is_active": True,
        "$or": [
            {"location_main": {"$exists": False}},
            {"location_main": None},
        ],
    }

    matches = await collection.find(query, {"title": 1, "slug": 1}).to_list(length=None)

    if not matches:
        print("No articles need backfilling.")
        client.close()
        return

    print(f"{'Would update' if not apply else 'Updating'} {len(matches)} article(s) "
          f"to location_main={DEFAULT_LOCATION_MAIN!r}, location_sub={DEFAULT_LOCATION_SUB!r}:")
    for item in matches:
        print(f"  - {item.get('slug')} ({item.get('title')})")

    if not apply:
        print("\nDry run only — pass --apply to write these changes.")
        client.close()
        return

    result = await collection.update_many(
        query,
        {"$set": {"location_main": DEFAULT_LOCATION_MAIN, "location_sub": DEFAULT_LOCATION_SUB}},
    )
    print(f"\nUpdated {result.modified_count} article(s).")
    client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write changes (default is dry-run)")
    args = parser.parse_args()
    asyncio.run(main(args.apply))
