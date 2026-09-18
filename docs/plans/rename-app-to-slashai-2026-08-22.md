# Rename app to "SlashAI"

## Goal
Replace every user-facing occurrence of the longer app name with the clean brand **"SlashAI"** while keeping technical identifiers stable.

## Scope
- `README.md` — title "# Slash Command Hub" → "# SlashAI"; body "SlashAI Command Library" → "SlashAI".
- `android/README.md` — wrap reference "SlashAI Command Library" → "SlashAI".
- `android/generate-keystore.sh` — `CN=` value "SlashAI Command Library" → "SlashAI".
- `android/twa-manifest.json` — `"name"` "SlashAI Command Library" → "SlashAI".
- `public/manifest.webmanifest` — `"name"` "SlashAI Command Library" → "SlashAI".
- `src/components/library/SettingsPanel.tsx` — "SlashAI Command Library" → "SlashAI".
- `src/routes/__root.tsx` — `title` and `og:title` "SlashAI Command Library" → "SlashAI".
- `src/routes/index.tsx` — `title`, `og:title`, and hero text "SlashAI Command Library" → "SlashAI".

## Unchanged technical identifiers
- `android/twa-manifest.json`: `packageId`, `host`, `launcherName`, `signingKey.alias`
- `android/generate-keystore.sh`: `ALIAS="slashai"`
- `localStorage` keys: `slashai.favorites`, etc.
- `src/routes/c.$slug.tsx`: "SlashAI library" phrasing is acceptable as-is, but can be shortened if it reads cleaner.

## Verification
- Run a grep search to confirm no "SlashAI Command Library" strings remain.
- Run `bun run lint` and `bun run build` to confirm no broken references.
- Re-publish the app so the live manifest and page metadata reflect the new name.
