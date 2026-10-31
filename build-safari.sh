#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SOURCE_DIR="$SCRIPT_DIR/OmniTools - Safari"
OUTPUT_DIR="$SCRIPT_DIR/output"

VERSION=$(sed -n 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SOURCE_DIR/manifest.json" | head -n 1)
if [ -z "$VERSION" ]; then
  echo "Unable to read the extension version from manifest.json" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
ARCHIVE="$OUTPUT_DIR/OmniTools-Safari-$VERSION.zip"
rm -f "$ARCHIVE"

(
  cd "$SOURCE_DIR"
  zip -qr "$ARCHIVE" .
)

echo "Created $ARCHIVE"
