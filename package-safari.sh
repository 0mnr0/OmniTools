#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SOURCE_DIR="$SCRIPT_DIR/OmniTools - Safari"
PROJECT_DIR="$SCRIPT_DIR/Safari App"

if xcrun --find safari-web-extension-packager >/dev/null 2>&1; then
  PACKAGER=safari-web-extension-packager
elif xcrun --find safari-web-extension-converter >/dev/null 2>&1; then
  PACKAGER=safari-web-extension-converter
else
  echo "Safari Web Extension Packager was not found. Install the full Xcode app first." >&2
  echo "Then select it with: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer" >&2
  exit 1
fi

mkdir -p "$PROJECT_DIR"
xcrun "$PACKAGER" "$SOURCE_DIR" \
  --project-location "$PROJECT_DIR" \
  --app-name "Omni Tools" \
  --bundle-identifier "ru.top-academy.omnitools" \
  --swift
