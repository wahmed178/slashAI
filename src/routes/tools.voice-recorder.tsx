import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/voice-recorder")({ component: VoiceRecorder });

function fmt(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Recording {
  url: string;
  blob: Blob;
  seconds: number;
  at: string;
}

function VoiceRecorder() {
  const [state, setState] = useState<"idle" | "recording" | "denied">("idle");
  const [seconds, setSeconds] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);

  useEffect(() => () => {
    timerRef.current && clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setRecordings((prev) => [
          { url: URL.createObjectURL(blob), blob, seconds: Math.round((Date.now() - startedAt.current) / 1000), at: new Date().toLocaleTimeString() },
          ...prev,
        ]);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      rec.start(250);
      recorderRef.current = rec;
      startedAt.current = Date.now();
      setSeconds(0);
      setState("recording");
      timerRef.current = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 250);
    } catch {
      setState("denied");
      setError("Microphone access was blocked. Allow it in your browser's address bar and try again.");
    }
  };

  const stop = () => {
    timerRef.current && clearInterval(timerRef.current);
    recorderRef.current?.stop();
    recorderRef.current = null;
    setState("idle");
  };

  return (
    <AppShell title="Voice Recorder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎙️ Voice Recorder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Record voice notes in one tap — everything stays on your device, nothing is uploaded.</p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className={`mx-auto grid size-28 place-items-center rounded-full ${state === "recording" ? "bg-red-500/15" : "bg-primary/10"}`}>
            <div className={`grid size-20 place-items-center rounded-full ${state === "recording" ? "animate-pulse bg-red-500" : "bg-primary"}`}>
              <span className="text-3xl">🎙️</span>
            </div>
          </div>
          <div className="mt-4 font-mono text-3xl font-black tabular-nums text-foreground">{fmt(seconds)}</div>
          {state === "recording" ? (
            <button onClick={stop} className="mt-4 h-12 w-full rounded-xl bg-red-500 font-semibold text-white">■ Stop recording</button>
          ) : (
            <button onClick={() => void start()} className="mt-4 h-12 w-full rounded-xl bg-primary font-semibold text-background">● Start recording</button>
          )}
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        {recordings.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Your recordings ({recordings.length})</div>
            {recordings.map((r, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Clip {recordings.length - i} · {fmt(r.seconds)} · {r.at}</span>
                  <div className="flex gap-2">
                    <a href={r.url} download={`voice-note-${recordings.length - i}.webm`} className="rounded-lg bg-primary/10 px-3 py-1 font-semibold text-primary">Download</a>
                    <button onClick={() => setRecordings((prev) => prev.filter((_, j) => j !== i))} className="rounded-lg border border-border px-3 py-1 text-foreground">Delete</button>
                  </div>
                </div>
                <audio src={r.url} controls className="w-full" />
              </div>
            ))}
          </div>
        )}

        <FaqSection />
      </div>
    </AppShell>
  );
}
