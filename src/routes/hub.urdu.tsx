import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/hub/urdu")({ component: UrduHub });

const RESOURCES = [
  { name: "Rekhta", desc: "World's largest free Urdu poetry collection", url: "https://rekhta.org", emoji: "📖", category: "Poetry" },
  { name: "Urdu Web Kosh", desc: "Online Urdu dictionary with word meanings", url: "https://urduwebkosh.com", emoji: "📕", category: "Dictionary" },
  { name: "Google Noto Nastaliq", desc: "Free Urdu font — best for Nastaliq script", url: "https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu", emoji: "🔤", category: "Fonts" },
  { name: "Pak Urdu Keyboard", desc: "Virtual Urdu keyboard — type in Nastaliq", url: "https://pak urdu keyboard.com", emoji: "⌨️", category: "Tools" },
  { name: "Khan Academy Urdu", desc: "Free Urdu courses on math, science, computing", url: "https://ka urdu.org", emoji: "🎓", category: "Learning" },
  { name: "BBC Urdu", desc: "News and features in Urdu", url: "https://bbc urdu.com", emoji: "📰", category: "News" },
  { name: "Voice of America Urdu", desc: "Urdu news and current affairs", url: "https://urdu voanews.com", emoji: "📻", category: "News" },
  { name: "HamariWeb Urdu", desc: "Urdu literature and resources", url: "https://hamariweb.com/urdu", emoji: "📚", category: "Literature" },
];

const POETS = [
  { name: "Mirza Ghalib", era: "1797–1869", known: "Ghazal master, Delhi Urdu", famous: "Hazaaron Khwahishen Aisi" },
  { name: "Allama Iqbal", era: "1877–1938", known: "Poet-philosopher of the East", famous: "Shikwa, Jawaab-e-Shikwa" },
  { name: "Faiz Ahmed Faiz", era: "1911–1984", known: "Progressive poetry, Lahore", famous: "Mujh Se Pehli Si Mohabbat" },
  { name: "Mir Taqi Mir", era: "1723–1810", known: "Father of Urdu poetry", famous: "Dikhai Diye Yun" },
  { name: "Ahmad Faraz", era: "1931–2008", known: "Modern romantic ghazal", famous: "Ranjish Hi Sahi" },
  { name: "Sahir Ludhianvi", era: "1921–1980", known: "Film lyrics + revolutionary verse", famous: "Chin Taashing" },
  { name: "Parveen Shakir", era: "1952–1994", known: "Modern women's Urdu poetry", famous: "Kuch Toh Majbooriyan" },
  { name: "Josh Malihabadi", era: "1894–1982", known: "Poet of revolution", famous: "Shola-o-Shabnam" },
];

const GHAZALS = [
  { poet: "Mirza Ghalib", verse: "Hazaaron khwahishen aisi ke har khwahish pe dam nikle\nBahut nikle mere armaan lekin phir bhi kam nikle" },
  { poet: "Faiz Ahmed Faiz", verse: "Mujh se pehli si mohabbat mere mehboob na maang\nMaine samjha tha ke ishq ke liye kuch nahi baaki" },
  { poet: "Ahmad Faraz", verse: "Ranjish hi sahi dil hi dukhaane ke liye aa\nAa phir se mujhe chhod ke jaane ke liye aa" },
  { poet: "Mir Taqi Mir", verse: "Dikhai diye yun ke bekhud kiya\nHamein aap se bhi juda kar chale" },
  { poet: "Allama Iqbal", verse: "Sitaron se aage jahan aur bhi hain\nAbhi ishq ke imtihan aur bhi hain" },
];

function UrduHub() {
  return (
    <AppShell title="Urdu Writers Hub">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🇵🇰 Urdu Writers Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resources for Urdu language writers, poets, and readers. 400M+ Urdu speakers served.</p>
      </header>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Resources */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">📚 Resources</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {RESOURCES.map(r => (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/40">
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                  <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[8px] text-muted-foreground">{r.category}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Famous Poets */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">✨ Famous Urdu Poets</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {POETS.map(p => (
              <div key={p.name} className="rounded-xl border border-border bg-surface p-3">
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.era} · {p.known}</p>
                <p className="mt-1 text-xs text-primary">Famous: {p.famous}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Ghazals */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">🌹 Famous Ghazals</h2>
          <div className="space-y-3">
            {GHAZALS.map((g, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4">
                <p className="mb-1 text-xs font-medium text-primary">{g.poet}</p>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }}>
                  {g.verse}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
