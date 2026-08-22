#!/usr/bin/env bash
set -euo pipefail

# Generate a self-signed Android keystore for the SlashAI TWA release,
# print the SHA-256 fingerprint, and output the base64 string needed for
# the GitHub secret ANDROID_KEYSTORE_BASE64.
#
# Usage:
#   bash android/generate-keystore.sh
#   # Then copy the base64 output into the GitHub secret ANDROID_KEYSTORE_BASE64
#   # and copy the SHA-256 fingerprint into public/.well-known/assetlinks.json

KEYSTORE="android/android.keystore"
ALIAS="slashai"
VALIDITY="10000"
mkdir -p android

if [ -f "$KEYSTORE" ]; then
  read -p "Keystore already exists at $KEYSTORE. Overwrite? (y/N) " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
  rm -f "$KEYSTORE"
fi

echo ""
echo "Generating keystore at $KEYSTORE ..."
keytool -genkey \
  -v \
  -keystore "$KEYSTORE" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity "$VALIDITY" \
  -dname "CN=SlashAI, OU=Mobile, O=Lovable, L=Unknown, ST=Unknown, C=US"

echo ""
echo "SHA-256 fingerprint (paste this into public/.well-known/assetlinks.json):"
keytool -list -v -keystore "$KEYSTORE" -alias "$ALIAS" | grep "SHA256:" | sed 's/^.*SHA256: //'

echo ""
echo "Base64-encoded keystore (paste this into GitHub secret ANDROID_KEYSTORE_BASE64):"
base64 -i "$KEYSTORE"

echo ""
echo "Keep $KEYSTORE safe and do not commit it to Git."
