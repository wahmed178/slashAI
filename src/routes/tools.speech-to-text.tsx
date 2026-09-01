import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/speech-to-text")({ component: SpeechToText });

function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [supported] = useState(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));

  const start = useCallback(() => {
    if (!supported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      let interimText = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
        else interimText += event.results[i][0].transcript;
      }
      if (finalText) { setTranscript((p) => p + " " + finalText); setHistory((p) => [...p, finalText.trim()]); }
      setInterim(interimText);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [supported]);

  const stop = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const copy = async () => { await navigator.clipboard.writeText(transcript); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  const clear = () => { setTranscript(""); setInterim(""); setHistory([]); };

  return (
    <AppShell title="Speech to Text">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎤 Speech to Text</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time speech transcription using Web Speech API. 100% browser-based.</p>
      </header>
      <div className="mx-auto max-w-2xl space-y-4">
        {!supported ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">Speech recognition is not supported in this browser. Try Chrome or Edge.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <button onClick={isListening ? stop : start} className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${isListening ? "bg-red-500 text-white" : "bg-primary text-background hover:opacity-90"}`}>
                {isListening ? "⏹ Stop" : "🎤 Start Listening"}
              </button>
              <button onClick={copy} disabled={!transcript.trim()} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40">{copied ? "✓" : "Copy"}</button>
              <button onClick={clear} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground hover:text-foreground">Clear</button>
            </div>
            <div className="min-h-[200px] rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {transcript || <span className="text-muted-foreground">Transcription will appear here...</span>}
                {interim && <span className="text-muted-foreground italic"> {interim}</span>}
              </p>
            </div>
            {history.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Segments ({history.length})</p>
                <div className="space-y-1">
                  {history.map((h, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{i + 1}. {h}</p>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground text-center">Words: {transcript.trim().split(/\s+/).filter(Boolean).length} · Characters: {transcript.length}</p>
          </>
        )}
      </div>
    </AppShell>
  );
}
