import { useState, useRef, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/noise")({
  component: NoiseGenerator,
});

type NoiseType = "white" | "brown" | "pink" | "rain" | "cafe" | "ocean" | "forest";

const NOISES: { type: NoiseType; label: string; icon: string; desc: string }[] = [
  { type: "white", label: "White Noise", icon: "📻", desc: "Static hiss, blocks all frequencies" },
  { type: "brown", label: "Brown Noise", icon: "🌊", desc: "Deep rumble, most soothing" },
  { type: "pink", label: "Pink Noise", icon: "🩷", desc: "Balanced, like steady rain" },
  { type: "rain", label: "Rain", icon: "🌧️", desc: "Gentle rainfall ambience" },
  { type: "cafe", label: "Cafe", icon: "☕", desc: "Coffee shop murmur" },
  { type: "ocean", label: "Ocean Waves", icon: "🏖️", desc: "Rolling wave pattern" },
  { type: "forest", label: "Forest", icon: "🌲", desc: "Wind through trees" },
];

const TIMERS = [
  { label: "25 min", value: 25 * 60 },
  { label: "45 min", value: 45 * 60 },
  { label: "60 min", value: 60 * 60 },
  { label: "90 min", value: 90 * 60 },
];

function NoiseGenerator() {
  const [active, setActive] = useState<Set<NoiseType>>(new Set());
  const [volume, setVolume] = useState(0.5);
  const [timer, setTimer] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { gain: GainNode; source: AudioBufferSourceNode | OscillatorNode }>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const createNoiseBuffer = (ctx: AudioContext, type: NoiseType): AudioBuffer => {
    const sr = ctx.sampleRate;
    const len = sr * 4;
    const buf = ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    if (type === "white" || type === "rain" || type === "cafe" || type === "forest") {
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } else if (type === "brown") {
      let last = 0;
      for (let i = 0; i < len; i++) { last = (last + (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5; }
    } else {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; }
    }
    return buf;
  };

  const startNoise = useCallback((type: NoiseType) => {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.gain.value = type === "rain" || type === "cafe" || type === "forest" ? volume * 0.6 : volume * 0.4;
    gain.connect(ctx.destination);
    const buf = createNoiseBuffer(ctx, type);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    // Add filtering for different sounds
    if (type === "rain" || type === "forest") {
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 800;
      src.connect(lpf);
      lpf.connect(gain);
    } else if (type === "cafe") {
      const hpf = ctx.createBiquadFilter();
      hpf.type = "highpass";
      hpf.frequency.value = 400;
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 2000;
      src.connect(hpf);
      hpf.connect(lpf);
      lpf.connect(gain);
    } else if (type === "ocean") {
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 500;
      src.connect(lpf);
      lpf.connect(gain);
      // Modulate for wave effect
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(lpf.frequency);
      lfo.start();
    } else {
      src.connect(gain);
    }

    src.start();
    nodesRef.current[type] = { gain, source: src };
  }, [getCtx, volume]);

  const stopNoise = useCallback((type: NoiseType) => {
    const node = nodesRef.current[type];
    if (node) {
      node.source.stop();
      node.gain.disconnect();
      delete nodesRef.current[type];
    }
  }, []);

  const toggle = (type: NoiseType) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
        stopNoise(type);
      } else {
        next.add(type);
        startNoise(type);
      }
      return next;
    });
  };

  const stopAll = useCallback(() => {
    active.forEach((type) => stopNoise(type));
    setActive(new Set());
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(0);
    setTimer(null);
  }, [active, stopNoise]);

  useEffect(() => {
    active.forEach((type) => {
      const node = nodesRef.current[type];
      if (node) {
        const isFiltered = type === "rain" || type === "cafe" || type === "forest" || type === "ocean";
        node.gain.gain.value = isFiltered ? volume * 0.6 : volume * 0.4;
      }
    });
  }, [volume, active]);

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setRemaining(seconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { stopAll(); return 0; }
        return r - 1;
      });
    }, 1000);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppShell title="Background Noise Generator">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔊 Background Noise Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Synthesised ambient sounds — mix multiple, set a timer. Zero audio files.</p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Sound tiles */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {NOISES.map((n) => (
            <button key={n.type} onClick={() => toggle(n.type)}
              className={`rounded-xl border p-4 text-left transition-all ${active.has(n.type) ? "border-primary/40 bg-primary/10" : "border-border bg-surface hover:bg-surface-elevated"}`}>
              <span className="text-2xl">{n.icon}</span>
              <p className={`mt-1 text-sm font-medium ${active.has(n.type) ? "text-primary" : "text-foreground"}`}>{n.label}</p>
              <p className="text-[10px] text-muted-foreground">{n.desc}</p>
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground">Master Volume</label>
            <span className="text-xs font-medium text-foreground">{Math.round(volume * 100)}%</span>
          </div>
          <input type="range" min={0} max={100} value={Math.round(volume * 100)} onChange={(e) => setVolume(Number(e.target.value) / 100)} className="w-full accent-primary" />
        </div>

        {/* Timer */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Auto-stop Timer</p>
          <div className="flex gap-2">
            {TIMERS.map((t) => (
              <button key={t.value} onClick={() => startTimer(t.value)}
                className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${timer === t.value ? "bg-primary text-background" : "border border-border bg-surface-elevated text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>
          {remaining > 0 && <p className="mt-2 text-center text-sm font-mono text-primary">{formatTime(remaining)}</p>}
        </div>

        {active.size > 0 && (
          <button onClick={stopAll} className="w-full rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
            Stop All Sounds ({active.size} active)
          </button>
        )}
      </div>
    </AppShell>
  );
}
