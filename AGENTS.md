# SlashAI — Agent Guide

SlashAI (https://slashai.in) is a 100% free, offline-first, no-account AI command vault and web utility suite created by Waseem Ahmed.

## Core Rules & Architecture
1. **Offline & Client-side First**: Everything personal lives in `localStorage`. No database, no backend, no analytics, no accounts.
2. **Navigation**: Bottom dock is the single navigation hub (`Home · Discovery · 🎲 Random · Hubs · ⚡ Slash`). Do not reintroduce a sidebar or drawer.
3. **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`) with semantic CSS tokens in `src/styles.css`.
4. **Platform Integrations**:
   - **GitHub & Vercel**: Never modify `.github/` workflows or `vercel.json` unless explicitly requested.
   - **Android**: Capacitor native wrapper (`android/`, `in.slashai.app`).
5. **Quality & Honesty**: Real counts only. No placeholder content, fake metrics, or fake testimonials.

