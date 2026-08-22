# SlashAI Android App

Published web URL: **https://slashprompt.lovable.app**

This folder contains the configuration needed to wrap the **SlashAI** web app into a real Android APK using **Trusted Web Activity (TWA)**. The app itself stays a web app — this is just a lightweight native shell that opens it full-screen, so you can publish it on the Google Play Store.

## What is TWA?

Trusted Web Activity lets a native Android app launch a Progressive Web App (PWA) in full-screen Chrome Custom Tabs. Users get:

- An installable APK from the Play Store
- A full-screen, app-like experience
- No browser address bar (after domain verification)
- The same offline caching and PWA behavior already built into the web app

No native Android code needs to be written for this app.

## Cost overview

| Step | Cost |
| --- | --- |
| Building the APK / AAB with Bubblewrap | **Free** |
| Google Play Developer account | **$25 one-time fee** (not free) |
| Hosting the PWA on Lovable | Included |

You cannot upload to Google Play without paying the $25 developer account fee. The build tooling itself is free and open source.

## Prerequisites

On your local machine (the Lovable editor cannot run Android tooling):

1. **Node.js 18+** and npm
2. **Java JDK 11+** (includes `keytool` and `jarsigner`)
3. **Android SDK** (download via Android Studio or command-line tools)
4. The web app must be **published** on a stable public domain (e.g. `slashprompt.lovable.app` or a custom domain)

## Files in this folder

| File | Purpose |
| --- | --- |
| `twa-manifest.json` | Bubblewrap configuration: package name, host, icons, colors, signing key |
| `build-android.sh` | One-command build script for Linux/macOS |
| `README.md` | This file |

## Step-by-step build

### 1. Publish the web app (done)

The web app is already published at **https://slashprompt.lovable.app**. TWA domain verification does not work with Lovable preview URLs, so a published domain is required.

### 2. Fill in the domain placeholders

`android/twa-manifest.json` already uses the published domain `slashprompt.lovable.app` and the package name `dev.lovable.slashprompt`. Change these if you want a different package name or domain.

`public/.well-known/assetlinks.json` needs the **SHA-256 fingerprint** of your signing key so the TWA can hide the browser address bar. The GitHub Actions workflow injects this automatically from your keystore secret at build time, but you can also paste it manually if you build locally.

### 3. Install Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

### 4. Create or reuse a signing keystore

If you don't have one, generate it once and keep it safe:

```bash
keytool -genkey -v -keystore android/android.keystore -alias slashai -keyalg RSA -keysize 2048 -validity 10000
```

Get the SHA-256 fingerprint:

```bash
keytool -list -v -keystore android/android.keystore -alias slashai
```

Copy the SHA-256 value into `public/.well-known/assetlinks.json`.

### 4b. Verify the certificate association (important)

A TWA only hides the browser address bar when the SHA-256 fingerprint of the signing
certificate is listed in the live `/.well-known/assetlinks.json`. Check it before building:

```bash
BUBBLEWRAP_KEYSTORE_PASSWORD='your-password' \
  bun run android:validate -- android/android.keystore
```

The check also runs automatically inside `bun run android:build` and in GitHub Actions,
and it fails the build on a mismatch. To validate only the JSON wiring (no keystore
needed), run `SKIP_KEYSTORE_CHECK=1 bun run android:validate`.

After changing `assetlinks.json`, **redeploy the Lovable web app** and reinstall the APK —
Android caches the association at install time.

#### Google Play App Signing

If you enroll in Play App Signing, Google re-signs your app with its own key, so the
upload-key fingerprint is no longer what the device sees. Copy the **App signing key
certificate** SHA-256 from Play Console → Setup → App integrity and add it as a second
entry in `sha256_cert_fingerprints`, alongside your upload key fingerprint. Both may be
listed; keeping both means locally-installed APKs and Play-installed builds both verify.


### 5. Build the Android project

```bash
bun run android:build
# or directly:
bash android/build-android.sh
```

This produces:

- `android/project/app/build/outputs/apk/release/app-release.apk`
- `android/project/app/build/outputs/bundle/release/app-release.aab`

Use the **AAB** for Google Play and the **APK** for local testing.

### 6. Test locally

Install the APK on a device or emulator:

```bash
adb install android/project/app/build/outputs/apk/release/app-release.apk
```

Make sure the production URL is live and `/.well-known/assetlinks.json` is reachable — otherwise the address bar will remain visible.

Before building locally, verify that the keystore used to sign the APK is the same certificate listed by the published site:

```bash
BUBBLEWRAP_KEYSTORE_PASSWORD='your-keystore-password' \
	bun run android:validate -- android/android.keystore
```

The command must succeed. If it reports a fingerprint mismatch, update `public/.well-known/assetlinks.json`, redeploy the web app in Lovable, and run the check again. For a Google Play installation, also add the SHA-256 fingerprint of the **Google Play App Signing key** to that file; Play re-signs the downloaded APK with that key.

### 7. Upload to Google Play

1. Create a Google Play Developer account ($25 one-time)
2. Create a new app in the Play Console
3. Upload the `app-release.aab`
4. Fill in store listing, screenshots, privacy policy
5. Publish
### 8. Automated releases with GitHub Actions

The repository includes `.github/workflows/release.yml`. On every push of a tag starting with `v` (for example `v1.0.0`), the workflow will:

1. Run `bun lint` and `bun build`
2. Inject the published domain into `android/twa-manifest.json`
3. Set the app version from the tag
4. Build the Android release APK and AAB
5. Upload both as workflow artifacts

Required GitHub repository settings:

| Name | Type | Value |
| --- | --- | --- |
| `PUBLISHED_DOMAIN` | Repository variable | `slashprompt.lovable.app` |
| `ANDROID_KEYSTORE_BASE64` | Repository secret | Base64 of your `android/android.keystore` |
| `ANDROID_KEYSTORE_PASSWORD` | Repository secret | Keystore password |
| `ANDROID_KEY_PASSWORD` | Repository secret | Key password |

To generate a keystore and print its base64 value, run locally:

```bash
bun run android:keystore
```

Keep the keystore file safe — it is used to sign every future release, and losing it means you cannot update the app on Google Play.

After the secrets are set, push a tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow will:

1. Lint and build the web app
2. Inject the published domain into the TWA manifest
3. Extract the SHA-256 fingerprint from your keystore and write it into `public/.well-known/assetlinks.json` automatically
4. Build the Android release APK and AAB
5. Upload both as workflow artifacts

You can then download the APK/AAB from **Actions → Release → Artifacts** and upload the AAB to the Play Console.

The workflow also publishes both files on the tag's GitHub Release. Share this stable APK link with Android users:

**https://github.com/wahmed178/slashAI/releases/latest/download/slash-command-vault.apk**

Opening that link on an Android phone downloads the latest APK. Android may ask the user to allow installation from the browser; Google Play is recommended for public distribution because it handles updates and trust automatically.

> **Note:** Because the workflow injects the SHA-256 fingerprint at build time, the published web app must be redeployed after the tag push so the live `/.well-known/assetlinks.json` contains the correct fingerprint. The app will still build without this, but the browser address bar will remain visible until the correct `assetlinks.json` is live.

## Updating the Android app

When the web app changes, you usually do **not** need to rebuild the Android wrapper unless you change:

- App name or icon
- Theme colors
- Start URL or shortcuts
- Required Android permissions

To update the web content only, publish the web app again. The TWA wrapper will load the latest version automatically.

To bump the Android version for a store update:

1. Update `appVersion` and `appVersionCode` in `android/twa-manifest.json`
2. Re-run `bun run android:build`
3. Upload the new AAB to Play Console

## Future Capacitor path

If you later need native Android features (camera, background sync, push notifications, local file system), the app is already structured as a clean PWA and can be migrated to Capacitor with minimal changes. For now, TWA is the simplest free route to the Play Store.

## Troubleshooting

- **Address bar still shows**: `assetlinks.json` is missing, the SHA-256 fingerprint is wrong, or the file is not served from the exact production domain.
- **App opens in browser instead of standalone**: TWA verification failed. Run `bun run android:validate -- android/android.keystore`, confirm that the deployed `https://slashprompt.lovable.app/.well-known/assetlinks.json` contains the signing certificate, and reinstall the newly built APK. For Google Play, use the Play App Signing fingerprint as well as the local upload-key fingerprint.
- **Offline mode not working**: The web app service worker must be registered on the production domain. Test it in Chrome first.
- **Build fails with JDK errors**: Make sure `JAVA_HOME` points to JDK 11+ and not a JRE.

## Links

- [Bubblewrap documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Trusted Web Activity overview](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Google Play Console](https://play.google.com/console/)
