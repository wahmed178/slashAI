Convert SlashAI to a free Play Store-ready Android app using Trusted Web Activity

1. Goal: package the existing PWA as a lightweight Android APK that can be uploaded to Google Play, without adding native features or rewriting the app.
2. Approach: use Trusted Web Activity (TWA) via Bubblewrap / PWA Builder, which wraps the live web app in a full-screen Android shell. This is free and open-source; the app remains the web version under the hood.
3. Prerequisite work inside the web project:
   - Confirm the web manifest, icons, and service worker already meet PWA installability checks.
   - Add Android-specific adaptive/maskable icon sizes if missing, and provide a splash screen background.
   - Add the `shortcuts`, `display: "standalone"`, and `orientation` fields already present; ensure the manifest passes the PWA Builder manifest validator.
4. Domain verification for TWA:
   - Generate a Digital Asset Links file (`assetlinks.json`) for the production domain.
   - Serve it from `/.well-known/assetlinks.json` so Android can verify the app and hide the browser address bar.
   - Note: this requires the app to be published first on a stable public domain. The current preview URL will not work for TWA verification.
5. Build tooling setup:
   - Install the free Bubblewrap CLI (`@bubblewrap/cli`) or use the browser-based PWA Builder.
   - Initialize the TWA project from the existing `manifest.webmanifest`.
   - Configure the package name, app version, keystore for signing, and splash screen color.
6. Build the APK:
   - Run the Bubblewrap build command to produce a signed APK and App Bundle (AAB) for Play Store upload.
   - Verify the APK installs locally and opens the web app full-screen.
7. Publishing note:
   - Building the APK/AAB is free, but uploading to Google Play requires a one-time $25 Google Play Developer account fee. This is not avoidable.
8. Documentation:
   - Add a short `android/README.md` (or extend the existing README) explaining how to regenerate the Android wrapper when the web app updates, how to bump the version, and how to re-sign.
9. Verification plan:
   - Run the generated APK through the Play Store pre-launch checklist.
   - Test that back-button behavior, deep links to `/c/<id>` command URLs, and offline fallback work inside the wrapped app.
