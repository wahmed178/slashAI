import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/arabic-keyboard")({ component: ArabicKeyboard });

const arabicLayout = [
  ["ض","ص","ث","ق","ف","غ","ع","ه","خ","ح","ج","ش"],
  ["س","ي","ب","ل","ا","ت","ن","م","ك","ط"],
  ["ئ","ء","ؤ","ر","ل","ى","ة","و","ز","ظ"],
];

const romanMap: Record<string, string> = {
  a:"ا", b:"ب", t:"ت", th:"ث", j:"ج", "7":"ح", kh:"خ", d:"د", "dh":"ذ", r:"ر", z:"ز", s:"س", sh:"ش", "'": "ع", gh:"غ", f:"ف", q:"ق", k:"ك", l:"ل", m:"م", n:"ن", h:"ه", w:"و", y:"ي", "2":"ء",
};

const harakat = ["َ", "ُ", "ِ", "ْ", "ّ", "ً", "ٌ", "ٍ"];
const harakatNames = ["Fathah", "Kasrah", "Dammah", "Sukun", "Shadda", "Tanwin Fath", "Tanwin Damm", "Tanwin Kasr"];

const phrases = [
  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  "سُبْحَانَ اللَّه",
  "لَا إِلَهَ إِلَّا اللَّهُ",
  "اللَّهُ أَكْبَرُ",
  "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
  "أَسْتَغْفِرُ اللَّه",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه",
  "مَا شَاءَ اللَّه",
  "جَزَاكَ اللَّهُ خَيْرًا",
  "رَحِمَهُ اللَّه",
  "اللَّهُمَّ صَلِّ عَلَى مُحَمَّد",
];

export default function ArabicKeyboard() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"visual" | "roman">("visual");
  const [showPhrases, setShowPhrases] = useState(false);
  const [fontSize, setFontSize] = useState(24);

  const insertChar = useCallback((char: string) => {
    setText((prev) => prev + char);
  }, []);

  const insertHarakat = useCallback((h: string) => {
    setText((prev) => prev + h);
  }, []);

  const insertPhrase = useCallback((p: string) => {
    setText((prev) => prev + (prev ? "\n" : "") + p);
  }, []);

  const handleRomanInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let arabic = "";
    let i = 0;
    while (i < val.length) {
      let found = false;
      for (const len of [3, 2, 1]) {
        const chunk = val.slice(i, i + len).toLowerCase();
        if (romanMap[chunk]) {
          arabic += romanMap[chunk];
          i += len;
          found = true;
          break;
        }
      }
      if (!found) {
        arabic += val[i];
        i++;
      }
    }
    setText(arabic);
  };

  const downloadPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 200;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#161b22";
    ctx.fillRect(0, 0, 800, 200);
    ctx.fillStyle = "#f0f6fc";
    ctx.font = `${fontSize * 1.5}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = text.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(line, 400, 60 + i * 60, 750);
    });

    const link = document.createElement("a");
    link.download = "arabic-text.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">⌨️ Arabic Keyboard</h1>
          <p className="text-sm text-muted-foreground">Type in Arabic without an Arabic keyboard</p>
        </div>

        <div className="flex gap-1 rounded-xl bg-surface p-1">
          <button onClick={() => setMode("visual")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${mode === "visual" ? "bg-primary text-background" : "text-muted-foreground"}`}>Visual Keyboard</button>
          <button onClick={() => setMode("roman")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${mode === "roman" ? "bg-primary text-background" : "text-muted-foreground"}`}>Romanized Input</button>
        </div>

        {/* Text area */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div dir="rtl" className="min-h-[120px] rounded-lg bg-background p-4 text-foreground focus:outline-none" style={{ fontSize, lineHeight: 1.8, direction: "rtl", textAlign: "right" }}>
            {text || <span className="text-muted-foreground/50">اكتب هنا...</span>}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Size:</span>
            {[{ label: "S", value: 16 }, { label: "M", value: 24 }, { label: "L", value: 36 }, { label: "XL", value: 48 }].map((s) => (
              <button key={s.label} onClick={() => setFontSize(s.value)} className={`rounded px-2 py-1 text-xs ${fontSize === s.value ? "bg-primary text-background" : "bg-background text-muted-foreground border border-border"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "roman" && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Romanized Input</h3>
            <p className="mb-2 text-xs text-muted-foreground">Type in English letters → converts to Arabic</p>
            <input type="text" onChange={handleRomanInput} placeholder="Type: bismillah → بسم الله" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(romanMap).slice(0, 20).map(([k, v]) => (
                <span key={k} className="rounded bg-background px-1.5 py-0.5 text-xs text-muted-foreground">{k}→{v}</span>
              ))}
            </div>
          </div>
        )}

        {mode === "visual" && (
          <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
            {arabicLayout.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1">
                {row.map((letter) => (
                  <button key={letter} onClick={() => insertChar(letter)} className="flex h-11 w-11 items-center justify-center rounded-lg bg-background text-lg font-medium text-foreground transition-colors hover:bg-primary/20 active:bg-primary/30">
                    {letter}
                  </button>
                ))}
              </div>
            ))}
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              <span className="mx-2 flex items-center text-xs text-muted-foreground">Diacritics:</span>
              {harakat.map((h, i) => (
                <button key={h} onClick={() => insertHarakat(h)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary transition-colors hover:bg-primary/20" title={harakatNames[i]}>
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => navigator.clipboard?.writeText(text)} className="flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm text-foreground hover:bg-background">📋 Copy</button>
          <button onClick={() => setText("")} className="flex-1 rounded-xl border border-border bg-surface py-2.5 text-sm text-foreground hover:bg-background">🗑 Clear</button>
          <button onClick={downloadPNG} disabled={!text} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-40">⬇ PNG</button>
        </div>

        <div className="rounded-xl border border-border bg-surface">
          <button onClick={() => setShowPhrases(!showPhrases)} className="flex w-full items-center justify-between p-4 text-sm font-semibold text-foreground">
            <span>📖 Common Islamic Phrases</span>
            <span className="text-muted-foreground">{showPhrases ? "▲" : "▼"}</span>
          </button>
          {showPhrases && (
            <div className="space-y-1 px-4 pb-4">
              {phrases.map((p) => (
                <button key={p} onClick={() => insertPhrase(p)} className="w-full rounded-lg bg-background p-3 text-right text-lg text-foreground transition-colors hover:bg-primary/10" dir="rtl">
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
