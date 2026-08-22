import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { APP_VERSION } from "@/lib/app-meta";

export type Theme = "dark" | "light" | "amoled";
export type Density = "comfortable" | "compact";
export type Accent = "teal" | "violet" | "amber" | "rose" | "blue" | "lime";

export const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: "teal", label: "Teal", swatch: "oklch(0.79 0.15 178)" },
  { id: "violet", label: "Violet", swatch: "oklch(0.72 0.17 300)" },
  { id: "amber", label: "Amber", swatch: "oklch(0.82 0.16 78)" },
  { id: "rose", label: "Rose", swatch: "oklch(0.72 0.17 12)" },
  { id: "blue", label: "Blue", swatch: "oklch(0.72 0.15 250)" },
  { id: "lime", label: "Lime", swatch: "oklch(0.82 0.19 130)" },
];

export type HomeMode = "calm" | "feed";

interface Settings {
  theme: Theme;
  density: Density;
  accent: Accent;
  view: "grid" | "list";
  pageSize: number;
  reducedMotion: boolean;
  /** optional, local-only interest ids used to personalise Discover */
  interests: string[];
  /** true once the user has answered (or skipped) the onboarding wizard */
  onboarded: boolean;
  /** optional persona id from lib/personas */
  persona: string;
  /** which home surface the user prefers: calm sections or the scroll feed */
  homeMode: HomeMode;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  density: "comfortable",
  accent: "teal",
  view: "grid",
  pageSize: 24,
  reducedMotion: false,
  interests: [],
  onboarded: false,
  persona: "",
  homeMode: "calm",
};

export interface Stats {
  copies: number;
  opens: number;
}

const DEFAULT_STATS: Stats = { copies: 0, opens: 0 };

const KEYS = {
  favorites: "slashai.favorites",
  recents: "slashai.recents",
  searches: "slashai.searches",
  settings: "slashai.settings",
  seenVersion: "slashai.seenVersion",
  streak: "slashai.streak",
  stats: "slashai.stats",
};

export interface BackupPayload {
  app: "slashai";
  version: string;
  exportedAt: string;
  favorites: string[];
  recents: string[];
  searches: string[];
  settings: Settings;
}

interface LibraryValue {
  hydrated: boolean;
  favorites: string[];
  recents: string[];
  recentSearches: string[];
  settings: Settings;
  /** true when the app was updated since the user last saw the release notes */
  showWhatsNew: boolean;
  dismissWhatsNew: () => void;
  openWhatsNew: () => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  recordUse: (id: string) => void;
  recordSearch: (q: string) => void;
  clearRecents: () => void;
  clearSearches: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  exportBackup: () => BackupPayload;
  importBackup: (raw: string) => { ok: boolean; message: string };
}

const LibraryContext = createContext<LibraryValue | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...(fallback as object), ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function readArray(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    setFavorites(readArray(KEYS.favorites));
    setRecents(readArray(KEYS.recents));
    setRecentSearches(readArray(KEYS.searches));
    setSettings(read<Settings>(KEYS.settings, DEFAULT_SETTINGS));
    setHydrated(true);

    const seen = localStorage.getItem(KEYS.seenVersion);
    // brand new installs shouldn't be greeted by release notes
    if (!seen) localStorage.setItem(KEYS.seenVersion, APP_VERSION);
    else if (seen !== APP_VERSION) setShowWhatsNew(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("light", settings.theme === "light");
    root.classList.toggle("amoled", settings.theme === "amoled");
    root.dataset["accent"] = settings.accent;
    root.dataset["motion"] = settings.reducedMotion ? "reduced" : "full";
    root.style.colorScheme = settings.theme === "light" ? "light" : "dark";
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  }, [settings, hydrated]);

  const dismissWhatsNew = useCallback(() => {
    localStorage.setItem(KEYS.seenVersion, APP_VERSION);
    setShowWhatsNew(false);
  }, []);
  const openWhatsNew = useCallback(() => setShowWhatsNew(true), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      localStorage.setItem(KEYS.favorites, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordUse = useCallback((id: string) => {
    setRecents((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 30);
      localStorage.setItem(KEYS.recents, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordSearch = useCallback((q: string) => {
    const term = q.trim();
    if (term.length < 2) return;
    setRecentSearches((prev) => {
      const next = [term, ...prev.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(
        0,
        8,
      );
      localStorage.setItem(KEYS.searches, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.setItem(KEYS.recents, "[]");
  }, []);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.setItem(KEYS.searches, "[]");
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const exportBackup = useCallback(
    (): BackupPayload => ({
      app: "slashai",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      favorites,
      recents,
      searches: recentSearches,
      settings,
    }),
    [favorites, recents, recentSearches, settings],
  );

  const importBackup = useCallback((raw: string) => {
    try {
      const data = JSON.parse(raw) as Partial<BackupPayload>;
      if (data.app !== "slashai") return { ok: false, message: "That file isn't a SlashAI backup" };
      const list = (v: unknown) =>
        Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

      const nextFav = list(data.favorites);
      const nextRec = list(data.recents);
      const nextSearch = list(data.searches);
      const nextSettings = { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) };

      setFavorites(nextFav);
      setRecents(nextRec);
      setRecentSearches(nextSearch);
      setSettings(nextSettings);
      localStorage.setItem(KEYS.favorites, JSON.stringify(nextFav));
      localStorage.setItem(KEYS.recents, JSON.stringify(nextRec));
      localStorage.setItem(KEYS.searches, JSON.stringify(nextSearch));
      localStorage.setItem(KEYS.settings, JSON.stringify(nextSettings));

      return {
        ok: true,
        message: `Restored ${nextFav.length} favourite${nextFav.length === 1 ? "" : "s"}`,
      };
    } catch {
      return { ok: false, message: "Couldn't read that file" };
    }
  }, []);

  const value = useMemo<LibraryValue>(
    () => ({
      hydrated,
      favorites,
      recents,
      recentSearches,
      settings,
      showWhatsNew,
      dismissWhatsNew,
      openWhatsNew,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      recordUse,
      recordSearch,
      clearRecents,
      clearSearches,
      updateSettings,
      exportBackup,
      importBackup,
    }),
    [
      hydrated,
      favorites,
      recents,
      recentSearches,
      settings,
      showWhatsNew,
      dismissWhatsNew,
      openWhatsNew,
      toggleFavorite,
      recordUse,
      recordSearch,
      clearRecents,
      clearSearches,
      updateSettings,
      exportBackup,
      importBackup,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
