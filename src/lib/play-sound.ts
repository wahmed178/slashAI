/**
 * Tiny WebAudio click/whoosh generator so interactions feel tactile without
 * shipping any audio assets. Silently no-ops on the server or when muted.
 */
let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  void ctx.resume();
  return ctx;
}

const MUTE_KEY = "slashai.sound.muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

type Tone = "tap" | "flip" | "win" | "roll";

const TONES: Record<Tone, { from: number; to: number; ms: number; type: OscillatorType }> = {
  tap: { from: 520, to: 700, ms: 70, type: "triangle" },
  flip: { from: 300, to: 900, ms: 260, type: "sine" },
  roll: { from: 220, to: 480, ms: 200, type: "square" },
  win: { from: 660, to: 1320, ms: 380, type: "sine" },
};

export function playTone(tone: Tone = "tap") {
  if (isMuted()) return;
  const ac = context();
  if (!ac) return;
  const { from, to, ms, type } = TONES[tone];
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const now = ac.currentTime;
  const end = now + ms / 1000;

  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, end);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(end + 0.02);
}

/** Short haptic buzz on devices that support it. */
export function buzz(ms = 12) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(ms);
  } catch {
    /* ignore */
  }
}

export function feedback(tone: Tone = "tap") {
  playTone(tone);
  buzz(tone === "tap" ? 8 : 18);
}
