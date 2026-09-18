# SlashAI — Project Memory

_Last updated: 18 September 2026 · v2.28.0_

## What This Is
SlashAI (**https://slashai.in**) is a free, offline-first, no-account AI command
and resource library. Copy a slash command, paste it into ChatGPT / Gemini /
Claude, get a real result. Alongside the library it ships a browser-tool suite
(SlashKits), a games arcade (SlashPlay), structured courses (Slash Courses),
curated hubs, a live dashboard and a large free-resource directory.

Everything is client-side. There is no backend, no auth, no database and no
tracking — personal state lives in localStorage and never leaves the device.

- **5,682 AI slash commands** across 45 categories / 379 subcategories
- **150+ browser tools** on `/tools` (SlashKits)
- **57 browser games** on `/play` (SlashPlay)
- **300+ curated free resources** on `/discover` + hubs
- **3 full courses with graded tests** + 4 learning paths on `/learn`
- 100+ free APIs documented, 560+ glossary terms, 20 founder roadmaps,
  16 curated collections, 24-category daily quiz, 12-hub network
- Android app via Capacitor (`in.slashai.app`)

## Positioning & Voice
- Free forever. No account. No credit card. No upsell, no premium tier.
- Calm, minimal, human, honest. Real counts and real limitations — nothing
  invented, no placeholder copy, no fake testimonials.
- Built in India (Hyderabad) by Waseem Ahmed. Domain and branding are self-owned;
  no third-party builder branding anywhere users can see.
- Primary audience: students, developers, creators, professionals and founders,
  with a strong India / South-Asia and Islamic-tools angle.

## Design Identity
- Dark theme: near-black navy found via oklch tokens, layered surfaces,
  subtle ambient radial glow
- Primary accent: electric cyan/teal (`oklch(0.79 0.15 178)`)
- Themes: **dark → light → amoled → brutal** (one header button cycles them);
  `glass` remains on `/designs`; accents switch via `data-accent`
- Font: Outfit (UI) + JetBrains Mono (commands/code)
- All colour through semantic CSS variables in `src/styles.css` — no hard-coded
  hex in components (exception: the category tint palette)
- Card radius 10–16px · button radius 6–10px · badge 4px
- Motion: `page-enter` fade+slide, `stagger-children`, shimmer skeletons,
  copy-feedback flash; all disabled under `data-motion="reduced"`
- Mobile-first, 375px minimum; desktop widens the column (1500 / 1700px)

## Architecture
- **React 19 + TanStack Start (SSR)** with file-based routes in `src/routes/`
- **Vercel** serves slashai.in; an `isolate/` folder keeps a static mirror
- **Capacitor** Android wrapper (`android/`, package `in.slashai.app`)
- **Tailwind CSS 4** + shadcn/ui (Radix) + lucide-react + sonner
- **vite-plugin-pwa** — precached app shell, offline support, install banner
- **Storage: localStorage only** (see the key table below)
- Data: static TS modules + JSON in `src/data/`
- Package manager: **bun**

### localStorage keys
| Key | Purpose |
| --- | --- |
| `slashai.settings` | theme, density, accent, view, pageSize, persona, homeMode |
| `slashai.favorites` / `slashai.recents` / `slashai.searches` | commands |
| `slashai.toolFavorites` | saved tools and games (shared list) |
| `slashai.streak` / `slashai.stats` / `slashai.journal` | engagement |
| `slashai-intelligence` | copy/open/save log powering personalised search |
| `slashai-progress` (courses) | lesson completion + module test scores |
| `slash_first_visit` | first-time-visitor flag (command guide auto-opens once) |
| `slashai-tool-clicks` | per-tool open counts → 🔥 Popular badges |
| `slashai-game-best` | personal bests per game slug |
| `slashai-started` | courses/tools/paths opened → ✅ + "My progress" |
| `slashai-last-copy` | text for the floating re-copy pill |
| `slashai-ux-interactions` | rolling log (kind, id, tag) → "You might like" |

## Navigation
**No sidebar, no drawer.** One bottom dock on every screen:
`Home · Discovery · 🎲 Random (elevated centre) · Hubs · ⚡ Slash`
The ⚡ tab opens the full-screen **SlashBar** launcher overlay. The header holds
the logo, Live Dashboard pill, command search (`/` shortcut), theme cycle,
About, Saved and Settings. Breadcrumbs render automatically for `/tools/*`,
`/hub/*`, `/c/*`, `/r/*`, `/learn`, `/play` and other sections, with a Save pill
for the item currently open.

## Feature Map (v2.28)

### Commands
- Difficulty badge on every card and detail page: 🟢 Beginner / 🟡 Intermediate /
  🔴 Advanced, inferred from `[bracket]` placeholder count (`inferComplexity`)
- 4-step **"How to use this command"** guide — expands for first-time visitors,
  collapse state remembered via `slash_first_visit`
- **Try in ChatGPT / Gemini / Claude** quick-launch buttons (copy + open, with
  `?q=` prefill where the assistant supports it — see `targetUrl` in ai-targets.ts)
- Detail page: What it does · How to use · Example · editable template · Run it
  in · **You might also like** · "Something wrong? Report it" (mailto)

### SlashKits (`/tools`)
- 16 sections, live search, "Just added" shelf, 🆕 New / 🔥 Popular badges
- Every card carries "🔒 Runs in your browser · Nothing uploaded"
- Every tool page gets a shared **How to use (3 steps) + Similar tools** block
  rendered by `CatalogueExtras` from AppShell — no per-route duplication
- Tool of the Day rotates on a date seed

### SlashPlay (`/play`)
- 8 sections, search, ⏱ session length and 🎯 difficulty on every card
- "🎲 Surprise me" random-game button; New Games row
- 🏆 personal bests shown on scoring-game cards
- **Cricket** is the flagship: 4 formats (Blitz 12 balls, Solo 24, Chase AI,
  2P duel), beat-your-best challenge, share-score button, and delta-time physics
  so 120Hz and 60Hz screens play identically

### Slash Courses (`/learn`)
- 4 learning paths (AI Beginner, Developer, Creator, Career Growth) with step
  lists, hour estimates and per-path completion
- Topic filters (All / Beginner / Intermediate / Advanced / AI / Web & Dev / Shipping)
- "My progress: N of M courses started", ✅ Started badges
- Courses contain real modules → lessons → graded module tests (70% pass)

### Discover & Hubs
- `/discover` opens with **Start Here** (student / professional / developer) which
  also records the matching persona
- 12 hubs with grouped resource sections, intro paragraphs and live widgets
- `/everything` puts every app, tool, game and hub on one page

### Global chrome
- Floating **copy-again pill** (re-copies the last command, hides after 30s) and
  **back-to-top** after 400px of scroll
- Keyboard shortcuts: `/` search, `?` guide, `G`+H/D/T/L, `Escape`
- Offline banner, install banner, cookie notice, first-visit welcome tour
- "You might like" row on the homepage, driven only by local interaction history

### HTML Compiler (`/tools/html-compiler`)
- 14 ready-made starter projects in `src/lib/html-samples.ts`: blank starter,
  landing page, portfolio, pricing table, contact form, to-do app, gallery,
  login, dashboard, countdown, quiz, clock & stopwatch, responsive navbar,
  canvas particles, blog article
- Sample picker, page-title field, New page, Run, Copy, Export to a single
  `.html` file, console capture from the sandboxed preview iframe, auto-save

## Content Automation
Six scheduled GitHub Actions keep the site current. All of them need
`permissions: contents: write`, because the workflow's default `GITHUB_TOKEN`
is read-only in this repo and every `git push` fails with
`403 denied to github-actions[bot]` without it. They also can't be triggered
with `gh workflow run` (dispatch returns 403 for the managed credential), so the
only way to test one is to let cron fire or push a temporary probe workflow.

| Workflow | Cron (UTC) | Writes | Consumed by |
|---|---|---|---|
| `daily-content.yml` | `0 0 * * *` | `daily-content.json` | `/trending` → Live tab |
| `daily-deals.yml` | `30 1 * * *` | `products.json` | **nothing yet** |
| `daily-news.yml` | `0 7 * * *` | `daily-news.json` | `/trending` → Live tab |
| `weekly-refresh-dates.yml` | `0 4 * * 1` | `lastVerified` in `resources*.ts` | every resource card |
| `weekly-trending-tools.yml` | `0 6 * * 1` | `trending-tools.json` | homepage "free finds" |
| `weekly-trending-prompts.yml` | `0 6 * * 3` | `trending-prompts.json` | `/trending` → Live tab |

- Generators: `scripts/fetch-*.cjs` + `scripts/refresh-resource-dates.cjs`.
- Every generator writes through `scripts/lib/data-write.cjs`, which refuses to
  overwrite a populated file with an empty payload. Without that guard a bad
  fetch silently blanks the data (this is how `daily-content.json` and
  `trending-prompts.json` ended up empty).
- Reddit 403s from GitHub runner IPs — it is treated as best effort and every
  script keeps working with its other sources.
- `products.json` is fetched daily but currently rendered nowhere: the Deals page
  was removed in `531d5f9` while the workflow kept running.
- `/whats-new` computes the live ISO week and today's date at render time, so it
  never shows a stale week.

## Free APIs Used
Open-Meteo, CoinGecko, Frankfurter, Aladhan, NASA APOD, TheSportsDB, HackerNews,
Yahoo Finance (unofficial), USGS Earthquakes, OpenAQ, WhereTheISS.at,
ExchangeRate-API, AMFI NAV India, AlQuran.cloud, World Bank, UN Data, IMF, WHO,
OECD, Calendarific, GDELT, Art Institute Chicago, Metropolitan Museum,
Smithsonian, Library of Congress, Gutendex, Open Trivia DB, Quotable — 100+ in total.

## Rules For Any Agent
1. Never break published URLs; every route renders inside `AppShell`.
2. Keep the bottom-dock-only navigation.
3. Mobile-first (375px), semantic tokens only.
4. localStorage only — no backend, no accounts, no tracking.
5. No placeholder content: counts and claims must match the catalogue.
6. Keep the catalogues duplicate-free (`slashkits.ts`, `slashplay.ts`, `courses.ts`).
7. Bump `APP_VERSION` **and** both changelogs (`app-meta.ts` + `src/data/changelog.json`).
8. Keep `README.md`, `CLAUDE.md` and this file current after shipping.
9. Run `bun tsc -b --noEmit` before finishing. Freebuff build:
   `sh scripts/build-for-freebuff.sh`.

## Owner
Waseem Ahmed — Hyderabad, India · GitHub: [wahmed178]
