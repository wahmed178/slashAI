# Get a signed APK built

## What I found

- This Lovable project does **not** contain the GitHub agent's changes. `scripts/validate-android-association.mjs` is missing, and `android/build-android.sh`, `.github/workflows/release.yml` and `android/README.md` here are still the older versions. So the repo and this project have diverged.
- Building the APK inside Lovable is not realistic: this sandbox has **no Java JDK, no Android SDK, no Gradle**, and no signing keystore. An Android release build needs all four plus a licensed SDK download. GitHub Actions already has them, and it already produced a signed APK/AAB successfully for `v1.0.3`.

So the fastest reliable path to an APK is still GitHub Actions — but with the certificate-validation work merged in properly so the TWA opens full-screen instead of showing the browser bar.

## Plan

1. **Sync direction check.** Pull the agent's four changed files into this project (or confirm the repo version wins) so there is one source of truth: `android/build-android.sh`, `scripts/validate-android-association.mjs`, `.github/workflows/release.yml`, `android/README.md`.
2. **Add the association validator** if it isn't in the repo in a usable form: a Node script that reads the keystore SHA-256 fingerprint and compares it against every fingerprint in `public/.well-known/assetlinks.json`, failing the build on mismatch. Wire it up as `bun run android:validate`.
3. **Wire validation into CI.** In `.github/workflows/release.yml`, run the validator after the keystore is restored and after the fingerprint is injected into `assetlinks.json`, before the Gradle build — so a mismatched certificate stops the release instead of shipping a broken TWA.
4. **Keep Play App Signing in mind.** Document that once the app is on Google Play, Play re-signs it, so the Play App Signing SHA-256 must be added as a second entry in `assetlinks.json` alongside the upload key fingerprint.
5. **Verify locally what can be verified here.** Lint, web build, and a dry run of the validator's JSON/fingerprint-parsing logic with a fixture (no real keystore needed).
6. **Trigger the build.** You create a release tag `v1.0.4` on GitHub (Releases → Create a new release → new tag `v1.0.4` → Publish). The workflow produces `app-release-signed.apk` and `app-release-signed.aab` as artifacts. I'll then read the run status through the GitHub connector and confirm success.
7. **Publish the web app** from Lovable afterwards so the live `/.well-known/assetlinks.json` carries the correct fingerprint — without this the installed APK still shows the address bar.

## Technical notes

- The GitHub API was rate-limiting me this turn, so I could not read the repo's current file contents or the latest workflow runs. Step 1 starts by re-reading them once the limit clears; if the agent's versions are already correct, that step is a no-op.
- No keystore, password, or fingerprint secret will be written into source. The workflow keeps reading them from `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`.
- `scripts/bubblewrap-build.mjs` (the non-interactive builder that fixed the earlier CI failures) stays as-is.
