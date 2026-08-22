#!/usr/bin/env bash
set -euo pipefail

# Build script for the SlashAI Android app (Capacitor native WebView wrapper).
# This runs on your local machine, not inside the Lovable editor.
#
# Requirements:
#   - bun (https://bun.sh)
#   - Java JDK 17+ (keytool + jarsigner)
#   - Android SDK command-line tools (or Android Studio)
#   - Environment variables:
#       ANDROID_KEYSTORE_PASSWORD
#       ANDROID_KEY_PASSWORD
#       JAVA_HOME
#       ANDROID_HOME
#   - A signing keystore at android/android.keystore (or set ANDROID_KEYSTORE_PATH)
#
# Usage:
#   bash android/build-android.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"
export ANDROID_KEYSTORE_PATH="${ANDROID_KEYSTORE_PATH:-$SCRIPT_DIR/android.keystore}"
if [[ ! -f "$ANDROID_KEYSTORE_PATH" ]]; then
  echo "ERROR: Signing keystore not found at $ANDROID_KEYSTORE_PATH."
  exit 1
fi
if [[ -z "${ANDROID_KEYSTORE_PASSWORD:-}" ]]; then
  echo "ERROR: ANDROID_KEYSTORE_PASSWORD is required."
  exit 1
fi

npx cap sync android

cd android
./gradlew assembleRelease

UNSIGNED_APK="app/build/outputs/apk/release/app-release-unsigned.apk"
SIGNED_APK="app/build/outputs/apk/release/app-release.apk"
SDK_ROOT="${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
ZIPALIGN="$SDK_ROOT/build-tools/36.1.0/zipalign"
APKSIGNER="$SDK_ROOT/build-tools/36.1.0/apksigner"

if [[ ! -x "$ZIPALIGN" || ! -x "$APKSIGNER" ]]; then
  echo "ERROR: Android build tools 36.1.0 are required."
  exit 1
fi

"$ZIPALIGN" -f 4 "$UNSIGNED_APK" "$SIGNED_APK-aligned"
"$APKSIGNER" sign \
  --ks "$ANDROID_KEYSTORE_PATH" \
  --ks-key-alias "${BUBBLEWRAP_KEY_ALIAS:-slashai}" \
  --ks-pass "pass:${ANDROID_KEYSTORE_PASSWORD}" \
  --key-pass "pass:${ANDROID_KEY_PASSWORD:-$ANDROID_KEYSTORE_PASSWORD}" \
  --out "$SIGNED_APK" "$SIGNED_APK-aligned"
rm -f "$SIGNED_APK-aligned"

echo "Android APK created at android/$SIGNED_APK"
