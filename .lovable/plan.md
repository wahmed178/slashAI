Add a Capacitor Android wrapper alongside the existing TWA setup

Goal: give you a WebView-based Android path (Capacitor) that hides the URL bar by default, while keeping the existing TWA workflow and files intact so nothing breaks.

1. Add Capacitor tooling
   - Install `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android` as dev dependencies.
   - Add `capacitor.config.ts` with app ID `dev.lovable.slashprompt`, app name `SlashAI`, and `server.url` set to `https://slashprompt.lovable.app` so the WebView loads the live published site.
   - Add `capacitor-android:init`, `capacitor-android:sync`, `capacitor-android:build`, and `capacitor:copy` scripts to `package.json`.

2. Initialize the Capacitor Android project
   - Run `cap add android` in a deterministic, non-interactive way (or commit the generated `android-capacitor/` folder after generation).
   - Keep the existing `android/` folder (TWA/Bubblewrap) untouched.
   - Configure the Capacitor `AndroidManifest.xml` with `screenOrientation` and the same package name as the TWA to avoid Play Store conflicts if you later choose one path.
   - Set the splash screen color and app icon to match the existing PWA manifest colors (`#12161c`).

3. Configure WebView behavior
   - Ensure `allowNavigation` and `cleartext` settings are correct for HTTPS-only production.
   - Keep the URL bar hidden: Capacitor WebView does not show a browser address bar by default.
   - Confirm the app opens to the published URL and the service worker/offline behavior from the PWA still works inside the WebView.

4. Add a new GitHub Actions workflow for Capacitor
   - Create `.github/workflows/release-capacitor.yml`.
   - Trigger: `workflow_dispatch` and `push` tags starting with `v*` (same as the TWA workflow, but independent).
   - Steps: lint, build web, set up JDK, accept Android SDK licenses, sync Capacitor Android project, restore signing keystore, build signed APK and AAB with Gradle, verify APK contains manifest/dex, upload artifacts.
   - Reuse the same GitHub secrets (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`) so no new secrets are needed.

5. Keep the existing TWA workflow as-is
   - Leave `.github/workflows/release.yml` unchanged.
   - Leave `android/`, `android/twa-manifest.json`, `scripts/bubblewrap-build.mjs`, and `scripts/validate-android-association.mjs` unchanged.

6. Update documentation
   - Update `android/README.md` to explain the two options: TWA (`release.yml`) and Capacitor (`release-capacitor.yml`).
   - Add instructions for building the Capacitor wrapper locally and for Play Store upload.
   - Note that the Capacitor AAB can use the same package name as the TWA, but you should choose only one upload path per Play Store listing.

7. Verification
   - Run the Capacitor build locally in the sandbox if possible, or via a manual GitHub Actions run.
   - Confirm the generated APK installs and opens `https://slashprompt.lovable.app` without a URL bar.
   - Confirm that future Lovable edits still auto-sync to GitHub and that the existing TWA workflow still works if you choose to run it.
