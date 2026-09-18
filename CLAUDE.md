# claude.md — SlashAI Agent Continuity File

## Last Updated
18 September 2026 · APP_VERSION 2.28.0

## What This Is
SlashAI (https://slashai.in) — a free, offline-first, no-account AI command and
resource library. React + TanStack Start (SSR), hosted on Vercel, real Android
wrapper via Capacitor. No backend, no auth, no database: everything personal
lives in localStorage.

## Stack (do not add to it casually)
- React 19 + TanStack Start 1.168 / TanStack Router 1.170 (file-based routes in `src/routes/`)
- Tailwind CSS 4 via `@tailwindcss/vite`, semantic CSS tokens in `src/styles.css`
- shadcn/ui (Radix primitives) in `src/components/ui/`
- lucide-react icons; sonner for toasts; framer-motion-style CSS animations
- vite-plugin-pwa (precache + offline), Capacitor for the Android build
- Package manager: **bun**. Typecheck: `bun tsc -b --noEmit`

## Route Map (current)
- `/` homepage — live ticker, hero + UniversalSearch, library stats, SlashKits
  preview, "Your most used", "You might like", weekly finds, footer
- `/search` · `/find` · `/explore` (+ `/$category` / `/$category/$subcategory`)
- `/c/$slug` command detail · `/collections` · `/trending` · `/favorites` · `/recent`
- `/discover` feed (+ `/discover/reels`) — opens with **Start Here**
- `/tools` SlashKits index · `/tools/<slug>` 150+ browser tools (each its own route file)
- `/play` SlashPlay index · `/play/<slug>` 57 games (each its own route file)
- `/learn` Slash Courses (paths + filters) · `/learn/$courseId` · `/learn/$courseId/$lessonId`
- `/hub` + `/hub/<audience>` · `/live` · `/glossary` · `/roadmaps` · `/generators`
- `/quiz` · `/journal` · `/graph` · `/workflow` · `/ai-tools` · `/assistant`
- `/whats-new` · `/radar` · `/alternatives` · `/movies` · `/youtube` · `/blog`
- `/about` (founder story + FAQ) · `/changelog` · `/keyboard` · `/privacy` · `/terms` · `/contact`
- `/me` settings · `/everything` · `/random`

## Navigation (important)
There is **no sidebar and no drawer**. The bottom dock is the only navigation:
Home · Discovery · 🎲 Random (elevated centre) · Hubs · ⚡ Slash (opens SlashBar
overlay). Header holds ⚡ SlashAI logo, Live Dashboard pill, command search,
theme cycle, About, Saved, Settings. Desktop uses `wide` (1700px) on dense pages.

## Theme System
Themes: `dark` (default CSS) → `light` → `amoled` → `brutal`, cycled by one
header button; `glass` still exists on `/designs`. Legacy theme ids are mapped in
`LEGACY_THEME_MAP` (use-library.tsx). Accent palettes via `data-accent`.
FOUC is prevented by the inline script in `__root.tsx`; keep it in sync with
`DEFAULT_SETTINGS.theme` if you change the default.

## UX / Personalisation layer (v2.28)
`src/lib/ux.ts` is the single home for client-side personalisation:
- `slash_first_visit` — absent ⇒ first-time visitor; `HowToUse` auto-expands and
  then sets the flag so it is collapsed on later visits
- `slashai-tool-clicks` — per-slug open counts → 🔥 Popular badges
- `slashai-game-best` — personal bests (`getGameBest` / `saveGameBest`); cricket
  migrates the legacy `play-cricket-best` key
- `slashai-started` — courses/tools/paths the user has opened → ✅ badges + "My progress"
- `slashai-last-copy` — powers the floating re-copy pill
- `slashai-ux-interactions` — rolling interaction log (kind, id, tag) → "You might like"
- `isNewItem(added)` — 🆕 badges age out automatically after `NEW_WINDOW_DAYS` (45)
- `inferComplexity(text)` — placeholder-count difficulty used on command cards/pages
- `ux.ts` dispatches `UX_CHANGE_EVENT` / `LAST_COPY_EVENT` on window;
  `src/hooks/use-ux.ts` exposes `useUxTick()`, `useMounted()`, `useLastCopied()`

Shared components added in v2.28 (all in `src/components/library/`):
`HowToUse.tsx` · `TryInRow.tsx` · `ReportProblem.tsx` · `FloatingActions.tsx`
(re-copy pill + back-to-top) · `CatalogueExtras.tsx` (how-to + similar row,
rendered by AppShell on every `/tools/*` and `/play/*` screen) · `StartHere.tsx` ·
`YouMightLike.tsx`.

## Catalogues — single sources of truth
- Commands: `src/lib/commands.ts` over `src/data/commands.json`; helpers
  `relatedCommands`, `commandTemplate`, `getRandomCommand`, `filterCommands`
- SlashKits: `src/lib/slashkits.ts` (`TOOL_SECTIONS`, `similarTools`, `newTools`,
  `toolOfTheDay`). `added` dates drive the 🆕 badge — no duplicates allowed.
- SlashPlay: `src/lib/slashplay.ts` (`PLAY_SECTIONS`, `GAME_META`/`gameMeta`,
  `SCORING_GAMES`, `NEW_GAME_SLUGS`, `newGames`, `gameSection`). 57 games.
- Slash Courses: `src/lib/courses.ts` + `src/lib/learning-paths.ts`
  (`LEARNING_PATHS`, `pathSummary`, `pathCourseIds`). `pathsCoverAllCourses()`
  is a cheap integrity check — every course must appear in a path.
- HTML Compiler samples: `src/lib/html-samples.ts` (`HTML_SAMPLES`, 14 projects).
  Rule for that file: plain template literals only — no backticks or `${` inside
  sample code, so nothing needs escaping.

## Rules When Editing
1. Never break published URLs. Any new route must render under AppShell.
2. Keep the bottom-dock-only navigation; do not reintroduce a sidebar.
3. Mobile-first (375px), semantic colour tokens only — no hard-coded hex in
   components (exceptions: category tint palettes in `src/lib/category-colors.ts`).
4. localStorage only. No accounts, no tracking, no backend calls for UX state.
5. No placeholder content — counts and claims must match the real catalogue.
6. Bump `APP_VERSION` in `src/lib/app-meta.ts` **and** add the matching entry to
   both `CHANGELOG` (app-meta.ts) and `src/data/changelog.json`.
7. Keep `README.md` current with the shipped feature list.
8. Freebuff builds: `dist/` output, entry JS patched via `scripts/patch-entry.py`,
   build command `sh scripts/build-for-freebuff.sh`.
9. Run `bun tsc -b --noEmit` before finishing; never hand-edit `src/convex/_generated`.

## Owner
Waseem Ahmed — Hyderabad, India · GitHub: [wahmed178]
