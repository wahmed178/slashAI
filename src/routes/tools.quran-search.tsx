import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/quran-search")({
  component: QuranSearch,
});

function QuranSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [surah, setSurah] = useState("");
  const [juz, setJuz] = useState("");

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en`);
      const d = await r.json();
      if (d.data && d.data.matches) {
        let matches = d.data.matches;
        if (surah) matches = matches.filter((m: any) => m.surah.number === Number(surah));
        setResults(matches.slice(0, 50));
      } else {
        setResults([]);
      }
    } catch { setResults([]); }
    setLoading(false);
  };

  return (
    <AppShell title="Quran Search">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📖 Quran Word Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search any word across the entire Quran. Arabic + English side by side.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any word or phrase..."
            className="flex-1 h-10 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:border-primary/50"
            onKeyDown={(e) => e.key === "Enter" && search()} />
          <button onClick={search} disabled={loading} className="rounded-xl bg-primary px-5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40">Search</button>
        </div>

        <div className="flex gap-2">
          <input value={surah} onChange={(e) => setSurah(e.target.value)} placeholder="Surah # (optional)" className="h-9 w-32 rounded-lg border border-border bg-surface px-3 text-xs focus:outline-none" />
          <input value={juz} onChange={(e) => setJuz(e.target.value)} placeholder="Juz # (optional)" className="h-9 w-32 rounded-lg border border-border bg-surface px-3 text-xs focus:outline-none" />
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">Searching...</div>
        ) : results.length > 0 ? (
          <>
            <p className="text-xs text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
            <div className="space-y-2">
              {results.map((r, i) => (
                <button key={i} onClick={() => setSelected(selected?.numberInSurah === r.numberInSurah && selected?.surah?.number === r.surah?.number ? null : r)}
                  className="w-full text-left rounded-xl border border-border bg-surface p-4 transition-all hover:border-[#484f58]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{r.surah?.englishName} {r.surah?.number}:{r.numberInSurah}</span>
                    <span className="text-[10px] text-muted-foreground">{r.surah?.revelationType}</span>
                  </div>
                  <p className="text-lg text-right leading-relaxed text-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>{r.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.edition?.name}</p>
                  {selected?.numberInSurah === r.numberInSurah && selected?.surah?.number === r.surah?.number && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-foreground">Click to copy</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : query && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">No results for "{query}"</div>
        )}

        {!query && !loading && (
          <div className="rounded-xl border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Type a word to search across all Surahs.</p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {["mercy", "patience", "paradise", "prayer", "believer", "light", "guidance", "truth"].map((w) => (
                <button key={w} onClick={() => { setQuery(w); setTimeout(search, 100); }}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">{w}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
