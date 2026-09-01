import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/hub/arabic")({
  head: () => ({
    meta: [
      { title: "Arabic Learners Hub — Free Resources | SlashAI" },
      { name: "description", content: "Free Arabic learning resources: alphabet chart, courses, keyboard, grammar, and common phrases." },
    ],
  }),
  component: ArabicHub,
});

const RESOURCES = [
  { title: "Madinah Arabic Books", desc: "Free PDF textbooks — the gold standard for learning Arabic", url: "https://www.madinaharabic.com/", icon: "📚" },
  { title: "Bayyinah Dream Program", desc: "Free podcast content by Nouman Ali Khan — understand the Quran in Arabic", url: "https://dream.bayyinah.com/", icon: "🎧" },
  { title: "Duolingo Arabic", desc: "Free interactive Arabic course — Modern Standard Arabic", url: "https://www.duolingo.com/course/ar/en", icon: "🦉" },
  { title: "Google Fonts — Arabic", desc: "Free Arabic web fonts: Amiri, Noto Naskh, Tajawal, Cairo", url: "https://fonts.google.com/?subset=arabic", icon: "🔤" },
];

const ALPHABET = [
  { letter: "ا", name: "Alif", sound: "a" }, { letter: "ب", name: "Baa", sound: "b" },
  { letter: "ت", name: "Taa", sound: "t" }, { letter: "ث", name: "Thaa", sound: "th" },
  { letter: "ج", name: "Jeem", sound: "j" }, { letter: "ح", name: "Haa", sound: "h" },
  { letter: "خ", name: "Khaa", sound: "kh" }, { letter: "د", name: "Dal", sound: "d" },
  { letter: "ذ", name: "Dhal", sound: "dh" }, { letter: "ر", name: "Raa", sound: "r" },
  { letter: "ز", name: "Zay", sound: "z" }, { letter: "س", name: "Seen", sound: "s" },
  { letter: "ش", name: "Sheen", sound: "sh" }, { letter: "ص", name: "Saad", sound: "s'" },
  { letter: "ض", name: "Daad", sound: "d'" }, { letter: "ط", name: "Taa", sound: "t'" },
  { letter: "ظ", name: "Dhaa", sound: "z'" }, { letter: "ع", name: "Ayn", sound: "3" },
  { letter: "غ", name: "Ghayn", sound: "gh" }, { letter: "ف", name: "Faa", sound: "f" },
  { letter: "ق", name: "Qaf", sound: "q" }, { letter: "ك", name: "Kaaf", sound: "k" },
  { letter: "ل", name: "Laam", sound: "l" }, { letter: "م", name: "Meem", sound: "m" },
  { letter: "ن", name: "Noon", sound: "n" }, { letter: "ه", name: "Haa", sound: "h" },
  { letter: "و", name: "Waaw", sound: "w" }, { letter: "ي", name: "Yaa", sound: "y" },
];

const PHRASES = [
  { arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", english: "In the name of Allah, the Most Gracious, the Most Merciful" },
  { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", english: "All praise is due to Allah, Lord of the worlds" },
  { arabic: "سُبْحَانَ اللَّه", english: "Glory be to Allah" },
  { arabic: "اللَّهُ أَكْبَر", english: "Allah is the Greatest" },
  { arabic: "أَسْتَغْفِرُ اللَّه", english: "I seek forgiveness from Allah" },
  { arabic: "لَا إِلَهَ إِلَّا اللَّه", english: "There is no god but Allah" },
  { arabic: "جَزَاكَ اللَّهُ خَيْرًا", english: "May Allah reward you with goodness" },
  { arabic: "إِنْ شَاءَ اللَّه", english: "If Allah wills" },
  { arabic: "مَا شَاءَ اللَّه", english: "What Allah has willed" },
  { arabic: "صَبَاحَ الْخَيْر", english: "Good morning" },
];

function ArabicHub() {
  return (
    <AppShell title="Arabic Learners Hub">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕌 Arabic Learners Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Free resources for 200M+ Arabic learners worldwide.</p>
      </header>

      {/* Resources */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Free Courses & Resources</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {RESOURCES.map((r) => (
            <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-[#484f58]">
              <span className="text-2xl">{r.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Alphabet */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Arabic Alphabet</h2>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {ALPHABET.map((a) => (
            <div key={a.letter} className="rounded-xl border border-border bg-surface p-3 text-center hover:border-[#484f58] transition-colors">
              <p className="text-2xl font-bold text-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>{a.letter}</p>
              <p className="text-[10px] text-primary mt-1">{a.name}</p>
              <p className="text-[10px] text-muted-foreground">{a.sound}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Phrases */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Essential Phrases for Salah</h2>
        <div className="space-y-2">
          {PHRASES.map((p) => (
            <div key={p.english} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-lg text-right text-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>{p.arabic}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.english}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Arabic Keyboard */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Arabic Keyboard</h2>
        <ArabicKeyboard />
      </section>
    </AppShell>
  );
}

function ArabicKeyboard() {
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const keyboardLayout = "ضصثقفغعهخحجدسشرطظكمن".split("");

  const type = (char: string) => setOutput((p: string) => p + char);
  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="min-h-[40px] rounded-lg border border-border bg-surface-elevated p-3 text-lg text-right" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
        {output || <span className="text-muted-foreground text-sm">Type here...</span>}
      </div>
      <div className="flex flex-wrap gap-1">
        {keyboardLayout.map((char) => (
          <button key={char} onClick={() => type(char)}
            className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-elevated text-lg hover:bg-primary/10 hover:border-primary/30 transition-colors"
            dir="rtl">{char}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setOutput((p: string) => p.slice(0, -1))} className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs text-muted-foreground hover:text-foreground">⌫</button>
        <button onClick={() => setOutput("")} className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Clear</button>
        <button onClick={copy} className="flex-1 rounded-lg bg-primary py-2 text-xs font-medium text-background hover:opacity-90">{copied ? "✓ Copied" : "Copy"}</button>
      </div>
    </div>
  );
}
