"""Recover media off a disabled Cloudinary account before it is deleted,
then repoint the database at the Cloudflare R2 copies.

Cloudinary permanently deletes a disabled account's assets 30 days after
disablement, so the order of operations matters:

  1. inventory  - read MongoDB, list every res.cloudinary.com URL the site
                  references. Works even while Cloudinary is fully locked,
                  because the URLs live in our database, not theirs.
  2. probe      - check what Cloudinary still lets us do (delivery, Admin API).
                  Tells you whether you can export without reactivating.
  3. download   - pull every inventoried asset to disk.
  4. migrate    - rewrite every res.cloudinary.com URL found by `inventory`
                  to its cdn.theblendedstories.in equivalent. Dry-run by
                  default; pass --apply to actually write. Only run this
                  after scripts/r2_upload.sh has uploaded every asset.

Usage:
    export MONGODB_URI='...'            # from Railway -> backend -> Variables
    export MONGO_DB_NAME='the_blended_stories'
    python3 scripts/cloudinary_rescue.py inventory
    python3 scripts/cloudinary_rescue.py probe      # needs CLOUDINARY_* vars
    python3 scripts/cloudinary_rescue.py download
    python3 scripts/cloudinary_rescue.py migrate            # dry run
    python3 scripts/cloudinary_rescue.py migrate --apply     # writes + backs up
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from base64 import b64encode
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from pymongo import MongoClient

OUT_DIR = Path(__file__).resolve().parent.parent / "cloudinary_rescue"
MANIFEST = OUT_DIR / "manifest.json"
ASSET_DIR = OUT_DIR / "assets"
BACKUP_DIR = Path(__file__).resolve().parent.parent / "backups"

R2_PUBLIC_URL = "https://cdn.theblendedstories.in"

CLOUDINARY_URL_RE = re.compile(r"https?://res\.cloudinary\.com/[^\s\"'<>\\)]+")

# https://res.cloudinary.com/<cloud>/<type>/upload/<transformations>/v<ver>/<public_id>.<ext>
DELIVERY_RE = re.compile(
    r"https?://res\.cloudinary\.com/(?P<cloud>[^/]+)/(?P<resource>image|video|raw)"
    r"/(?P<delivery>upload|fetch|private|authenticated)/(?P<rest>.+)$"
)


def env(name, default=None, required=False):
    value = os.getenv(name, default)
    if required and not value:
        sys.exit(f"error: {name} is not set. Copy it out of Railway -> backend -> Variables.")
    return value


def parse_public_id(url):
    """Split a delivery URL into (public_id, extension), dropping transformations.

    Cloudinary puts an optional transformation segment and an optional v<digits>
    version segment between the delivery type and the public_id. Neither is part
    of the public_id, so both have to go before we can call the Admin API.
    """
    match = DELIVERY_RE.match(url.split("?")[0])
    if not match:
        return None, None

    parts = match.group("rest").split("/")

    # A leading transformation segment is a comma-joined list of <key>_<value>
    # pairs. Folder names effectively never look like that, so this is safe.
    if parts and "," in parts[0] and re.fullmatch(r"[a-z]{1,3}_[^/]+(,[a-z]{1,3}_[^/]+)+", parts[0]):
        parts = parts[1:]
    if parts and re.fullmatch(r"v\d+", parts[0]):
        parts = parts[1:]

    if not parts:
        return None, None

    tail = "/".join(parts)
    stem, dot, ext = tail.rpartition(".")
    if not dot:
        return tail, ""
    return stem, ext


def walk(node, path=""):
    """Yield (json_path, url) for every Cloudinary URL nested anywhere in a doc."""
    if isinstance(node, str):
        for url in CLOUDINARY_URL_RE.findall(node):
            yield path, url
    elif isinstance(node, dict):
        for key, value in node.items():
            yield from walk(value, f"{path}.{key}" if path else str(key))
    elif isinstance(node, list):
        for index, value in enumerate(node):
            yield from walk(value, f"{path}[{index}]")


def connect():
    """Open a MongoDB connection, failing with something readable.

    `railway run` injects Railway's variables but executes locally, so the
    connection originates from this machine's IP rather than Railway's egress.
    Atlas rejects a non-allowlisted IP with a TLS alert that reads like a
    certificate problem, which sends people down the wrong path entirely.
    """
    import certifi
    from pymongo.errors import PyMongoError

    client = MongoClient(
        env("MONGODB_URI", required=True),
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=15000,
    )
    try:
        client.admin.command("ping")
    except PyMongoError as error:
        detail = str(error)
        hint = ""
        if "TLSV1_ALERT_INTERNAL_ERROR" in detail or "SSL handshake failed" in detail:
            hint = (
                "\n\nThis is almost certainly the Atlas IP access list, not TLS.\n"
                "Atlas -> Network Access -> Add IP Address -> Add Current IP Address.\n"
                "Remember `railway run` executes locally, so your own IP connects,\n"
                "not Railway's."
            )
        sys.exit(f"error: could not reach MongoDB.\n{detail[:400]}{hint}")
    return client


def cmd_inventory():
    client = connect()
    db = client[env("MONGO_DB_NAME", "the_blended_stories")]

    references = []
    for name in sorted(db.list_collection_names()):
        for doc in db[name].find({}):
            doc_id = str(doc.get("_id"))
            for field, url in walk(doc):
                if field == "_id":
                    continue
                public_id, ext = parse_public_id(url)
                references.append(
                    {
                        "collection": name,
                        "doc_id": doc_id,
                        "field": field,
                        "url": url,
                        "public_id": public_id,
                        "ext": ext,
                    }
                )

    unique = sorted({ref["url"] for ref in references})
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        json.dumps({"references": references, "unique_urls": unique}, indent=2)
    )

    by_collection = {}
    for ref in references:
        by_collection[ref["collection"]] = by_collection.get(ref["collection"], 0) + 1

    print(f"{len(references)} references across {len(by_collection)} collections")
    for name, count in sorted(by_collection.items(), key=lambda kv: -kv[1]):
        print(f"  {count:5d}  {name}")
    print(f"\n{len(unique)} unique assets to recover")
    print(f"manifest -> {MANIFEST}")


def cmd_probe():
    cloud = env("CLOUDINARY_CLOUD_NAME", required=True)
    key = env("CLOUDINARY_API_KEY", required=True)
    secret = env("CLOUDINARY_API_SECRET", required=True)

    if not MANIFEST.exists():
        sys.exit("error: run `inventory` first.")
    unique = json.loads(MANIFEST.read_text())["unique_urls"]

    print("1. Direct delivery (public URL):")
    if unique:
        print(f"   {status_of(unique[0])}  {unique[0][:90]}")
    else:
        print("   no assets in manifest")

    print("2. Admin API (list resources):")
    auth = b64encode(f"{key}:{secret}".encode()).decode()
    request = urllib.request.Request(
        f"https://api.cloudinary.com/v1_1/{cloud}/resources/image?max_results=1",
        headers={"Authorization": f"Basic {auth}"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = json.loads(response.read())
            print(f"   200  Admin API is ALIVE - {len(body.get('resources', []))} sample resource(s)")
            print("   -> you can export everything for free, no upgrade needed.")
            return
    except urllib.error.HTTPError as error:
        print(f"   {error.code}  Admin API blocked ({error.reason})")

    print("\n   -> Cloudinary is fully locked. Free options, in order:")
    print("      a. Log in at console.cloudinary.com and try the Media Library's")
    print("         bulk Download action - the UI sometimes still works.")
    print("      b. Email support@cloudinary.com and ask for a temporary")
    print("         reactivation window to export before you migrate off.")
    print("      c. Last resort: one month of a paid plan, export, cancel.")


# Every character a Cloudinary path segment legitimately uses: public_ids are
# alphanumeric, folders add separators, and a transformation segment joins its
# pairs with commas. Notably absent are '%', ':' and anything that could smuggle
# a second host or escape the path.
_SAFE_SEGMENT = re.compile(r"[A-Za-z0-9_,.-]+")


def assert_fetchable(url):
    """Return a URL rebuilt from validated parts, or raise.

    Every URL here originates in MongoDB, so it is untrusted input. urlopen
    honours file:// and will happily reach link-local addresses, which would
    turn a poisoned record into a local file read or an SSRF against internal
    metadata endpoints.

    Checking the scheme and host is not enough on its own: the path still
    carries whatever was stored. So nothing from the input is passed through —
    the scheme and host are literals, and each path segment has to match the
    allowlist before it is joined back together.
    """
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != "res.cloudinary.com":
        raise ValueError(f"refusing non-Cloudinary URL: {url[:80]}")

    segments = [segment for segment in parsed.path.split("/") if segment]
    # '.' and '..' match the allowlist since dots are legal inside a public_id,
    # so exclude them by name rather than by pattern.
    if not segments or any(s in (".", "..") for s in segments):
        raise ValueError(f"refusing URL with relative path: {url[:80]}")
    if not all(_SAFE_SEGMENT.fullmatch(s) for s in segments):
        raise ValueError(f"refusing URL with unexpected path: {url[:80]}")

    return "https://res.cloudinary.com/" + "/".join(segments)


def status_of(url):
    request = urllib.request.Request(assert_fetchable(url), method="HEAD")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code
    except Exception:
        return "ERR"


def cmd_download():
    if not MANIFEST.exists():
        sys.exit("error: run `inventory` first.")
    unique = json.loads(MANIFEST.read_text())["unique_urls"]
    ASSET_DIR.mkdir(parents=True, exist_ok=True)

    saved, failed, total_bytes = 0, [], 0
    for index, url in enumerate(unique, 1):
        public_id, ext = parse_public_id(url)
        if not public_id:
            failed.append((url, "unparseable"))
            continue

        # Mirror the public_id folder structure so the R2 upload can reuse it
        # verbatim and keep the same paths.
        target = ASSET_DIR / f"{public_id}.{ext}" if ext else ASSET_DIR / public_id
        if target.exists() and target.stat().st_size > 0:
            saved += 1
            total_bytes += target.stat().st_size
            continue
        target.parent.mkdir(parents=True, exist_ok=True)

        try:
            with urllib.request.urlopen(assert_fetchable(url), timeout=60) as response:
                payload = response.read()
            target.write_bytes(payload)
            saved += 1
            total_bytes += len(payload)
            print(f"[{index}/{len(unique)}] ok   {len(payload) / 1e6:6.2f} MB  {public_id}")
        except Exception as error:
            failed.append((url, str(error)))
            print(f"[{index}/{len(unique)}] FAIL {public_id}: {error}")
        time.sleep(0.1)

    gigabytes = total_bytes / 1e9
    print(f"\nsaved {saved}/{len(unique)} into {ASSET_DIR}")
    print(f"total size: {gigabytes:.2f} GB")
    # R2's free tier covers 10 GB of storage; beyond that it is $0.015/GB-month.
    if gigabytes <= 10:
        print(f"-> fits R2's 10 GB free tier ({gigabytes / 10 * 100:.0f}% of it). Storage cost: $0.00/mo")
    else:
        print(f"-> {gigabytes - 10:.2f} GB over R2's free tier = ${(gigabytes - 10) * 0.015:.2f}/mo")

    if failed:
        (OUT_DIR / "failed.json").write_text(json.dumps(failed, indent=2))
        print(f"{len(failed)} failures -> {OUT_DIR / 'failed.json'}")


def _substitute(node, url_map, misses):
    """Return a deep copy of `node` with every mapped Cloudinary URL rewritten.

    Uses regex substitution rather than exact-match so a URL embedded inside
    a longer string (e.g. markdown body text) is still caught, matching how
    the URLs were originally found by `inventory`.
    """
    if isinstance(node, str):
        def replace(match):
            old = match.group(0)
            new = url_map.get(old)
            if new is None:
                misses.add(old)
                return old
            return new

        return CLOUDINARY_URL_RE.sub(replace, node)
    if isinstance(node, dict):
        return {key: _substitute(value, url_map, misses) for key, value in node.items()}
    if isinstance(node, list):
        return [_substitute(value, url_map, misses) for value in node]
    return node


def cmd_migrate():
    if not MANIFEST.exists():
        sys.exit("error: run `inventory` first.")
    apply = "--apply" in sys.argv[2:]

    references = json.loads(MANIFEST.read_text())["references"]
    url_map = {}
    for ref in references:
        if ref["public_id"] and ref["ext"]:
            url_map[ref["url"]] = f"{R2_PUBLIC_URL}/{ref['public_id']}.{ref['ext']}"

    client = connect()
    db = client[env("MONGO_DB_NAME", "the_blended_stories")]

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_dir = BACKUP_DIR / stamp
    misses = set()
    docs_changed = 0
    urls_rewritten = 0

    for name in sorted(db.list_collection_names()):
        collection_changed = 0
        backup_lines = []
        for doc in db[name].find({}):
            new_doc = _substitute(doc, url_map, misses)
            if new_doc == doc:
                continue
            collection_changed += 1
            urls_rewritten += sum(
                1 for _, url in walk(doc) if url in url_map
            )
            if apply:
                backup_lines.append(json.dumps(doc, default=str))
                db[name].replace_one({"_id": doc["_id"]}, new_doc)

        if collection_changed:
            docs_changed += collection_changed
            print(f"{'rewrote' if apply else 'would rewrite'} {collection_changed} doc(s) in {name}")
            if apply and backup_lines:
                backup_dir.mkdir(parents=True, exist_ok=True)
                (backup_dir / f"{name}.jsonl").write_text("\n".join(backup_lines) + "\n")

    print(f"\n{docs_changed} document(s) {'rewritten' if apply else 'would be rewritten'}, "
          f"{urls_rewritten} URL occurrence(s) {'replaced' if apply else 'would be replaced'}")
    if misses:
        print(f"\n{len(misses)} Cloudinary URL(s) found in the DB with no R2 mapping "
              f"(not in manifest.json, or missing public_id/ext) -- left unchanged:")
        for url in sorted(misses)[:20]:
            print(f"  {url}")

    if apply and docs_changed:
        print(f"\noriginal documents backed up -> {backup_dir}")
    elif not apply and docs_changed:
        print("\ndry run only -- pass --apply to write these changes")


COMMANDS = {
    "inventory": cmd_inventory,
    "probe": cmd_probe,
    "download": cmd_download,
    "migrate": cmd_migrate,
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        sys.exit(f"usage: {sys.argv[0]} {{{'|'.join(COMMANDS)}}} [--apply]")
    COMMANDS[sys.argv[1]]()
