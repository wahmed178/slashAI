import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal YouTube iframe controller.
 *
 * The embed is loaded with `enablejsapi=1`, so once we send the `listening`
 * handshake it posts state back over `postMessage`. That gives us reliable
 * play/pause, seek, live position (for hand-off to youtube.com at the exact
 * timestamp) and an "ended" signal to advance a queue — without loading
 * YouTube's own API script.
 */
export type PlayerState = "unstarted" | "playing" | "paused" | "buffering" | "ended";

const ORIGIN = "https://www.youtube-nocookie.com";

const STATE_MAP: Record<number, PlayerState> = {
  [-1]: "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
};

export function useYouTubePlayer(onEnded: () => void) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [state, setState] = useState<PlayerState>("unstarted");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  const command = useCallback((func: string, args: unknown[] = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      ORIGIN,
    );
  }, []);

  /** Handshake — call whenever the iframe (re)loads. */
  const attach = useCallback(() => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), ORIGIN);
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || typeof e.data !== "string") return;
      let payload: { event?: string; info?: unknown };
      try {
        payload = JSON.parse(e.data);
      } catch {
        return;
      }
      const info = payload.info as
        { playerState?: number; currentTime?: number; duration?: number } | number | undefined;

      if (payload.event === "onStateChange") {
        const raw = typeof info === "number" ? info : info?.playerState;
        const next = STATE_MAP[raw ?? -1] ?? "unstarted";
        setState(next);
        if (next === "ended") endedRef.current();
      }
      if (payload.event === "infoDelivery" && info && typeof info === "object") {
        if (typeof info.currentTime === "number") setTime(info.currentTime);
        if (typeof info.duration === "number" && info.duration > 0) setDuration(info.duration);
        if (typeof info.playerState === "number") {
          const next = STATE_MAP[info.playerState] ?? "unstarted";
          setState(next);
          if (next === "ended") endedRef.current();
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return {
    frameRef,
    attach,
    state,
    time,
    duration,
    play: () => command("playVideo"),
    pause: () => command("pauseVideo"),
    toggle: () => command(state === "playing" ? "pauseVideo" : "playVideo"),
    seek: (seconds: number) => command("seekTo", [seconds, true]),
    mute: () => command("mute"),
    unmute: () => command("unMute"),
    reset: () => {
      setTime(0);
      setDuration(0);
      setState("unstarted");
    },
  };
}
