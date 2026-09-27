/**
 * The handheld that wraps a SlashPlay game.
 *
 * The hardware is decorative but the controls are not: the d-pad and buttons
 * dispatch real keyboard events on `window`, which is the interface every
 * keyboard-driven game in the catalogue already listens for. So the d-pad
 * genuinely steers Snake, 2048 and Breakout without a single game needing to
 * know this component exists.
 *
 * Games that suit a normal page (see lib/gameboy) never get wrapped.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GameCover } from "@/components/library/GameCover";
import { getPlayGame } from "@/lib/slashplay";
import { playTone } from "@/lib/play-sound";

const SHELL_KEY = "slashai:handheld";

/** what each physical control sends to the game */
const BUTTON_KEYS: Record<string, string> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  a: " ",
  b: "Escape",
  start: "Enter",
  select: "Shift",
};

function press(key: string) {
  const code = BUTTON_KEYS[key];
  if (!code) return;
  const init = { key: code, code, bubbles: true, cancelable: true } as KeyboardEventInit;
  window.dispatchEvent(new KeyboardEvent("keydown", init));
  playTone("tap");
  // a quick keyup so a game that tracks held keys does not get stuck
  window.setTimeout(() => window.dispatchEvent(new KeyboardEvent("keyup", init)), 60);
}

/** a pad that repeats while you hold it down, like the real thing */
function HoldButton({
  label,
  onPress,
  className,
  children,
  ariaLabel,
}: {
  label: string;
  onPress: () => void;
  className?: string;
  children: ReactNode;
  ariaLabel: string;
}) {
  const [down, setDown] = useState(false);
  const delay = useRef<number | undefined>(undefined);
  const repeat = useRef<number | undefined>(undefined);

  const stop = useCallback(() => {
    setDown(false);
    if (delay.current) window.clearTimeout(delay.current);
    if (repeat.current) window.clearInterval(repeat.current);
    delay.current = undefined;
    repeat.current = undefined;
  }, []);

  const begin = useCallback(() => {
    if (delay.current || repeat.current) return;
    setDown(true);
    onPress();
    delay.current = window.setTimeout(() => {
      repeat.current = window.setInterval(onPress, 110);
    }, 320);
  }, [onPress]);

  useEffect(() => stop, [stop]);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        e.preventDefault();
        begin();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          begin();
        }
      }}
      onKeyUp={stop}
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none transition-[transform,filter] duration-75 active:scale-95 ${
        down ? "brightness-110" : ""
      } ${className ?? ""}`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function GameBoyFrame({ slug, children }: { slug: string; children: ReactNode }) {
  const [shell, setShell] = useState<"on" | "off">(() => {
    try {
      return localStorage.getItem(SHELL_KEY) === "off" ? "off" : "on";
    } catch {
      return "on";
    }
  });
  const game = getPlayGame(slug);
  const name = game?.name ?? slug;

  if (shell === "off") {
    return (
      <div>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setShell("on");
              try {
                localStorage.setItem(SHELL_KEY, "on");
              } catch {
                /* private mode */
              }
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            📟 Handheld view
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[560px]">
      {/* ── the device ── */}
      <div
        className="relative rounded-[2.2rem] p-3 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)] sm:rounded-[2.6rem] sm:p-4"
        style={{
          background: "linear-gradient(160deg, #e8614f 0%, #d1493a 45%, #a8322a 100%)",
        }}
      >
        {/* power lamp */}
        <div className="mb-2 flex items-center justify-between px-2 sm:mb-3">
          <span className="text-[9px] font-black uppercase tracking-[0.28em] text-red-950/70">
            SlashPlay
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-300 shadow-[0_0_8px_2px_rgba(252,165,165,0.9)]" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-red-950/60">
              power
            </span>
          </span>
        </div>

        {/* screen bezel */}
        <div className="rounded-xl bg-gradient-to-b from-[#3b3b46] to-[#22222b] p-2.5 shadow-inner sm:p-3">
          <div
            className="relative overflow-hidden rounded-md bg-[#9ead7f] ring-1 ring-black/40"
            style={{ aspectRatio: "4 / 3" }}
          >
            {/* scanlines + screen tint, purely cosmetic and pointer-safe */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 opacity-[0.16]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 1px, transparent 1px 3px)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.10), transparent 70%)",
              }}
            />
            <div className="relative h-full w-full overflow-y-auto overscroll-contain p-1.5 sm:p-2">
              {children}
            </div>
          </div>

          {/* cartridge label below the screen */}
          <div className="mt-2.5 flex items-center gap-2.5 px-0.5 sm:mt-3">
            <div className="h-9 w-12 shrink-0 overflow-hidden rounded bg-black/20 ring-1 ring-black/30">
              <GameCover slug={slug} radius={5} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-black uppercase tracking-wider text-[#f5e6d3]">
                {name}
              </p>
              <p className="truncate text-[9px] text-[#f5e6d3]/60">
                {game?.desc ?? "SlashPlay cartridge"}
              </p>
            </div>
          </div>
        </div>

        {/* ── controls ── */}
        <div className="mt-3 flex items-center justify-between gap-2 px-1 sm:mt-4 sm:px-2">
          {/* d-pad */}
          <div className="relative grid size-[104px] shrink-0 grid-cols-3 grid-rows-3 sm:size-[116px]">
            <div className="col-start-2 row-start-1" />
            <div className="col-start-1 row-start-2" />
            <div className="col-start-2 row-start-2" />
            <div className="col-start-3 row-start-2" />
            <div className="col-start-2 row-start-3" />

            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4b4b55] shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-[58%] w-[30%] -translate-x-1/2 rounded-t-[6px] bg-[#3a3a44] shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 h-[58%] w-[30%] -translate-x-1/2 rounded-b-[6px] bg-[#3a3a44] shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-1/2 h-[30%] w-[58%] -translate-y-1/2 rounded-l-[6px] bg-[#3a3a44] shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 h-[30%] w-[58%] -translate-y-1/2 rounded-r-[6px] bg-[#3a3a44] shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
            />

            <HoldButton
              label="Up"
              ariaLabel="Up"
              onPress={() => press("up")}
              className="col-start-2 row-start-1 z-10 flex items-start justify-center pt-0.5 text-[#1c1c22]"
            >
              <span className="text-[11px] leading-none">▲</span>
            </HoldButton>
            <HoldButton
              label="Down"
              ariaLabel="Down"
              onPress={() => press("down")}
              className="col-start-2 row-start-3 z-10 flex items-end justify-center pb-0.5 text-[#1c1c22]"
            >
              <span className="text-[11px] leading-none">▼</span>
            </HoldButton>
            <HoldButton
              label="Left"
              ariaLabel="Left"
              onPress={() => press("left")}
              className="col-start-1 row-start-2 z-10 flex items-center justify-start pl-0.5 text-[#1c1c22]"
            >
              <span className="text-[11px] leading-none">◀</span>
            </HoldButton>
            <HoldButton
              label="Right"
              ariaLabel="Right"
              onPress={() => press("right")}
              className="col-start-3 row-start-2 z-10 flex items-center justify-end pr-0.5 text-[#1c1c22]"
            >
              <span className="text-[11px] leading-none">▶</span>
            </HoldButton>
          </div>

          {/* centre: start / select */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex rotate-[-24deg] gap-3">
              <HoldButton
                label="Select"
                ariaLabel="Select"
                onPress={() => press("select")}
                className="rounded-full bg-[#3a3a44] px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#c9c9d4] shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                Select
              </HoldButton>
              <HoldButton
                label="Start"
                ariaLabel="Start"
                onPress={() => press("start")}
                className="rounded-full bg-[#3a3a44] px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#c9c9d4] shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                Start
              </HoldButton>
            </div>
          </div>

          {/* a / b */}
          <div className="flex shrink-0 rotate-[-24deg] items-center gap-3 pr-1">
            <HoldButton
              label="B"
              ariaLabel="B"
              onPress={() => press("b")}
              className="flex size-11 items-center justify-center rounded-full bg-[#2f2f38] text-[11px] font-black text-[#b9b9c6] shadow-[0_3px_6px_rgba(0,0,0,0.6)] ring-1 ring-black/40 sm:size-12"
            >
              B
            </HoldButton>
            <HoldButton
              label="A"
              ariaLabel="A"
              onPress={() => press("a")}
              className="flex size-11 items-center justify-center rounded-full bg-[#a03a2e] text-[11px] font-black text-[#ffe4d6] shadow-[0_3px_6px_rgba(0,0,0,0.6)] ring-1 ring-black/40 sm:size-12"
            >
              A
            </HoldButton>
          </div>
        </div>

        {/* speaker */}
        <div aria-hidden className="mx-auto mt-3 flex h-2 w-28 justify-end gap-1 sm:mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="h-full w-1.5 rounded-full bg-[#8f2f24] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-center text-[11px] text-muted-foreground sm:text-xs">
          D-pad and buttons work — hold to repeat. Keyboard still fine.
        </p>
        <button
          type="button"
          onClick={() => {
            setShell("off");
            try {
              localStorage.setItem(SHELL_KEY, "off");
            } catch {
              /* private mode */
            }
          }}
          className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          Full screen
        </button>
      </div>
    </div>
  );
}
