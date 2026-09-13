import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/void")({ component: Void });

function Void() {
  const [text, setText] = useState("");
  const [dissolving, setDissolving] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // dissolve: strip letters from both ends until nothing is left
  useEffect(() => {
    if (!dissolving) return;
    const t = window.setInterval(() => {
      setText((prev) => {
        if (prev.length === 0) {
          window.clearInterval(t);
          setDissolving(false);
          return "";
        }
        const cut = Math.max(1, Math.ceil(prev.length / 18));
        return prev.slice(cut, prev.length - cut);
      });
    }, 42);
    return () => window.clearInterval(t);
  }, [dissolving]);

  const scream = () => {
    if (!text.trim() || dissolving) return;
    setDissolving(true);
  };

  const onShout = () => {
    // if SpeechRecognition is around, shout out loud instead of typing
    const W = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!Ctor) {
      taRef.current?.focus();
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: SpeechEventLike) => {
      const said = e.results?.[0]?.[0]?.transcript ?? "";
      setText((prev) => (prev ? `${prev} ${said}` : said));
    };
    rec.start();
  };

  return (
    <AppShell title="Scream Into The Void" wide>
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕳️ Scream Into The Void</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Type it. Scream it. Then let the void take it. Nothing is stored, nothing is sent.
        </p>
      </header>

      <div className="mx-auto max-w-2xl">
        <div className={`rounded-2xl border bg-surface p-5 transition-colors ${dissolving ? "border-destructive/40" : "border-border"}`}>
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={dissolving}
            placeholder="AAAAARGH…"
            className={`void-text h-40 w-full resize-none bg-transparent text-center text-xl font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none ${dissolving ? "dissolving" : ""}`}
          />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={scream}
            disabled={!text.trim() || dissolving}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {dissolving ? "The void is listening…" : "Release it →"}
          </button>
          <button
            onClick={onShout}
            disabled={dissolving}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            🎤 Shout it
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Inspired by screamintothevoid.com — catharsis, zero consequences.
        </p>
      </div>
    </AppShell>
  );
}

/* minimal speech shapes so we don't need DOM lib iterables */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  onresult: ((e: SpeechEventLike) => void) | null;
}
interface SpeechEventLike {
  results?: { [index: number]: { [index: number]: { transcript: string } } };
}
