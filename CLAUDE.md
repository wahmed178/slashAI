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
- Bottom tab bar: Home | Commands | Discover | Tools | Hubs
- Global keyboard shortcuts: /, ?, G+H/D/T/L, Escape
- PWA (offline, installable)

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
Library of Congress, Gutendex, Open Trivia, Quotable, Affirmations.dev

## Design Tokens
bg: #0d1117 | surface: #161b22 | surface-raised: #21262d
border: #30363d | text: #e6edf3 | muted: #8b949e
accent: #58a6ff | green: #3fb950 | red: #f85149 | yellow: #d29922

Card radius: 10px | Button radius: 6px | Badge radius: 4px
Transitions: 150ms ease | Hover: translateY(-2px) + border lightens
ResourceCardEnhanced: src/components/library/ResourceCardEnhanced.tsx
- Favicon (40x40, Google Favicon API with letter fallback)
- Pricing badge: green (Completely Free), blue (Free Tier), yellow (Open Source)
- Save button: localStorage bookmark toggle

Hub section grouping: HUB_SECTION_MAP in src/routes/hub.$audience.tsx
- Each hub has named sections with icon + title + match function
- Unmatched resources go into "More Resources" fallback

## Motion & Animation
- page-enter: 200ms fade+slide on main content wrappers
- shimmer: skeleton loading blocks with gradient animation
- smooth scroll: scroll-behavior: smooth on html
- copy-feedback: green flash + "Copied" text, self-resets after 2s
- stagger-children: cascade animation for card grids (up to 8 items)

## Next Agent Instructions
Read this file first. Read memory.md. Check /changelog.
Then proceed with the task described. Commit after every page built.
