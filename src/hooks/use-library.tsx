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
import { todayKey } from "@/lib/commands";
import { advanceStreak, EMPTY_STREAK, type Streak } from "@/lib/engagement";

export type Theme =
  | "dark"
  | "light"
  | "amoled"
  | "batman"
  | "ocean"
  | "moonlight"
  | "warm";
export type Density = "comfortable" | "compact";
export type Accent = "teal" | "violet" | "amber" | "rose" | "blue" | "lime";

/** every theme except the default dark maps 1:1 to a class on <html> */
export const THEMES: { id: Theme; label: string; hint: string; swatch: string }[] = [
  { id: "dark", label: "Dark", hint: "The default, easy on the eyes", swatch: "oklch(0.16 0.012 250)" },
  { id: "light", label: "Light", hint: "Bright rooms and daylight", swatch: "oklch(0.985 0.003 250)" },
  { id: "amoled", label: "AMOLED", hint: "True black, saves battery", swatch: "oklch(0 0 0)" },
  { id: "batman", label: "Batman", hint: "Near-black with gold", swatch: "oklch(0.84 0.16 92)" },
  { id: "ocean", label: "Ocean", hint: "Deep blue, cyan highlights", swatch: "oklch(0.8 0.13 205)" },
  { id: "moonlight", label: "Moonlight", hint: "Soft indigo and lavender", swatch: "oklch(0.82 0.09 295)" },
  { id: "warm", label: "Warm", hint: "Sepia tones for night reading", swatch: "oklch(0.81 0.14 65)" },
];

/** themes that fix their own primary colour, so the accent picker is inert */
export const FIXED_ACCENT_THEMES: Theme[] = ["batman", "ocean", "moonlight", "warm"];


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
  streak?: Streak;
  stats?: Stats;
}

interface LibraryValue {
  hydrated: boolean;
  favorites: string[];
  recents: string[];
  recentSearches: string[];
  settings: Settings;
  streak: Streak;
  stats: Stats;
  /** true when the app was updated since the user last saw the release notes */
  showWhatsNew: boolean;
  dismissWhatsNew: () => void;
  openWhatsNew: () => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  recordUse: (id: string) => void;
  recordSearch: (q: string) => void;
  recordCopy: () => number;
  clearRecents: () => void;
  clearSearches: () => void;
  clearAllData: () => void;
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
  const [streak, setStreak] = useState<Streak>(EMPTY_STREAK);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    setFavorites(readArray(KEYS.favorites));
    setRecents(readArray(KEYS.recents));
    setRecentSearches(readArray(KEYS.searches));
    setSettings(read<Settings>(KEYS.settings, DEFAULT_SETTINGS));
    setStats(read<Stats>(KEYS.stats, DEFAULT_STATS));

    // one streak transition per app open
    const nextStreak = advanceStreak(read<Streak>(KEYS.streak, EMPTY_STREAK), todayKey());
    setStreak(nextStreak);
    localStorage.setItem(KEYS.streak, JSON.stringify(nextStreak));

    setHydrated(true);

    const seen = localStorage.getItem(KEYS.seenVersion);
    // brand new installs shouldn't be greeted by release notes
    if (!seen) localStorage.setItem(KEYS.seenVersion, APP_VERSION);
    else if (seen !== APP_VERSION) setShowWhatsNew(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    for (const t of THEMES) root.classList.toggle(t.id, settings.theme === t.id && t.id !== "dark");
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
    setStats((prev) => {
      const next = { ...prev, opens: prev.opens + 1 };
      localStorage.setItem(KEYS.stats, JSON.stringify(next));
      return next;
    });
  }, []);

  /** Increments the local copy counter and returns the new total. */
  const recordCopy = useCallback(() => {
    let total = 0;
    setStats((prev) => {
      const next = { ...prev, copies: prev.copies + 1 };
      total = next.copies;
      localStorage.setItem(KEYS.stats, JSON.stringify(next));
      return next;
    });
    return total;
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

  const clearAllData = useCallback(() => {
    for (const key of Object.values(KEYS)) localStorage.removeItem(key);
    setFavorites([]);
    setRecents([]);
    setRecentSearches([]);
    setStats(DEFAULT_STATS);
    setStreak(EMPTY_STREAK);
    setSettings(DEFAULT_SETTINGS);
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
      streak,
      stats,
    }),
    [favorites, recents, recentSearches, settings, streak, stats],
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
      const nextStats = { ...DEFAULT_STATS, ...(data.stats ?? {}) };
      const nextStreak = { ...EMPTY_STREAK, ...(data.streak ?? {}) };

      setFavorites(nextFav);
      setRecents(nextRec);
      setRecentSearches(nextSearch);
      setSettings(nextSettings);
      setStats(nextStats);
      setStreak(nextStreak);
      localStorage.setItem(KEYS.favorites, JSON.stringify(nextFav));
      localStorage.setItem(KEYS.recents, JSON.stringify(nextRec));
      localStorage.setItem(KEYS.searches, JSON.stringify(nextSearch));
      localStorage.setItem(KEYS.settings, JSON.stringify(nextSettings));
      localStorage.setItem(KEYS.stats, JSON.stringify(nextStats));
      localStorage.setItem(KEYS.streak, JSON.stringify(nextStreak));

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
      streak,
      stats,
      showWhatsNew,
      dismissWhatsNew,
      openWhatsNew,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      recordUse,
      recordSearch,
      recordCopy,
      clearRecents,
      clearSearches,
      clearAllData,
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
      streak,
      stats,
      showWhatsNew,
      dismissWhatsNew,
      openWhatsNew,
      toggleFavorite,
      recordUse,
      recordSearch,
      recordCopy,
      clearRecents,
      clearSearches,
      clearAllData,
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
