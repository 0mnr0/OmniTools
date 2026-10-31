#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if command -v python3 >/dev/null 2>&1; then
  python3 "$SCRIPT_DIR/build.py" --safari-only
else
  python "$SCRIPT_DIR/build.py" --safari-only
fi
