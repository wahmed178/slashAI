import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/name")({ component: IslamicNameFinder });

interface NameEntry { name: string; meaning: string; gender: "male" | "female" | "unisex"; origin: string; quranic: boolean }

const NAMES_DB: NameEntry[] = [
  { name: "Muhammad", meaning: "Praised, commendable", gender: "male", origin: "Arabic", quranic: true },
  { name: "Ahmed", meaning: "Most praiseworthy", gender: "male", origin: "Arabic", quranic: true },
  { name: "Aisha", meaning: "Alive, living", gender: "female", origin: "Arabic", quranic: true },
  { name: "Fatima", meaning: "Captivating", gender: "female", origin: "Arabic", quranic: true },
  { name: "Omar", meaning: "Flourishing, long-lived", gender: "male", origin: "Arabic", quranic: true },
  { name: "Yusuf", meaning: "God increases", gender: "male", origin: "Arabic", quranic: true },
  { name: "Maryam", meaning: "Pious, beloved", gender: "female", origin: "Arabic", quranic: true },
  { name: "Ibrahim", meaning: "Father of nations", gender: "male", origin: "Arabic", quranic: true },
  { name: "Khadija", meaning: "Premature child", gender: "female", origin: "Arabic", quranic: true },
  { name: "Ali", meaning: "Exalted, noble", gender: "male", origin: "Arabic", quranic: true },
  { name: "Zainab", meaning: "Fragrant flower", gender: "female", origin: "Arabic", quranic: false },
  { name: "Hasan", meaning: "Beautiful, good", gender: "male", origin: "Arabic", quranic: true },
  { name: "Husain", meaning: "Beautiful, handsome", gender: "male", origin: "Arabic", quranic: true },
  { name: "Ruqayyah", meaning: "Elevated, gentle", gender: "female", origin: "Arabic", quranic: false },
  { name: "Salman", meaning: "Safe, secure", gender: "male", origin: "Arabic", quranic: false },
  { name: "Abdullah", meaning: "Servant of Allah", gender: "male", origin: "Arabic", quranic: true },
  { name: "Abdul Rahman", meaning: "Servant of the Most Merciful", gender: "male", origin: "Arabic", quranic: true },
  { name: "Ismail", meaning: "God hears", gender: "male", origin: "Arabic", quranic: true },
  { name: "Ishaq", meaning: "Laughter", gender: "male", origin: "Arabic", quranic: true },
  { name: "Ismat", meaning: "Purity, chastity", gender: "female", origin: "Arabic", quranic: false },
  { name: "Noor", meaning: "Light, radiance", gender: "unisex", origin: "Arabic", quranic: true },
  { name: "Salam", meaning: "Peace", gender: "unisex", origin: "Arabic", quranic: true },
  { name: "Rehman", meaning: "Most merciful", gender: "male", origin: "Arabic", quranic: true },
  { name: "Rahim", meaning: "Most compassionate", gender: "male", origin: "Arabic", quranic: true },
  { name: "Safiya", meaning: "Pure, serene", gender: "female", origin: "Arabic", quranic: false },
  { name: "Hafsa", meaning: "Cub, young lioness", gender: "female", origin: "Arabic", quranic: true },
  { name: "Safi", meaning: "Pure, clear", gender: "male", origin: "Arabic", quranic: false },
  { name: "Talha", meaning: "A type of tree", gender: "male", origin: "Arabic", quranic: false },
  { name: "Ubaid", meaning: "Small servant", gender: "male", origin: "Arabic", quranic: false },
  { name: "Zubair", meaning: "Strong, powerful", gender: "male", origin: "Arabic", quranic: false },
  { name: "Amina", meaning: "Trustworthy, faithful", gender: "female", origin: "Arabic", quranic: true },
  { name: "Safiya", meaning: "Pure, serene", gender: "female", origin: "Arabic", quranic: false },
  { name: "Zara", meaning: "Flower, blooming flower", gender: "female", origin: "Arabic", quranic: false },
  { name: "Rania", meaning: "Gazing, content", gender: "female", origin: "Arabic", quranic: false },
  { name: "Dania", meaning: "Close, near", gender: "female", origin: "Arabic", quranic: true },
  { name: "Luqman", meaning: "Wise, prudent", gender: "male", origin: "Arabic", quranic: true },
  { name: "Sulaiman", meaning: "Man of peace", gender: "male", origin: "Arabic", quranic: true },
  { name: "Dawud", meaning: "Beloved", gender: "male", origin: "Arabic", quranic: true },
  { name: "Zakariya", meaning: "Remembered by God", gender: "male", origin: "Arabic", quranic: true },
  { name: "Yahya", meaning: "Alive, living", gender: "male", origin: "Arabic", quranic: true },
  { name: "Nuh", meaning: "Rest, comfort", gender: "male", origin: "Arabic", quranic: true },
  { name: "Huda", meaning: "Guidance", gender: "female", origin: "Arabic", quranic: false },
  { name: "Tasnim", meaning: "A fountain in paradise", gender: "female", origin: "Arabic", quranic: true },
  { name: "Jannah", meaning: "Paradise, garden", gender: "female", origin: "Arabic", quranic: true },
  { name: "Sakinah", meaning: "Tranquility, peace", gender: "female", origin: "Arabic", quranic: true },
  { name: "Iman", meaning: "Faith, belief", gender: "female", origin: "Arabic", quranic: false },
  { name: "Saif", meaning: "Sword", gender: "male", origin: "Arabic", quranic: false },
  { name: "Burhan", meaning: "Proof, evidence", gender: "male", origin: "Arabic", quranic: false },
  { name: "Taha", meaning: "Pure, clean", gender: "male", origin: "Arabic", quranic: true },
];

const LS_KEY = "slashai.name.favorites";

function IslamicNameFinder() {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState<"all" | "male" | "female" | "unisex">("all");
  const [quranicOnly, setQuranicOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; } });

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(favorites)); } catch {} }, [favorites]);

  const filtered = useMemo(() => {
    return NAMES_DB.filter(n => {
      if (gender !== "all" && n.gender !== gender) return false;
      if (quranicOnly && !n.quranic) return false;
      if (search) {
        const q = search.toLowerCase();
        return n.name.toLowerCase().includes(q) || n.meaning.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, gender, quranicOnly]);

  const toggleFav = (name: string) => setFavorites(f => f.includes(name) ? f.filter(n => n !== name) : [...f, name]);

  return (
    <AppShell title="Islamic Names">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕌 Islamic Baby Name Finder</h1>
        <p className="mt-1 text-sm text-muted-foreground">50+ curated names with meanings, origin, and Quranic status.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or meaning..."
          className="h-10 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary/60 focus:outline-none" />

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "male", "female", "unisex"] as const).map(g => (
            <button key={g} onClick={() => setGender(g)} className={`rounded-lg border px-2.5 py-1 text-xs capitalize transition-colors ${gender === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{g}</button>
          ))}
          <button onClick={() => setQuranicOnly(!quranicOnly)} className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${quranicOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            Quranic Only {quranicOnly ? "✓" : ""}
          </button>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} names</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map(n => (
            <div key={n.name} className="flex items-start justify-between rounded-xl border border-border bg-surface p-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{n.name}</p>
                  {n.quranic && <span className="rounded bg-primary/10 px-1 text-[8px] text-primary">Quranic</span>}
                  <span className="text-[10px] text-muted-foreground capitalize">{n.gender}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.meaning}</p>
                <p className="text-[10px] text-muted-foreground">Origin: {n.origin}</p>
              </div>
              <button onClick={() => toggleFav(n.name)} className={`text-lg ${favorites.includes(n.name) ? "" : "opacity-30"}`}>{favorites.includes(n.name) ? "⭐" : "☆"}</button>
            </div>
          ))}
        </div>

        {favorites.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="mb-2 text-xs font-semibold text-foreground">⭐ Favorites ({favorites.length})</p>
            <div className="flex flex-wrap gap-1">
              {favorites.map(f => <span key={f} className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-foreground">{f}</span>)}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
