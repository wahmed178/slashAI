# SlashAI

> A fast, focused command library for better AI work.

SlashAI is a searchable library of 1,200+ copy-ready slash commands for writing, research, coding, design, documents, data, productivity, and more. Find a useful starting point, tune it to your task, and get back to the work.

**Live app:** [slashai.lovable.app](https://slashai.lovable.app)
**Latest Android APK:** [Download from GitHub Releases](https://github.com/wahmed178/slashAI/releases/latest/download/slash-command-vault.apk)

## The Experience

- **Search first:** instant fuzzy search across command names, descriptions, examples, categories, and tags.
- **Built for scanning:** a dark-first interface with a compact command grid, restrained borders, Space Grotesk typography, and electric teal accents.
- **Useful detail:** every command includes an explanation, usage example, tags, related commands, and copy actions.
- **Personal by default:** favorites, recently used commands, theme, and density preferences persist locally without an account.
- **Works offline:** the static catalog and PWA shell are designed for reliable use on mobile and desktop.
- **Designed for Android:** the APK opens the published app inside a native Android WebView, so it works as an app rather than handing off to Chrome.

## Command Categories

Image and Vision · Documents and OCR · Writing · Research · Analysis · Data · Coding · Productivity · Business · Quality and Performance · Learning · Audio · Video · Marketing · Design · Automation · Security and Privacy · Translation · Math and Science · Career · General AI

## Run Locally

Requirements: Node.js 18+ and npm.

```sh
git clone <this-repository-url>
cd slashAI
npm install
npm run dev
```

Useful commands:

```sh
npm run build             # production build
npm run lint              # lint the codebase
npm run catalog:validate  # validate the command catalog
npm run catalog:build     # regenerate catalog data
```

## Project Shape

```text
src/
	components/library/   command cards, details, sidebar, dashboard widgets
	components/ui/        shared accessible UI primitives
	data/                 generated command and category data
	hooks/                library state, actions, mobile and network helpers
	lib/                  catalog validation, commands, offline and error handling
	routes/               TanStack Start routes
public/                 manifest, icons and PWA assets
android/                native Android WebView build configuration
```

The catalog is kept as structured local data so it can be extended or moved behind an API later. To add commands, update the catalog source and run the validation command before building.

## Android APK

The Android build uses Capacitor and a native WebView. It loads the published SlashAI site inside the app and does not require Chrome or Trusted Web Activity domain verification.

See [android/README.md](android/README.md) for prerequisites, signing setup, local builds, and GitHub release configuration.

For a local release build:

```sh
export ANDROID_KEYSTORE_PASSWORD='your-keystore-password'
export ANDROID_KEY_PASSWORD='your-key-password'
npm run android:build
```

The signed APK is written to `android/app/build/outputs/apk/release/app-release.apk`.

## Built With

React · TypeScript · Vite · TanStack Router · Tailwind CSS · Radix UI · Capacitor · Lovable

## Lovable

This project was created with [Lovable](https://lovable.dev). Continue development in the [Lovable editor](https://lovable.dev/projects/7a5be5ac-220c-4f10-9f55-0a591e7f0b40), or work locally and push changes to keep the project synchronized.
