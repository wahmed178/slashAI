# SlashAI — Project Memory

_Last updated: 20 September 2026 · v2.32.0_

## What This Is
SlashAI (**https://slashai.in**) is a free, offline-first, no-account AI command
and resource library. Copy a slash command, paste it into ChatGPT / Gemini /
Claude, get a real result. Alongside the library it ships a browser-tool suite
(SlashKits), a games arcade (SlashPlay), structured courses (Slash Courses),
curated hubs, a live dashboard and a large free-resource directory.

Everything personal is client-side: no tracking, no analytics profile, and
favourites/progress/settings live in localStorage. The single exception is
**SlashAI Stores** (v2.31) — a multi-tenant storefront host backed by Supabase
(Postgres + Auth + Storage) that lets anyone create a store on a subdomain. It
is opt-in: with no Supabase keys the store screens show a setup notice and the
rest of the app stays exactly as it was.

- **5,704 AI slash commands** across 45 categories / 381 subcategories
- **289 browser tools** on `/tools` — 159 authored interactive tools (each its own route file)
  plus 130 declarative toolkit utilities in `src/lib/toolkit` (ops in `ops.ts`, catalogue in
  `catalog.ts`, rendered by `src/components/tools/ToolRunner.tsx` and served by the dynamic
  route `src/routes/tools.$slug.tsx`), covering text, data/code, encoding, colour/CSS, dates,
  SEO and generators
- **71 browser games** on `/play` — 57 hand-built classics plus a Sports wing (table tennis,
  air hockey, penalty shootout, darts, basketball, bowling) and brain boosters (sudoku with a
  verified single-solution generator in `src/lib/games/sudoku.ts`, nonogram with 11 hand-drawn
  pictures, sliding puzzle, mastermind, tower of hanoi, word search, word scramble)
  - **Removed in v2.33:** the 1,095 generated converter kits (`src/lib/kits`) and 504
    auto-chunked game packs (`src/lib/packs`) were deleted as low-value filler, along with the
    generated command platform-variant padding (10,074 → 5,704 commands)
- **300+ curated free resources** on `/discover` + hubs
- **5 full courses with graded tests** + 4 learning paths on `/learn`
- 100+ free APIs documented, 560+ glossary terms, 20 founder roadmaps,
  16 curated collections, 24-category daily quiz, 12-hub network
- Android app via Capacitor (`in.slashai.app`)
- **SlashAI Stores** — free multi-tenant storefronts (`/stores`, Supabase)

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
- **Supabase** — only for SlashAI Stores (see below); everything else is local
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
| `slashai.cart.<store-slug>` | the one server-backed feature's shopper cart |

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
- **5 courses**: Prompt Engineering · How the Web Actually Works · Ship Your
  First Web App · AI for Study & Research · Build a Real Website
- 4 learning paths (AI Beginner, Developer, Creator, Career Growth) with step
  lists, hour estimates and per-path completion; `pathsCoverAllCourses()` must
  stay true — every course appears in a path
- Topic filters (All / Beginner / Intermediate / Advanced / AI / Web & Dev / Shipping)
- "My progress: N of M courses started", ✅ Started badges
- Courses contain real modules → lessons → graded module tests (70% pass)

### Interactive tool depth (v2.30)
- `/tools/regex` — 5-challenge **Regex Trainer** (hints, personal best in
  `slashai-game-best` under key `regex-trainer-best`) + tappable cheat sheet
- `/tools/meta` — live Google search preview, social card preview, 60/155 char
  counters, checks list
- `/tools/url-encoder` — URL breakdown: origin, path, query-param table with
  encoded-value flags
- `/tools/percentage` — worked answer line + GST/tip/discount quick chips

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

### SlashAI Stores (v2.31) — the one server-backed feature
- **Routes**: `/stores` directory · `/stores/<slug>` storefront ·
  `/stores/dashboard` (owner: auth, store settings, products, orders). A route
  named `stores.dashboard.tsx` intentionally beats `stores.$slug.index.tsx`.
- **Subdomains**: `StoreHostGate` (mounted in `__root.tsx`) reads
  `window.location.host`; when it is `<slug>.<STORES_ROOT_DOMAIN>` it renders the
  storefront standalone instead of the app shell. `RESERVED_SLUGS` in
  `src/lib/stores.ts` protects www/api/app/mail/dashboard… Setup, DNS and the
  Vercel wildcard steps live in `supabase/README.md`.
- **Schema**: `supabase/schema.sql` (idempotent) — `stores`, `products`,
  `orders`, `order_items`, RLS, a public `store-images` bucket keyed on
  `<store_id>/`, and the `place_order` RPC. **Checkout prices are recomputed
  server-side** and quantities clamped 1–99; the client never sends prices.
- **Client**: `src/lib/stores.ts` (client, types, queries, slug/host/money/cart
  helpers, four tenant theme palettes — a deliberate literal-colour exception
  like `category-colors.ts`) · `src/hooks/use-stores.ts` (auth + async loaders) ·
  `src/components/stores/{Storefront,StoreManager,StoreHostGate,StoreBits}.tsx`.
- Keys: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, optional
  `VITE_STORES_ROOT_DOMAIN`. Anon key only — never `service_role`.
- **Verification** (run both after touching anything store-shaped):
  - `bun run stores:validate` — runs `supabase/schema.sql` in PGlite (Postgres 16
    in WASM, devDependency `@electric-sql/pglite`) behind a Supabase-shaped
    `auth`/`storage` harness, then drives 51 checks as `anon`/`authenticated`:
    tenant isolation, published-only reads, price verification, quantity
    clamping, free products, junk carts, address rules, image folders. No keys,
    no network. Run it before pasting the SQL into Supabase.
  - `bun run stores:e2e` — real project + the app's own `src/lib/stores.ts`:
    signs in, creates a store, adds products, orders as a signed-out shopper,
    loads `/stores/<slug>` over HTTP, confirms the owner sees the order.
- **Schema gotchas that already bit once**: `public.owns_store()` is a
  `language sql` function, so it must be created *after* `public.stores` (Postgres
  validates SQL function bodies at creation: 42P01 otherwise); pgcrypto is
  created inside a `do $$ … exception … $$` block because not every Postgres
  build ships it; `place_order` counts matched items rather than requiring a
  non-zero subtotal, so 0-price products can be ordered.
- A published store's catalogue is readable by *anyone*, signed in or not — that
  is the point of a shop window. Unpublished stores are invisible to everyone
  except their owner.
- An owner account owns stores; RLS means handing a subdomain to a friend or a
  client is safe — they sign up with their own email and only ever see their own
  store, products and orders.

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
4. localStorage only for personal state. The only server-backed surface is
   SlashAI Stores (Supabase); do not move catalogue or personal data there.
5. No placeholder content: counts and claims must match the catalogue.
6. Keep the catalogues duplicate-free (`slashkits.ts`, `slashplay.ts`, `courses.ts`).
7. Bump `APP_VERSION` **and** both changelogs (`app-meta.ts` + `src/data/changelog.json`).
8. Keep `README.md`, `CLAUDE.md` and this file current after shipping.
9. Run `bun tsc -b --noEmit` before finishing. Freebuff build:
   `sh scripts/build-for-freebuff.sh`.

## Owner
Waseem Ahmed — Hyderabad, India · GitHub: [wahmed178]
