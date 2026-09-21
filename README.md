<div align="center">

# slashAI

### Your AI Command Vault

A searchable library of copy-ready slash commands for writing, research, coding, design, documents, data, productivity and more. Find a strong starting point, tune it to your task, and get back to the work.

[![Status](https://img.shields.io/badge/status-live-2dd4bf)](https://slashai.in)
[![Commands](https://img.shields.io/badge/commands-10%2C005-0ea5e9)](https://slashai.in/explore)
[![PWA](https://img.shields.io/badge/PWA-offline--ready-8b5cf6)](#-pwa--offline)
[![Android](https://img.shields.io/badge/Android-APK-3ddc84)](#-android)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](#-tech-stack)

**[Live app](https://slashai.in)** · **[Android APK](https://github.com/wahmed178/slashAI/releases/latest/download/slash-command-vault.apk)** · **[GitHub](https://github.com/wahmed178/slashAI)**

</div>

---

## 📌 Table of Contents

[At a glance](#-at-a-glance) ·
[What is slashAI](#-what-is-slashai) ·
[Why slashAI](#-why-slashai) ·
[Core features](#-core-features) ·
[Command examples](#-command-examples) ·
[Categories](#-command-categories) ·
[How to use](#-how-to-use) ·
[Search & discovery](#-search--discovery) ·
[PWA & offline](#-pwa--offline) ·
[Android](#-android) ·
[Run locally](#-run-locally) ·
[Project structure](#-project-structure) ·
[Catalog development](#-catalog-development) ·
[Tech stack](#-tech-stack) ·
[Roadmap](#-roadmap) ·
[Creator](#-created-by-waseem-ahmed) ·
[Support](#-support)

---

## ⚡ At a glance

| | |
| --- | --- |
| **Commands** | 10,074 curated, de-duplicated slash commands |
| **Categories** | 45 categories across 439 subcategories |
| **SlashKits** | 1,250+ free tools — 156 interactive browser tools plus 1,095 instant kits (converters, periodic table, study tables, cheat sheets, curated web directory) |
| **SlashPlay** | 561 browser games — 57 hand-built classics plus 504 quiz, word, memory and puzzle packs |
| **Slash Courses** | 5 courses with real lessons and graded module tests, plus 4 learning paths |
| **Search** | Instant fuzzy search with typo tolerance and highlighted matches |
| **Offline** | Static catalog + PWA shell designed for offline use |
| **Android** | Signed APK built with Capacitor and a native WebView |
| **Account** | None required — favorites, progress and settings persist locally |
| **Stores** | Free multi-tenant storefronts on their own subdomains (`/stores`, Supabase) |

**New in v2.31 (Sep 2026):** **SlashAI Stores** — anyone can sign in, create a
store, add products and take orders on their own address (`yourshop.slashai.in`
or `/stores/<slug>`). Shoppers buy without an account, orders land in the owner's
dashboard and hand off to WhatsApp in one tap. Postgres + Auth + Storage from
Supabase, with Row Level Security and server-side price verification.

Previous highlight (v2.28): difficulty badges and a first-run command guide,
"Try in ChatGPT / Gemini / Claude" quick-launch buttons, 🆕/🔥 badges across
SlashKits and SlashPlay, learning paths with progress tracking, a floating
re-copy pill, and 14 ready-made HTML Compiler starter projects.

---

## 🧭 What is slashAI?

slashAI is a command vault. Instead of rewriting the same prompt patterns from scratch, you search a structured catalog of slash commands, read what each one actually does, and copy a ready-to-edit template into your AI tool of choice.

Every command carries a plain-language description, a "how to use" note, a worked example, tags, and related commands — so discovery, understanding and reuse all happen in one place.

---

## 💡 Why slashAI

- **Discovery over recall** — you don't have to remember prompt patterns; you search for them.
- **Copy-ready, not abstract** — each entry ships with a filled-in example you can edit in seconds.
- **Structured by design** — category → subcategory → command keeps 10,074 entries navigable.
- **More than commands** — free browser tools, games and courses, all on the same no-account basis.
- **Fast and quiet** — a dark-first, scan-friendly interface with restrained motion and no clutter.
- **Yours, locally** — favorites, recents, theme, accent and density stay on your device.
- **Everywhere you work** — desktop browser, installable PWA, or the Android app.

---

## ✨ Core features

| Feature | What it does |
| --- | --- |
| 🔓 **No paywalls, no account** | Every command, tool, theme and design system is free — nothing to upgrade, no subscription, no tracking |
| 🔍 **Smart fuzzy search** | Matches command names, aliases, titles, descriptions, examples, tags, categories — with multi-word queries and typo tolerance |
| 🗂 **Categories & subcategories** | Browse the full taxonomy from the sidebar or category chips |
| 📄 **Command detail** | Description, how-to-use, example, tags, difficulty, and related commands |
| 📋 **Copy actions** | Copy the command, or copy a ready-to-edit full prompt template |
| ⭐ **Favorites** | Pin the commands you keep coming back to |
| 🕘 **Recently used** | Automatically tracks what you've copied |
| 🎲 **Random command** | One click to surface something you didn't know existed |
| 📅 **Daily command** | A deterministic pick that's the same for everyone each day |
| 🔗 **Shareable URLs** | Every command has a stable link at `/c/<id>` |
| 📶 **Offline-first PWA** | App shell and catalog designed to keep working without a connection |
| 📱 **Responsive UI** | Touch-friendly cards, filters in a bottom sheet on mobile |
| 🎨 **Themes & density** | Dark, Light and AMOLED themes, six accent colours, compact/comfortable density |
| 💾 **Backup & restore** | Export and import favorites, recents and settings as JSON |
| 🤖 **Android app** | Signed APK that runs slashAI in a native WebView |

---

## 🧪 Command examples

Copy a command, add your input, and run it in your AI tool.

```text
/Explode
Render any object as a clean exploded-view diagram with labelled parts.
```

```text
/Scan
Convert a photo of a page into a flat, deskewed, high-contrast scan.
```

```text
/HandwrittenNotesImage
Turn typed text into a realistic photo of handwritten notes on paper.
```

```text
/100xUpscale
Aggressively upscale a tiny or degraded image while inventing plausible detail.
```

```text
/Summarize
Compress any text into a faithful summary at the length and reading level you choose.
```

```text
/RootCauseFeedback
Run a five-whys root-cause analysis on customer feedback.
```

```text
/FactCheckTopic
Verify every claim on a topic and rate confidence for each one.
```

Many commands come in families — `/RootCausePlan`, `/RootCauseTranscript`, `/FactCheckPaper`, `/FactCheckCompany` — so you can pick the variant that matches your input type.

---

## 🗂 Command categories

The taxonomy below is generated from the catalog itself.

| Category | Commands | Subcategories |
| --- | ---: | ---: |
| AI Agents & Prompting | 193 | 3 |
| Analytics & Reporting | 180 | 3 |
| Audio & Speech | 60 | 10 |
| Automation & Workflows | 60 | 10 |
| Backend & APIs | 221 | 5 |
| Business & Management | 760 | 20 |
| Career | 63 | 10 |
| Coding & Development | 768 | 19 |
| Content & Social Media | 1,082 | 26 |
| Customer Support | 216 | 3 |
| Data & Analytics | 122 | 22 |
| Databases & SQL | 186 | 3 |
| Design & Creative | 60 | 10 |
| DevOps & Cloud | 219 | 4 |
| Documents & OCR | 62 | 11 |
| Ecommerce & Retail | 216 | 3 |
| Events & Community | 215 | 18 |
| Food & Cooking | 216 | 14 |
| Gaming & Esports | 216 | 13 |
| General AI | 61 | 10 |
| Health & Wellbeing | 42 | 6 |
| Home & Everyday | 740 | 15 |
| HR & Hiring | 216 | 3 |
| Image & Vision | 773 | 23 |
| Learning & Education | 764 | 18 |
| Legal & Contracts | 216 | 3 |
| Machine Learning | 180 | 3 |
| Marketing & SEO | 63 | 10 |
| Math & Science | 60 | 10 |
| Mobile & Apps | 216 | 5 |
| Money & Finance | 50 | 5 |
| Productivity | 62 | 10 |
| Quality & Performance | 60 | 10 |
| Research & Knowledge | 60 | 10 |
| Sales & CRM | 216 | 5 |
| Security & Privacy | 62 | 10 |
| Social & Community | 46 | 6 |
| Sports & Fitness | 216 | 16 |
| Spreadsheets | 180 | 3 |
| Testing & QA | 216 | 8 |
| Translation & Languages | 60 | 10 |
| Travel & Local | 48 | 6 |
| Video | 67 | 10 |
| Web & Frontend | 222 | 7 |
| Writing & Communication | 63 | 10 |
| **Total** | **10,074** | **439** |

> The live total is the source of truth (10,074 commands). Per-category rows above
> are refreshed in batches, so they can lag a release behind. The September 2026
> expansion added platform-tuned variants (ChatGPT, Gemini, Claude, Perplexity,
> Copilot, DeepSeek) across social media, image work, vibe coding, students,
> corporate and kids command groups.

---

## 🚀 How to use

1. **Search or browse.** Type what you're trying to do, or pick a category from the sidebar.
2. **Open the command.** Read the description, how-to-use note and worked example.
3. **Copy.** Use *Copy command* for the name alone, or *Use command* for a full editable prompt template.
4. **Paste and tune.** Drop it into your AI tool, replace the placeholders, run.

**Example**

```text
/Summarize

# Summarize — Writing & Communication
# How to use: paste the source text and state the target length and reading level.

Input: <paste your input here>
Goal: <what a great result looks like>
Constraints: <tone, length, format>
```

---

## 🔎 Search & discovery

- **Ranked results** — exact command matches rank above aliases, titles, tags and description matches.
- **Typo tolerant** — near-miss spellings still find the right command.
- **Multi-word queries** — every word must match something; whole-phrase matches rank highest.
- **Highlighted matches** — see exactly why a result matched.
- **Filters** — category, subcategory, type, difficulty and favorites-only.
- **Sorting** — relevance, name, category, popularity or newest.
- **Random command** — a fast way to explore the long tail.
- **Daily command** — a stable pick per day, identical for every user.
- **Favorites & recents** — your own shortlist, always one click away.

---

## 📶 PWA & offline

slashAI ships a web app manifest, icons and an offline-oriented architecture. The catalog is bundled as static data, so browsing and searching don't depend on a network round-trip.

**Install it:**

- **Android Chrome** — menu → *Add to Home screen*
- **Desktop Chrome / Edge** — install icon in the address bar
- **iOS Safari** — Share → *Add to Home Screen*

---

## 🤖 Android

The Android build uses **Capacitor** with a native WebView. It loads the published slashAI site inside the app, so it behaves like an app rather than handing off to Chrome. No Trusted Web Activity domain verification is required.

Grab the latest signed build from [GitHub Releases](https://github.com/wahmed178/slashAI/releases/latest/download/slash-command-vault.apk). Prerequisites, signing setup, local builds and release configuration are documented in **[android/README.md](android/README.md)**.

For a local release build:

```sh
export ANDROID_KEYSTORE_PASSWORD='your-keystore-password'
export ANDROID_KEY_PASSWORD='your-key-password'
npm run android:build
```

The signed APK is written to `android/app/build/outputs/apk/release/app-release.apk`.

> Not currently distributed through Google Play — install the APK directly.

---

## 🛠 Run locally

**Requirements:** Node.js 18+ and npm.

```sh
git clone <this-repository-url>
cd slashAI
npm install
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint the codebase |
| `npm run catalog:validate` | Validate the command catalog |
| `npm run catalog:build` | Regenerate catalog data |
| `npm run android:build` | Build a signed Android release APK |

---

## 📁 Project structure

```text
src/
  components/library/   command cards, detail views, sidebar, dashboard widgets
  components/ui/        shared accessible UI primitives
  data/                 generated command and category data
  hooks/                library state, actions, mobile and network helpers
  lib/                  catalog validation, search, offline and error handling
  routes/               TanStack Start routes
scripts/                catalog generation and validation
public/                 manifest, icons and PWA assets
android/                native Android WebView build configuration
```

---

## 🧱 Catalog development

The catalog lives as **structured local data** (`src/data/commands.json` and `categories.json`), generated from source modules under `scripts/catalog/`. Keeping it local makes the app fast and offline-capable — and keeps the door open to moving it behind an API later without changing the UI.

Each record follows a fixed schema:

| Field | Description |
| --- | --- |
| `id` | Stable unique identifier used in share URLs |
| `command` | The slash command, e.g. `/Summarize` |
| `title` | Human-readable name |
| `description` | What the command does |
| `howToUse` | Practical guidance |
| `example` | A worked example |
| `category` / `subcategory` | Taxonomy placement |
| `tags` | Search keywords |
| `type` | image, text, document, data, coding, research, productivity, audio, video, business, learning, general |
| `difficulty` | easy, medium or advanced |
| `featured` | Surfaced on the dashboard |
| `aliases` | Alternate names matched by search |

**Workflow for adding commands:**

```sh
# 1. edit or add a module under scripts/catalog/
npm run catalog:build      # regenerate src/data/*.json
npm run catalog:validate    # check ids, duplicates and required fields
npm run dev                 # verify in the UI
```

Validation enforces unique stable IDs, no duplicate command names, and complete records — so nothing half-finished reaches the UI.

---

## 🧩 Tech stack

**React 19** · **TypeScript** · **Vite** · **TanStack Start / Router** · **Tailwind CSS 4** · **Radix UI** · **Capacitor** · **vite-plugin-pwa** · **Supabase** (SlashAI Stores only)

---

## 🗺 Roadmap

Shipped in v2.31:

- [x] SlashAI Stores — free multi-tenant storefronts with subdomains, a
      no-account checkout and WhatsApp order hand-off

Shipped in v2.28:

- [x] Guided discovery — difficulty badges, a first-run "how to use" guide, and "You might also like"
- [x] Quick-launch straight into ChatGPT, Gemini or Claude with the command already copied
- [x] Learning paths with progress tracking across Slash Courses
- [x] Deeper personalisation — popular badges, personal bests and a locally-driven "You might like" row
- [x] Richer SlashKits and SlashPlay catalogues with honest ⏱ time / 🎯 difficulty labels

Still on the list:

- [ ] Continued catalog growth across existing and new categories
- [ ] Sharable collections and curated command sets
- [ ] Expanded mobile and PWA capabilities

---

## 👤 Created by Waseem Ahmed

slashAI was created by **Waseem Ahmed**, with a focus on practical AI productivity, organized command systems, and making powerful AI workflows easier to discover and reuse.

The project reflects a clear point of view: that the hard part of working with AI is rarely the model — it's knowing what to ask, and remembering what worked. slashAI answers that with initiative and practical thinking, careful attention to taxonomy and structure, and a consistent bias toward user-focused utility over surface polish.

---

## 🏪 SlashAI Stores

SlashAI Stores is the one part of the site that talks to a server: a free
multi-tenant storefront host for small businesses, creators and local shops.

- **Owners** sign in (Supabase Auth), create a store in a minute, add products
  with photos, prices and stock, and manage orders from `/stores/dashboard`.
- **Every store gets an address** — `yourshop.slashai.in` once the wildcard
domain resolves, and `slashai.in/stores/yourshop` in the meantime.
- **Shoppers need no account.** Cart, checkout with just a name and phone, a
  real order code on success, and a one-tap "send the order on WhatsApp" button
  — which is how most small shops in India actually take orders.
- **No fees and no commission.** SlashAI never touches the money.
- **Safe to hand over.** Row Level Security means a store account can only read
  and write its own store, products and orders.

Setup (Supabase project, `supabase/schema.sql`, the Vercel wildcard domain and
the one CNAME record) is documented in **[supabase/README.md](supabase/README.md)**,
along with two checks:

```sh
bun run stores:validate   # schema, RLS and checkout — no Supabase project needed
bun run stores:e2e        # live: creates a demo store and opens its storefront
```
With no Supabase keys the store pages show a setup notice and every other part of
SlashAI keeps working exactly as before — no backend required.

---

## ❤️ Support

If slashAI is useful to you:

- ⭐ **Star the repository** — it genuinely helps
- 🐛 **Report an issue** — bugs, wrong descriptions, or missing commands
- 🙌 **Contribute** — new commands are welcome; run `catalog:validate` before opening a PR

---

## 📄 License

No license file is currently present in this repository. Licensing information should be added before reuse or redistribution.

---

<div align="center">

**[slashai.in](https://slashai.in)** — free forever, no account, works offline.

</div>
