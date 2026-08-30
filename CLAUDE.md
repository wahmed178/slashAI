# claude.md — SlashAI Agent Continuity File

## Last Updated
August 2026

## Completed Features (confirmed live)
- 5,635 AI slash commands with full search
- 317+ curated free resources in Discover
- 100+ free APIs documented
- 62 YouTube channels in Discover
- 25 Founder Generators (Claude-powered, 5/day free)
- 20 Founder Roadmaps with step completion tracking
- 560+ AI glossary terms across 8 categories
- 80 viral /commands on /trending with Command of the Week
- Build Journal with streaks + 12 badges
- Live dashboard: NIFTY/SENSEX, gold/silver, global indices, earthquakes,
  crypto, forex, weather, AQI, prayer times, cricket, football, NASA APOD,
  ISS location, word of day
- Hubs: Students, Developers, Creators, Professionals, Founders,
  India, Finance, Designers, Health, Islam (53 resources, live widgets)
- 16 curated command collections
- 32 South Asia resources (India, Pakistan, Bangladesh, Arab)
- About page with editorial content
- Changelog page with timeline layout (v2.0-v2.5)
- Glass tier waitlist page (/glass)
- Hub listing page (/hub)
- Bottom tab bar: Home | Commands | Discover | Tools | Hubs (5 tabs, route-based active states)
- Saved accessible from sidebar + /favorites route
- Global keyboard shortcuts: /, ?, G+H/D/T/L, Escape
- PWA (offline, installable)

## Local AI Assistant (/assistant)
- Local browser AI powered by WebLLM (@mlc-ai/web-llm)
- 3 models: Fast (1B, 760MB), Balanced (3B, 1.8GB), Quality (8B, 4.9GB)
- WebGPU required — Chrome/Edge/Brave recommended
- States: Welcome (model picker), Loading (download progress), Chat (streaming), Unsupported
- Features: streaming tokens, markdown rendering, code blocks with copy, file attachments (PDF/DOCX/TXT)
- COOP/COEP headers in vite.config.ts and vercel.json for SharedArrayBuffer support
- /assistant/about: instructions page with browser compat, model comparison, troubleshooting
- Worker: src/workers/ai-worker.ts (WebLLM in background thread)
- Model preference saved in localStorage, conversation history (last 50 messages)
- 100% private, no API keys, no cloud, no tracking

## In Progress / Planned
- Top nav dropdown menus (desktop)
- Persona onboarding overlay (first visit)
- Glass badge system on premium features
- /keyboard page
- /compare AI models page
- Top nav redesign with dropdowns

## Free APIs Currently Integrated
Open-Meteo, CoinGecko, Frankfurter, Aladhan, NASA APOD (DEMO_KEY),
TheSportsDB, HackerNews, Yahoo Finance unofficial, USGS Earthquakes,
OpenAQ, WhereTheISS.at, ExchangeRate-API, AMFI NAV India, AlQuran.cloud,
data.gov.in, data.gov, data.europa.eu, World Bank, UN Data,
IMF Data, WHO GHO, OECD Data, Calendarific, TimeZoneDB, MediaStack,
NewsData.io, GDELT, Polygon.io, Alpha Vantage, Art Institute Chicago,
Metropolitan Museum, Harvard Art Museums, NASA Images, Smithsonian OA,
Library of Congress, Gutendex, Open Trivia DB, The Trivia API, Quotable, Affirmations.dev

## Daily Quiz
- Route: /quiz (3 views: category picker, quiz in progress, results)
- API: Open Trivia Database (opentdb.com) — free, no key, 24 categories
- Fallback API: The Trivia API (the-trivia-api.com)
- Session token: localStorage "quiz-session-token"
- Daily cache: localStorage "quiz-cache-{categoryId}-{difficulty}" — same questions all day, fresh at midnight
- Streak: localStorage "quiz-streak", "quiz-best-streak", "quiz-last-date"
- Timer: 25s (easy), 20s (medium), 15s (hard) — pauses on tab hidden
- All API text decoded via textarea.innerHTML (HTML entities)

## Content Automation (GitHub Actions)
- 3 workflows: weekly trending tools (Mon 6am), daily news (7am), weekly prompts (Wed 6am)
- Scripts: scripts/fetch-trending-tools.cjs, scripts/fetch-daily-news.cjs, scripts/fetch-trending-prompts.cjs
- Data files: src/data/trending-tools.json, src/data/daily-news.json, src/data/trending-prompts.json, src/data/changelog.json
- Homepage reads trending-tools.json for "This week's free finds" (fallback to DROPS if empty)
- All workflows support workflow_dispatch for manual triggers
- daily-content.yml: fetches ZenQuotes + Art Institute Chicago artwork daily

## Free Tools (/tools)
- 22 browser-based utility tools, all client-side, no uploads
- File tools: image-compress, image-convert, images-to-pdf (jsPDF), html-to-pdf, markdown-to-html, csv-to-json
- Calculators: sip-calculator, emi-calculator, gst-calculator, bmi-calculator, percentage, age-calculator
- Time: world-clock (12 cities), pomodoro (25/5/15), countdown (save up to 5)
- Screens: flip-clock, focus-screen, rain-screen, starfield, new-tab, quote-screen
- Index page at /tools with 4 grouped sections and "No upload" badges
- Tool routes: /tools/[slug] — each a separate static route file
- jsPDF library used for images-to-pdf (installed via bun)

## Design Tokens (semantic CSS variables)
All colors are defined as CSS custom properties in src/styles.css.
Use Tailwind semantic classes (bg-background, bg-surface, text-foreground, etc.)
instead of hard-coded hex values.

Dark theme: oklch-based near-black navy with electric cyan/teal primary
Light theme: preserved via .light class override
AMOLED theme: preserved via .amoled class override

Card radius: 10px | Button radius: 6px | Badge radius: 4px
Transitions: 150ms ease | Hover: translateY(-2px) + border lightens
ResourceCardEnhanced: src/components/library/ResourceCardEnhanced.tsx
- Favicon (40x40, Google Favicon API with letter fallback)
- Pricing badge: green (Completely Free), blue (Free Tier), yellow (Open Source)
- Save button: localStorage bookmark toggle

Hub section grouping: HUB_SECTION_MAP in src/routes/hub.$audience.tsx
- Each hub has named sections with icon + title + match function
- Unmatched resources go into "More Resources" fallback

LiveTicker: src/components/library/LiveTicker.tsx
- Client-side fetch: NIFTY (Yahoo), SENSEX (Yahoo), BTC/ETH (CoinGecko), USD/INR (open.er-api), Prayer (Aladhan), Weather (Open-Meteo)
- Each data point cached in localStorage with different TTLs
- CSS ticker animation: 40s linear infinite, pauses on hover
- Skeleton shimmer while loading, fails gracefully (skips missing items)

## Motion & Animation
- page-enter: 200ms fade+slide on main content wrappers
- shimmer: skeleton loading blocks with gradient animation
- smooth scroll: scroll-behavior: smooth on html
- copy-feedback: green flash + "Copied" text, self-resets after 2s
- stagger-children: cascade animation for card grids (up to 8 items)

## Next Agent Instructions
Read this file first. Read memory.md. Check /changelog.
Then proceed with the task described. Commit after every page built.
