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
python3 scripts/patch-entry.py

# Find the entry JS for the HTML template
ENTRY_JS=$(ls dist/assets/index-*.js 2>/dev/null | head -1)
ENTRY_PATH="${ENTRY_JS#dist/}"

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
