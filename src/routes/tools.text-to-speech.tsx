import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/text-to-speech")({ component: TextToSpeech });

function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice list loads asynchronously in most browsers.
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) {
        setVoices(list);
        setVoiceURI((cur) => cur || list.find((v) => v.default)?.voiceURI || list[0]!.voiceURI);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const grouped = useMemo(() => {
    const byLang = new Map<string, SpeechSynthesisVoice[]>();
    voices.forEach((v) => {
      const lang = v.lang.slice(0, 2).toLowerCase();
      byLang.set(lang, [...(byLang.get(lang) ?? []), v]);
    });
    return [...byLang.entries()].sort((x, y) => x[0].localeCompare(y[0]));
  }, [voices]);

  const speak = () => {
    if (!("speechSynthesis" in window) || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // typeof guard: this component also renders on the server, where window is undefined
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return (
      <AppShell title="Text to Speech">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="text-4xl">🔇</div>
          <p className="mt-3 text-sm text-muted-foreground">Your browser doesn't support the Web Speech API. Try Chrome, Edge or Safari.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Text to Speech">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔊 Text to Speech</h1>
        <p className="mt-1 text-sm text-muted-foreground">Type anything and hear it read aloud in dozens of voices and languages — free, offline, no limits.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Paste an article, a paragraph, vocabulary words…"
          className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
          <label className="block">
            <span className="text-xs text-muted-foreground">Voice ({voices.length} installed)</span>
            <select value={voiceURI} onChange={(e) => setVoiceURI(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground">
              {grouped.map(([lang, list]) => (
                <optgroup key={lang} label={lang.toUpperCase()}>
                  {list.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 text-xs text-muted-foreground">
              Speed {rate.toFixed(1)}×
              <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="flex-1 accent-primary" />
            </label>
            <label className="flex items-center gap-3 text-xs text-muted-foreground">
              Pitch {pitch.toFixed(1)}
              <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="flex-1 accent-primary" />
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={speak} disabled={!text.trim() || speaking} className="h-12 flex-1 rounded-xl bg-primary font-semibold text-background disabled:opacity-40">
            {speaking ? "Speaking…" : "▶ Speak"}
          </button>
          {speaking && <button onClick={stop} className="h-12 rounded-xl border border-border px-6 text-sm font-semibold text-foreground">Stop</button>}
        </div>

        <FaqSection />
      </div>
    </AppShell>
  );
}
