import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { feedback } from "@/lib/play-sound";

export const Route = createFileRoute("/tools/morse-code")({
  head: () => ({
    meta: [
      { title: "Morse Code Translator - Free Browser Tool | SlashAI" },
      {
        name: "description",
        content:
          "Translate text to Morse code and back, with audio playback and a full reference chart. Free, no upload, works offline.",
      },
    ],
  }),
  component: MorseTool,
});

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.",
  "@": ".--.-.", "=": "-...-", "+": ".-.-.", "-": "-....-",
};

const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((ch) => MORSE[ch] ?? "")
        .filter(Boolean)
        .join(" "),
    )
    .filter(Boolean)
    .join(" / ");
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*|\s{3,}/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => REVERSE[code] ?? "")
        .join(""),
    )
    .join(" ");
}

function MorseTool() {
  const [text, setText] = useState("SOS we are here");
  const [morse, setMorse] = useState("... --- ... / .-- . / .- .-. . / .... . .-. .");
  const [dir, setDir] = useState<"t2m" | "m2t">("t2m");
  const [playing, setPlaying] = useState(false);

  const converted = useMemo(
    () => (dir === "t2m" ? textToMorse(text) : morseToText(morse)),
    [dir, text, morse],
  );

  const play = () => {
    const source = dir === "t2m" ? converted : morse;
    if (playing || !source) return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const unit = 0.08;
    let t = ctx.currentTime + 0.1;
    setPlaying(true);
    for (const symbol of source) {
      if (symbol === ".") {
        tone(ctx, t, unit);
        t += unit * 2;
      } else if (symbol === "-") {
        tone(ctx, t, unit * 3);
        t += unit * 4;
      } else if (symbol === " ") {
        t += unit * 2;
      } else if (symbol === "/") {
        t += unit * 4;
      }
    }
    window.setTimeout(() => {
      void ctx.close();
      setPlaying(false);
    }, (t - ctx.currentTime) * 1000 + 200);
  };

  const tone = (ctx: AudioContext, start: number, dur: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 650;
    gain.gain.setValueAtTime(0.5, start);
    gain.gain.setValueAtTime(0.5, start + dur - 0.01);
    gain.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur);
  };

  return (
    <AppShell title="Morse Code Translator">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">📡 Morse Code Translator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Two-way translation with real audio playback. Letters are separated by spaces, words by a
          slash.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(
            [
              ["t2m", "Text → Morse"],
              ["m2t", "Morse → Text"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setDir(m)}
              className={`h-9 flex-1 rounded-lg text-[12.5px] font-bold transition-colors ${
                dir === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {dir === "t2m" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            aria-label="Text to translate"
            className="w-full rounded-xl border border-border bg-surface p-3.5 text-[13.5px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        ) : (
          <textarea
            value={morse}
            onChange={(e) => setMorse(e.target.value)}
            rows={3}
            aria-label="Morse code to translate"
            className="w-full rounded-xl border border-border bg-surface p-3.5 font-mono text-[13.5px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        )}

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {dir === "t2m" ? "Morse code" : "Plain text"}
            </span>
            <div className="flex gap-1.5">
              {dir === "t2m" && (
                <button
                  type="button"
                  onClick={play}
                  disabled={playing || !converted}
                  className="ripple-press inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11.5px] font-semibold text-foreground transition-colors hover:border-primary/40 disabled:opacity-40"
                >
                  <Volume2 className="size-3.5" aria-hidden /> {playing ? "Playing…" : "Play audio"}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(converted).catch(() => {});
                  feedback("copy");
                }}
                className="ripple-press inline-flex h-8 items-center rounded-lg bg-primary px-3 text-[11.5px] font-bold text-primary-foreground"
              >
                Copy
              </button>
            </div>
          </div>
          <p
            className={`mt-2 break-words text-[14px] leading-relaxed text-foreground ${dir === "t2m" ? "font-mono tracking-wider" : ""}`}
          >
            {converted || <span className="text-muted-foreground">Nothing to translate yet</span>}
          </p>
        </div>

        {/* reference chart */}
        <details className="rounded-2xl border border-border bg-surface p-4">
          <summary className="cursor-pointer text-[13px] font-bold text-foreground">
            📖 Full reference chart
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
            {Object.entries(MORSE).map(([ch, code]) => (
              <p key={ch} className="flex items-baseline justify-between gap-2 border-b border-border/40 py-0.5 text-[12.5px]">
                <span className="font-bold uppercase text-foreground">{ch}</span>
                <span className="font-mono text-muted-foreground">{code}</span>
              </p>
            ))}
          </div>
        </details>
      </div>
    </AppShell>
  );
}
