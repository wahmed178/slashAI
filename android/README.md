# SlashAI Android App

Published web URL: **https://slash-command-vault.lovable.app**

This folder contains the configuration needed to wrap the **SlashAI Command Library** web app into a real Android APK using **Trusted Web Activity (TWA)**. The app itself stays a web app — this is just a lightweight native shell that opens it full-screen, so you can publish it on the Google Play Store.

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
4. The web app must be **published** on a stable public domain (e.g. `slashai.lovable.app` or a custom domain)

## Files in this folder

| File | Purpose |
| --- | --- |
| `twa-manifest.json` | Bubblewrap configuration: package name, host, icons, colors, signing key |
| `build-android.sh` | One-command build script for Linux/macOS |
| `README.md` | This file |

## Step-by-step build

### 1. Publish the web app (done)

The web app is already published at **https://slash-command-vault.lovable.app**. TWA domain verification does not work with Lovable preview URLs, so a published domain is required.

### 2. Fill in the domain placeholders

`android/twa-manifest.json` already uses the published domain `slash-command-vault.lovable.app`. You should verify the host name matches your published domain before building.

Next, update `public/.well-known/assetlinks.json` with the **SHA-256 fingerprint** of your signing key (see step 4). This is what removes the browser address bar in the TWA app.

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

### 7. Upload to Google Play

1. Create a Google Play Developer account ($25 one-time)
2. Create a new app in the Play Console
3. Upload the `app-release.aab`
4. Fill in store listing, screenshots, privacy policy
5. Publish

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
- **App opens in browser instead of standalone**: TWA verification failed. Check the Android logcat for `TokenVerifier` errors.
- **Offline mode not working**: The web app service worker must be registered on the production domain. Test it in Chrome first.
- **Build fails with JDK errors**: Make sure `JAVA_HOME` points to JDK 11+ and not a JRE.

## Links

- [Bubblewrap documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Trusted Web Activity overview](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Google Play Console](https://play.google.com/console/)
