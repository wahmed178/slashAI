#!/usr/bin/env bash
set -euo pipefail

# Build script for the SlashAI Android app (Trusted Web Activity wrapper).
# This runs on your local machine, not inside the Lovable editor.
#
# Requirements:
#   - bun (https://bun.sh)
#   - Java JDK 17+ (keytool + jarsigner)
#   - Android SDK command-line tools (or Android Studio)
#   - Environment variables:
#       BUBBLEWRAP_KEYSTORE_PASSWORD
#       BUBBLEWRAP_KEY_PASSWORD
#       JAVA_HOME
#       ANDROID_HOME
#   - A signing keystore at android/android.keystore (or set TWA_KEYSTORE_PATH)
#
# Usage:
#   bash android/build-android.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

MANIFEST="$SCRIPT_DIR/twa-manifest.json"
if grep -q "REPLACE_WITH_YOUR_PUBLISHED_DOMAIN" "$MANIFEST"; then
  echo "ERROR: Replace REPLACE_WITH_YOUR_PUBLISHED_DOMAIN in $MANIFEST with your published domain first."
  exit 1
fi

cd "$ROOT_DIR"
export TWA_KEYSTORE_PATH="${TWA_KEYSTORE_PATH:-$SCRIPT_DIR/android.keystore}"
# Fail early if the signing certificate is not declared in assetlinks.json —
# otherwise the installed TWA opens with a visible browser address bar.
bun run scripts/validate-android-association.mjs "$TWA_KEYSTORE_PATH"
bun run scripts/bubblewrap-build.mjs android/twa-manifest.json android/project
