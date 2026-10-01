/**
 * Local-date key ("YYYY-MM-DD") used for streaks and daily content.
 *
 * This lives apart from `@/lib/commands` on purpose. That module imports
 * the full 5.4 MB command catalog, and the app shell only ever needed a
 * one-line date helper from it - which dragged the whole catalog into the
 * eagerly loaded shell chunk and left every page blank for ~9s while the
 * main thread parsed it. Keep this dependency-free.
 */
export const todayKey = (): string => new Date().toISOString().slice(0, 10);
