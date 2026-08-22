import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";
export type Density = "comfortable" | "compact";

interface Settings {
  theme: Theme;
  density: Density;
  view: "grid" | "list";
  pageSize: number;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  density: "comfortable",
  view: "grid",
  pageSize: 24,
};

const KEYS = {
  favorites: "slashai.favorites",
  recents: "slashai.recents",
  settings: "slashai.settings",
};

interface LibraryValue {
  hydrated: boolean;
  favorites: string[];
  recents: string[];
  settings: Settings;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  recordUse: (id: string) => void;
  clearRecents: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
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
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setFavorites(readArray(KEYS.favorites));
    setRecents(readArray(KEYS.recents));
    setSettings(read<Settings>(KEYS.settings, DEFAULT_SETTINGS));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("light", settings.theme === "light");
    root.style.colorScheme = settings.theme;
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  }, [settings, hydrated]);

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

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.setItem(KEYS.recents, "[]");
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<LibraryValue>(
    () => ({
      hydrated,
      favorites,
      recents,
      settings,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      recordUse,
      clearRecents,
      updateSettings,
    }),
    [
      hydrated,
      favorites,
      recents,
      settings,
      toggleFavorite,
      recordUse,
      clearRecents,
      updateSettings,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
