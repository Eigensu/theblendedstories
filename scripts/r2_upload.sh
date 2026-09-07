#!/usr/bin/env bash
# Upload the rescued Cloudinary assets to the R2 bucket, preserving the
# theblendedstories/<public_id>.<ext> path so URLs only need a host swap.
#
# Usage:
#   scripts/r2_upload.sh [bucket-name]
set -euo pipefail

BUCKET="${1:-theblendedstories-media}"
ASSET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/cloudinary_rescue/assets"
WRANGLER="${WRANGLER_BIN:-npx wrangler}"

content_type() {
  case "${1##*.}" in
    jpg|jpeg) echo "image/jpeg" ;;
    png)      echo "image/png" ;;
    webp)     echo "image/webp" ;;
    avif)     echo "image/avif" ;;
    gif)      echo "image/gif" ;;
    mp4)      echo "video/mp4" ;;
    *)        echo "application/octet-stream" ;;
  esac
}

upload_one() {
  local file="$1"
  local key="${file#"$ASSET_DIR"/}"
  local ct
  ct="$(content_type "$file")"
  $WRANGLER r2 object put "$BUCKET/$key" \
    --file "$file" \
    --content-type "$ct" \
    --cache-control "public, max-age=31536000, immutable" \
    --remote -y >/tmp/r2_upload_last.log 2>&1
  if [ $? -eq 0 ]; then
    echo "ok   $key"
  else
    echo "FAIL $key"
    cat /tmp/r2_upload_last.log
  fi
}
export -f upload_one content_type
export ASSET_DIR BUCKET WRANGLER

find "$ASSET_DIR" -type f | xargs -P 8 -I{} bash -c 'upload_one "$@"' _ {}
