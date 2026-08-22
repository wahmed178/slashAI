# SlashAI Android App

The Android app uses Capacitor and a native Android WebView. It does not launch Chrome or depend on Trusted Web Activity verification.

## Build locally

Requirements:

- Node.js and npm
- Java 21
- Android SDK with platform 36 and build-tools 36.1.0
- A signing keystore at `android/android.keystore`

Set the signing passwords and run:

```bash
export ANDROID_KEYSTORE_PASSWORD='your-keystore-password'
export ANDROID_KEY_PASSWORD='your-key-password'
npm run android:build
```

The signed APK is created at `android/app/build/outputs/apk/release/app-release.apk`.

The APK opens `https://slashai.lovable.app` inside the native WebView. Android System WebView must be enabled, but Chrome is not required. Internet access is required because the app loads the current published site.

**Web-only updates do not need a new APK.** Because the WebView loads the live published site, publishing the web app in Lovable (Publish → Update) is enough for app users to get the change. Rebuild the APK only when the app name, icon, package ID, splash colors, or the URL in `capacitor.config.ts` changes.

## GitHub release

The `Release` workflow builds the APK when a `v*` tag is pushed and publishes it to the GitHub Release. Configure these repository secrets:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`

Then push a version tag:

```bash
git tag v1.0.5
git push origin v1.0.5
```

Download the latest APK here:

https://github.com/wahmed178/slashAI/releases/latest/download/slash-command-vault.apk
