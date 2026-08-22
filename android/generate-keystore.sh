#!/usr/bin/env bash
set -euo pipefail

KEYSTORE="android/android.keystore"
ALIAS="slashai"

mkdir -p android
if [[ -f "$KEYSTORE" ]]; then
  echo "ERROR: $KEYSTORE already exists. Remove it only if you intend to replace your signing identity."
  exit 1
fi

keytool -genkey -v \
  -keystore "$KEYSTORE" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=SlashAI Command Library, OU=Mobile, O=SlashAI, C=US"

echo "Created $KEYSTORE. Keep it safe; every update must use this same key."
echo "Base64 value for GitHub secret ANDROID_KEYSTORE_BASE64:"
base64 -w 0 "$KEYSTORE"
echo