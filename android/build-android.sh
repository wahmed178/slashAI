#!/usr/bin/env bash
set -euo pipefail

# Build script for the SlashAI Android app (Trusted Web Activity wrapper).
# This runs on your local machine, not inside the Lovable editor.
#
# Requirements:
#   - Node.js 18+ and npm
#   - Java JDK 11+ (keytool + jarsigner)
#   - Android SDK command-line tools (or Android Studio)
#
# Usage:
#   1. Fill in android/twa-manifest.json with your published domain.
#   2. Run: bash android/build-android.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Domain must be replaced before building.
MANIFEST="$SCRIPT_DIR/twa-manifest.json"
if grep -q "REPLACE_WITH_YOUR_PUBLISHED_DOMAIN" "$MANIFEST"; then
  echo "ERROR: Replace REPLACE_WITH_YOUR_PUBLISHED_DOMAIN in $MANIFEST with your published domain first."
  exit 1
fi

# Install Bubblewrap CLI if not present.
if ! command -v bubblewrap &> /dev/null; then
  echo "Installing Bubblewrap CLI..."
  npm install -g @bubblewrap/cli
fi

# Build the Android project.
echo "Building SlashAI Android app..."
cd "$SCRIPT_DIR"
bubblewrap build --manifest="$MANIFEST" --directory="$SCRIPT_DIR/project"

echo "Done. APK / AAB are in $SCRIPT_DIR/project/"
