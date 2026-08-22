# Capacitor WebView migration — sync check and cleanup

## What I found

The Capacitor migration from GitHub is already fully present in this project. I verified:

- `capacitor.config.ts` exists, app ID `dev.lovable.slashprompt`, loading `https://slashprompt.lovable.app` in a native WebView.
- `android/` is now a real Capacitor Gradle project (`app/`, `build.gradle`, `variables.gradle`, `gradlew`, `MainActivity.java`).
- `package.json` has `@capacitor/core` + `@capacitor/android` and the new `android:sync` / `android:open` / `android:build` scripts.
- `.github/workflows/release.yml` is the Capacitor version ("Android release build (Capacitor)", Java 21, Gradle).
- `android/README.md` is rewritten for Capacitor.
- No leftover references to Bubblewrap, TWA, or `twa-manifest.json` anywhere in the project.

So nothing needs to be re-synced — both sides already match.

## Answer to your question

Pushing updates from Lovable is safe:

- Lovable only touches the files it edits (mostly `src/`, `public/`). It will not regenerate or overwrite the `android/` Gradle project or the workflow.
- The Android app loads the **live published site** in a WebView, so any web change goes live to app users as soon as you hit **Publish → Update**. No APK rebuild is needed.
- You only need a new APK when you change the app name, icon, package ID, splash colors, or the URL in `capacitor.config.ts`.

## Small cleanup (optional)

1. Delete `public/.well-known/assetlinks.json` — it was only needed for TWA domain verification and is now dead weight. A Capacitor WebView never shows a URL bar, so nothing depends on it.
2. Add a one-line note to `android/README.md` stating that web-only updates require Publish in Lovable, not an APK rebuild.

No other changes needed.
