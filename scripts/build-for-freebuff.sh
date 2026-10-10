#!/bin/bash
# Build TanStack Start and produce a client-only SPA in dist/
# for Freebuff's static hosting.
set -e

# Run the normal build (produces .output/public/ with client assets)
bun run build

# Clean dist and copy client assets to root
rm -rf dist
mkdir -p dist
cp -r .output/public/* dist/

# Patch the entry JS for static SPA mode:
# 1. hydrateRoot(document, ...) → createRoot(document.getElementById("root"), ...)
# 2. Remove server adapter code that crashes without a backend
node scripts/patch-entry.mjs

# Find the entry JS for the HTML template FIRST: the strip step below and the
# generated index.html both need it, and computing it later emitted an HTML
# template with no <script> tag (a blank page).
ENTRY_JS=$(ls dist/assets/index-*.js 2>/dev/null | head -1)
ENTRY_PATH="${ENTRY_JS#dist/}"
if [ -z "$ENTRY_PATH" ]; then
  echo "ERROR: no entry bundle (dist/assets/index-*.js) — the SPA cannot mount." >&2
  exit 1
fi

# For builds where TanStack Start freshens the entry artifact, make the static
# build rewrite durable for that run too (idempotent/no-op if already patched).
node scripts/strip-ssr-entry.mjs "$ENTRY_PATH" || true

# Find the CSS file
CSS_FILE=$(ls dist/assets/styles-*.css 2>/dev/null | head -1)
CSS_PATH=""
if [ -n "$CSS_FILE" ]; then
  CSS_PATH="/${CSS_FILE#dist/}"
fi

cat > dist/index.html << HTMLEOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0a0a" />
    <title>SlashAI</title>
    <!-- Pre-paint theme bootstrap (same file the SSR shell loads). The client
         tree no longer renders <html>/<head>/<body>, so this has to come from
         the static shell. -->
    <script src="/theme-init.js"></script>
    <link rel="icon" href="/favicon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    ${CSS_PATH:+<link rel="stylesheet" href="${CSS_PATH}" />}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${ENTRY_PATH}"></script>
  </body>
</html>
HTMLEOF

echo "Build complete: dist/ ready for static hosting (client-only mode)"
