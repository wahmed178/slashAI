# SlashAI — Project Memory

## What This Is
SlashAI (https://slashai-nu.vercel.app/) is a free, offline-first,
no-account AI command and resource library. 5,635 commands, 317+ curated
resources, 50+ viral prompts, 80 trending /commands, 25 generators,
20 roadmaps, 560+ glossary terms, 32 South Asia resources, 40+ new APIs.
Built on Lovable, deployed on Vercel.

## Design Identity
- Dark theme: #0d1117 background, #161b22 surface, #30363d border
- Accent: #58a6ff (blue). No loud gradients. No emoji spam.
- Font: Inter (body), Geist or Cal Sans (headings)
- Feel: Linear.app meets Vercel.com — calm, premium, fast
- Subtle glass morphism, micro-interactions, skeleton loading, snap scroll
- Mobile-first, 375px minimum width

## Architecture
- Framework: React (via Lovable) + TanStack Start (SSR, but deployed as static SPA on Freebuff)
- Hosting: Vercel (primary) + Freebuff static hosting (secondary)
- Storage: localStorage only (no auth, no backend database)
- Data: static TS files + JSON for commands, resources, prompts
- APIs used: Open-Meteo, CoinGecko, Frankfurter, Aladhan, NASA APOD,
  TheSportsDB, HackerNews, Yahoo Finance (unofficial), USGS, OpenAQ,
  WhereTheISS.at, ExchangeRate-API, Free Dictionary API
- Android app: Capacitor (loads Vercel URL in WebView)

## Pages (as of Aug 2026)
/ — Homepage with hero, stats bar, feature cards, viral prompt carousel, identity chips, weekly digest, footer
/search — Full command search (5,635 commands)
/find — Advanced keyword search
/explore — 45 categories, 379 subcategories
/discover — Instagram Explore-style masonry grid (prompts + resources + commands + South Asia + 40 new APIs)
/discover/reels — TikTok-style full-screen vertical prompt scroll
/trending — 80 viral /commands with Command of the Week hero, category filters, detail drawer
/live — Live dashboard (markets, gold/silver, global indices, earthquakes, weather, cricket, prayer, space, word of day)
/generators — 25 AI generators across 4 categories (Business, Content, Legal & Ops, Growth)
/roadmaps — 20 founder roadmaps with step completion tracking
/glossary — 560+ AI/SaaS/startup/design/data terms across 8 categories
/journal — Build journal with mood chips, streaks + 12 achievement badges
/collections — 16 curated command collections
/hub — Hub listing page (all 9 hubs)
/hub/students — Student Hub
/hub/developers — Developer Hub
/hub/creators — Creator Hub
/hub/professionals — Professional Hub
/hub/founders — Founder Hub
/hub/india — India Hub
/hub/finance — Finance Hub
/hub/designers — Designers Hub
/hub/health — Health Hub
/movies — Regional film finder
/youtube — YouTube search
/play — Toss, dice, random
/whats-new — Weekly free finds
/radar — Free offers
/alternatives — Free alternatives list
/assistant — Workflow assistant
/about — About SlashAI (editorial, real content)
/changelog — Version history timeline (v2.0-v2.5)
/glass — Premium waitlist page (email capture, localStorage)
/keyboard — Keyboard shortcuts (planned)

## Navigation
- Bottom tab bar: Home | Commands | Discover | Tools | Hubs (5 tabs)
- Sidebar: Commands, Assistant, Founder tools, Roadmaps, Journal, AI tools, Glossary, Live, YouTube, Movies, Collections, Play, Recent, Me, Settings, About, Trending, Changelog, Glass, Hubs
- Keyboard shortcuts: / (search), ? (guide), G+H/D/T/L (go to), Escape (close)

## Free APIs Integrated (100+)
Open-Meteo, CoinGecko, Frankfurter, Aladhan, NASA APOD (DEMO_KEY),
TheSportsDB, HackerNews, Yahoo Finance unofficial, USGS Earthquakes,
OpenAQ, WhereTheISS.at, ExchangeRate-API, AMFI NAV India,
+ 40 new: data.gov.in, data.gov, data.europa.eu, World Bank, UN Data,
  IMF Data, WHO GHO, OECD Data, Calendarific, TimeZoneDB, MediaStack,
  NewsData.io, GDELT, Polygon.io, Alpha Vantage, Art Institute Chicago,
  Metropolitan Museum, Harvard Art Museums, NASA Images, Smithsonian OA,
  Library of Congress, Gutendex, Open Trivia, Quotable, Affirmations.dev

## Monetisation Strategy
Currently: 100% free, no account required.
Planned: Glass tier (premium features, account-based) — waitlist page live.
Free tier must always remain fully functional.

## Key Rules for Any Agent
1. Never break existing features
2. Inspect codebase before changing anything
3. No placeholder content — everything must be real
4. Mobile-first (375px minimum)
5. All free APIs: no credit card required
6. localStorage only — no backend auth
7. Keep the premium, calm, Linear-style aesthetic
8. Run `git commit` with clear message after every meaningful change
9. Update /changelog data file with every feature added
10. Update README.md on GitHub with latest feature list
11. For Freebuff deploys: build outputs to `dist/`, entry JS must be patched
    (hydrateRoot→createRoot, server adapter removed) via `scripts/patch-entry.py`
12. Build command: `sh scripts/build-for-freebuff.sh`

## Owner
Waseem ( Waseem Ahmed ) — Hyderabad, India
GitHub: [wahmed178]
