# Point the app at the new slashai.lovable.app URL

The published site moved to `https://slashai.lovable.app`. The Android app and docs still point at the old address.

## Changes

- `capacitor.config.ts` — update the loaded server URL to `https://slashai.lovable.app`.
- `README.md` — update the live app link.
- Android package ID stays `dev.lovable.slashprompt` (as chosen), so Play updates keep working. No changes to `build.gradle`, `MainActivity.java`, or `strings.xml`.
- Check route metadata (canonical / Open Graph URLs) for any hardcoded old domain and update if found.

## Note

After this, a new APK/AAB build is needed once so installed apps load the new URL; web-only content updates still just need Publish.
