import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/screen-recorder")({ component: ScreenRecorder });

function fmt(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ScreenRecorder() {
  const [state, setState] = useState<"idle" | "recording" | "error">("idle");
  const [withMic, setWithMic] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => () => {
    timerRef.current && clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const start = async () => {
    setError(null);
    setResult(null);
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true, // tab/system audio where the browser offers it
      });
      streamRef.current = display;

      const tracks = [...display.getVideoTracks()];
      if (withMic) {
        try {
          const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = mic;
          tracks.push(...mic.getAudioTracks());
        } catch {
          // mic denied is not fatal — record screen audio only
        }
      }

      const mixed = new MediaStream(tracks);
      const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
      const rec = mime ? new MediaRecorder(mixed, { mimeType: mime, videoBitsPerSecond: 5_000_000 }) : new MediaRecorder(mixed);
      chunksRef.current = [];

      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "video/webm" });
        setResult({ url: URL.createObjectURL(blob), size: blob.size });
        display.getTracks().forEach((t) => t.stop());
        micStreamRef.current?.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      };

      // user stopping share from the browser bar must also end the recording
      display.getVideoTracks()[0]!.addEventListener("ended", () => {
        if (recRef.current?.state === "recording") stopTimerAndRecorder();
      });

      rec.start(500);
      recRef.current = rec;
      setSeconds(0);
      setState("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e) {
      if (e instanceof DOMException && e.name === "NotAllowedError") {
        setError("Screen share was cancelled — pick a tab, window or screen and click Share to start recording.");
      } else {
        setError(e instanceof Error ? e.message : "Screen recording is not available in this browser. Try desktop Chrome or Edge.");
      }
      setState("error");
    }
  };

  const stopTimerAndRecorder = () => {
    timerRef.current && clearInterval(timerRef.current);
    recRef.current?.stop();
    recRef.current = null;
    setState("idle");
  };

  const stop = () => stopTimerAndRecorder();

  return (
    <AppShell title="Screen Recorder">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🖥️ Screen Recorder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Record a tab, a window or your whole screen — with optional microphone — right from the browser. No install, no watermark.</p>
      </header>

      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="text-5xl">{state === "recording" ? "🔴" : "🖥️"}</div>
          <div className="mt-3 font-mono text-3xl font-black tabular-nums text-foreground">{fmt(seconds)}</div>
          <label className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={withMic} onChange={(e) => setWithMic(e.target.checked)} className="accent-primary" disabled={state === "recording"} />
            Include microphone
          </label>
          {state === "recording" ? (
            <button onClick={stop} className="mt-4 h-12 w-full rounded-xl bg-red-500 font-semibold text-white">■ Stop & save</button>
          ) : (
            <button onClick={() => void start()} className="mt-4 h-12 w-full rounded-xl bg-primary font-semibold text-background">● Start screen recording</button>
          )}
        </div>

        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        {result && (
          <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Recording ready · {(result.size / 1024 / 1024).toFixed(1)} MB</span>
              <a href={result.url} download="screen-recording.webm" className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-background">Download</a>
            </div>
            <video src={result.url} controls className="w-full rounded-lg border border-border" />
          </div>
        )}

        <FaqSection />
      </div>
    </AppShell>
  );
}
