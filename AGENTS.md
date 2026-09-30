# SlashAI — Agent Guide

SlashAI (https://slashai.in) is a 100% free, offline-first, no-account AI command vault and web utility suite created by Waseem Ahmed.

## Core Rules & Architecture
1. **Offline & Client-side First**: Everything personal lives in `localStorage`. No database, no backend, no analytics, no accounts.
2. **Navigation**: Bottom dock is the single navigation hub (`Home · ⚡ Slash · 🎲 Random · Commands`), defined once as `PRIMARY` in `src/components/library/AppShell.tsx`. "Commands" points at `/explore` and stays active across `/explore`, `/search`, `/find` and `/c/*`; Slash and Random are actions and are never route-active. Do not reintroduce a sidebar or drawer.
   - **SlashBar is the only hub.** The separate Hubs tab is gone. `/hub` redirects to `/slash`, and `/hub/$audience` redirects to the matching `/slashbar/$category` via `HUB_REDIRECTS` in `src/lib/slashbar-categories.ts` — those URLs are in the sitemap, so they redirect rather than 404. A category is an index over every content type at once (commands, tools, games, guides, resources, quotes), not a list of links, and a category with no rows is not rendered at all. Do not reintroduce a Hubs section.
3. **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`) with semantic CSS tokens in `src/styles.css`.
4. **Platform Integrations**:
   - **GitHub & Vercel**: Never modify `.github/` workflows or `vercel.json` unless explicitly requested.
   - **Android**: Capacitor native wrapper (`android/`, `in.slashai.app`).
5. **Quality & Honesty**: Real counts only. No placeholder content, fake metrics, or fake testimonials.

