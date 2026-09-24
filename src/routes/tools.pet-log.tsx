import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/pet-log")({ component: PetLog });

/**
 * Pet Log — the household answer to "did anyone feed the cat?" One-tap
 * logging for feeding, walks, litter and medicine, with a big "last fed X
 * minutes ago" card the whole family can check. Everything is stored in
 * localStorage on this device only.
 */

interface PetState {
  name: string;
  species: "cat" | "dog";
  events: { type: EventType; at: number }[];
}

type EventType = "fed" | "walk" | "litter" | "water" | "medicine" | "groom";

const EVENTS: { type: EventType; icon: string; label: string }[] = [
  { type: "fed", icon: "🍽️", label: "Fed" },
  { type: "walk", icon: "🦮", label: "Walk" },
  { type: "litter", icon: "🧹", label: "Litter" },
  { type: "water", icon: "💧", label: "Water" },
  { type: "medicine", icon: "💊", label: "Medicine" },
  { type: "groom", icon: "✂️", label: "Groom" },
];

const KEY = "slashai.pet-log.v1";
/** vet-consensus feeding cadence per species */
const FED_TARGET_HOURS: Record<PetState["species"], number> = { cat: 12, dog: 10 };
const WALK_TARGET_HOURS = 12;

function load(): PetState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PetState) : null;
  } catch {
    return null;
  }
}

function ago(t: number): string {
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PetLog() {
  const [pet, setPet] = useState<PetState | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"cat" | "dog">("cat");
  const [, force] = useState(0);

  useEffect(() => {
    setPet(load());
    const t = setInterval(() => force((n) => n + 1), 30000); // refresh "ago" labels
    return () => clearInterval(t);
  }, []);

  const save = useCallback((p: PetState) => {
    setPet(p);
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* storage full or blocked */
    }
  }, []);

  const create = () => {
    if (!name.trim()) return;
    save({ name: name.trim(), species, events: [] });
  };

  const log = (type: EventType) => {
    if (!pet) return;
    save({ ...pet, events: [{ type, at: Date.now() }, ...pet.events].slice(0, 100) });
  };

  const undoLast = (type: EventType) => {
    if (!pet) return;
    const idx = pet.events.findIndex((e) => e.type === type);
    if (idx < 0) return;
    const events = [...pet.events];
    events.splice(idx, 1);
    save({ ...pet, events });
  };

  const last = (type: EventType) => pet?.events.find((e) => e.type === type)?.at;

  /** the headline: is the pet fed on schedule */
  const fedStatus = (() => {
    const t = last("fed");
    if (!t || !pet) return { level: "unknown", text: "no record" };
    const hrs = (Date.now() - t) / 3600000;
    const target = FED_TARGET_HOURS[pet.species];
    if (hrs < target * 0.6) return { level: "ok", text: `${ago(t)} — all good` };
    if (hrs < target) return { level: "soon", text: `${ago(t)} — mealtime soon` };
    return { level: "late", text: `${ago(t)} — overdue, someone feed them!` };
  })();

  const walkStatus = (() => {
    if (!pet || pet.species !== "dog") return null;
    const t = last("walk");
    if (!t) return { level: "late", text: "no walk logged today" };
    const hrs = (Date.now() - t) / 3600000;
    return hrs < WALK_TARGET_HOURS ? { level: "ok", text: `${ago(t)}` } : { level: "late", text: `${ago(t)} — needs out` };
  })();

  const statusColor = (l: string) => (l === "ok" ? "text-emerald-600" : l === "soon" ? "text-amber-600" : l === "late" ? "text-red-500" : "text-muted-foreground");

  /* onboarding: create the pet profile */
  if (!pet) {
    return (
      <AppShell title="Pet Log">
        <header className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">🐾 Pet Log</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            One-tap answers to "has the dog been fed?" — the whole family taps the same buttons, and this card
            always knows. Stored only on this device.
          </p>
        </header>
        <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Pet's name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Simba"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">Species</label>
            <div className="flex gap-2">
              <button onClick={() => setSpecies("cat")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${species === "cat" ? "bg-primary text-background" : "border border-border text-muted-foreground"}`}>
                🐱 Cat
              </button>
              <button onClick={() => setSpecies("dog")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${species === "dog" ? "bg-primary text-background" : "border border-border text-muted-foreground"}`}>
                🐶 Dog
              </button>
            </div>
          </div>
          <button onClick={create} disabled={!name.trim()} className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-background disabled:opacity-40">
            Start logging for {name.trim() || "your pet"}
          </button>
        </div>
        <FaqSection />
      </AppShell>
    );
  }

  return (
    <AppShell title="Pet Log">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {pet.species === "cat" ? "🐱" : "🐶"} {pet.name}
          </h1>
          <p className="text-sm text-muted-foreground">one tap = logged</p>
        </div>
        <button
          onClick={() => {
            if (confirm("Remove this pet and all logs from this device?")) {
              localStorage.removeItem(KEY);
              setPet(null);
              setName("");
            }
          }}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground"
        >
          Reset
        </button>
      </header>

      <div className="mx-auto max-w-md space-y-4">
        {/* headline status */}
        <div className="rounded-2xl border border-border bg-surface p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">last fed</p>
          <p className={`mt-1 text-2xl font-black ${statusColor(fedStatus.level)}`}>{fedStatus.text}</p>
          {walkStatus && (
            <>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">last walk</p>
              <p className={`text-sm font-bold ${statusColor(walkStatus.level)}`}>{walkStatus.text}</p>
            </>
          )}
        </div>

        {/* one-tap grid */}
        <div className="grid grid-cols-3 gap-2">
          {EVENTS.map((e) => {
            const t = last(e.type);
            return (
              <button
                key={e.type}
                onClick={() => log(e.type)}
                onContextMenu={(ev) => {
                  ev.preventDefault();
                  undoLast(e.type);
                }}
                className="rounded-2xl border border-border bg-surface p-3 text-center transition-all hover:border-primary/50 active:scale-95"
                title={t ? `Last: ${ago(t)} (long-press to undo)` : "Tap to log"}
              >
                <p className="text-2xl">{e.icon}</p>
                <p className="mt-0.5 text-[11px] font-bold text-foreground">{e.label}</p>
                <p className="text-[10px] text-muted-foreground">{t ? ago(t) : "—"}</p>
              </button>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-muted-foreground">Tip: right-click / long-press a button to undo its last entry.</p>

        {/* recent history */}
        {pet.events.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent</p>
            <div className="max-h-52 space-y-1 overflow-y-auto">
              {pet.events.slice(0, 15).map((e, i) => {
                const meta = EVENTS.find((x) => x.type === e.type)!;
                return (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-foreground">
                      {meta.icon} {meta.label}
                    </span>
                    <span className="text-muted-foreground">{ago(e.at)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <FaqSection />
    </AppShell>
  );
}
