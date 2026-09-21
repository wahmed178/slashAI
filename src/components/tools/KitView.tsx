/**
 * KitView — renders any registered kit as a working page: converters convert,
 * tables show real data, sheets copy, directories link out. One component,
 * one branch per kit kind.
 */
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, Copy, Check, ExternalLink } from "lucide-react";

import {
  getKit,
  CONV_FAMILIES,
  TEMPERATURE_UNITS,
  ELEMENTS,
  ELEMENT_CATEGORIES,
  INDIA_STATES,
  CURRENCIES,
  STUDY_TABLES,
  CHEATSHEETS,
  WEB_TOOLS,
  WEB_GROUP_META,
  type Kit,
} from "@/lib/kits/registry";

/* ── shared bits ────────────────────────────────────────────────────── */

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        } catch { /* clipboard unavailable */ }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
      {copied ? "Copied" : (label ?? "Copy")}
    </button>
  );
}

/* ── converters ─────────────────────────────────────────────────────── */

function ConverterKit({ kit }: { kit: Kit }) {
  const [familyId, i, j] = kit.ref!.split(":");
  const family = CONV_FAMILIES.find((f) => f.id === familyId)!;
  const fromU = family.units[Number(i)]!;
  const toU = family.units[Number(j)]!;
  const [val, setVal] = useState("1");
  const num = Number(val);

  const out = useMemo(() => {
    if (!Number.isFinite(num)) return "";
    if (fromU[1] < 0 || toU[1] < 0) {
      // inverse pairs like L/100km — show both directions honestly
      const baseFrom = fromU[1] < 0 ? 100 / num : num * fromU[1];
      return String(+(toU[1] < 0 ? 100 / baseFrom : baseFrom * toU[1]).toFixed(6));
    }
    return String(+((num * fromU[1]) / toU[1]).toFixed(6));
  }, [num, fromU, toU]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">From: {fromU[0]}</span>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full rounded-xl border bg-background px-4 py-3 text-lg outline-none focus:border-primary"
          />
        </label>
        <ArrowLeftRight className="mx-auto mb-2 size-5 rotate-90 text-muted-foreground sm:rotate-0" />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">To: {toU[0]}</span>
          <output className="w-full rounded-xl border bg-muted/40 px-4 py-3 text-lg font-bold">
            {out || "—"}
          </output>
        </label>
      </div>
      {out && <CopyBtn text={out} label="Copy result" />}
      <div className="rounded-xl border bg-surface p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">How it works</p>
        <p className="mt-1">
          1 {fromU[0]} = {+(fromU[1] / toU[1]).toFixed(8)} {toU[0]}. Enter any value above — the
          conversion is instant and stays on your device.
        </p>
        <Link to="/tools" className="mt-2 inline-block text-xs text-primary underline">
          More {family.name.toLowerCase()} converters →
        </Link>
      </div>
    </div>
  );
}

function TemperatureKit({ kit }: { kit: Kit }) {
  const parts = kit.ref!.split(":").map(Number);
  const i = parts[0] ?? 0;
  const j = parts[1] ?? 1;
  const fromU = TEMPERATURE_UNITS[i]!;
  const toU = TEMPERATURE_UNITS[j]!;
  const [val, setVal] = useState("0");
  const num = Number(val);
  const out = Number.isFinite(num) ? toU[1](fromU[1](num, true), false) : NaN;
  const formulas: Record<string, string> = {
    "0:1": "°F = °C × 9/5 + 32",
    "1:0": "°C = (°F − 32) × 5/9",
    "0:2": "K = °C + 273.15",
    "2:0": "°C = K − 273.15",
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Degrees {fromU[0]}</span>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full rounded-xl border bg-background px-4 py-3 text-lg outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Degrees {toU[0]}</span>
          <output className="w-full rounded-xl border bg-muted/40 px-4 py-3 text-lg font-bold">
            {Number.isFinite(out) ? +out.toFixed(2) : "—"}
          </output>
        </label>
      </div>
      {formulas[`${i}:${j}`] && (
        <p className="rounded-xl border bg-surface p-3 text-center font-mono text-sm text-muted-foreground">
          {formulas[`${i}:${j}`]}
        </p>
      )}
    </div>
  );
}

/* ── element / state / currency fact pages ──────────────────────────── */

function ElementKit({ kit }: { kit: Kit }) {
  const row = ELEMENTS.find(([, sym]) => sym === kit.ref);
  if (!row) return <p className="text-sm text-muted-foreground">Unknown element.</p>;
  const [num, sym, name, mass, cat] = row;
  const color = ELEMENT_CATEGORIES[cat] ?? "#94a3b8";
  const uses: Record<string, string> = {
    H: "Rocket fuel, ammonia, the sun's fuel",
    He: "Balloons, MRI scanners, cryogenics",
    Li: "Phone and EV batteries, mood stabilisers",
    C: "Diamond, graphite, every living thing",
    N: "78% of air, fertilisers, explosives",
    O: "Breathing, water, combustion",
    Fe: "Steel, haemoglobin, Earth's core",
    Cu: "Wiring, plumbing, bronze",
    Ag: "Jewellery, contacts, mirrors, antimicrobials",
    Au: "Jewellery, electronics, reserves",
    U: "Nuclear power and weapons",
    Si: "Computer chips, glass, solar panels",
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <div
          className="grid size-24 shrink-0 place-items-center rounded-2xl border-2 text-center"
          style={{ borderColor: color }}
        >
          <div>
            <p className="text-[10px] text-muted-foreground">{num}</p>
            <p className="text-3xl font-black" style={{ color }}>{sym}</p>
            <p className="text-[10px] text-muted-foreground">{+mass}</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{name}</p>
          <p className="text-sm" style={{ color }}>{cat}</p>
          {uses[sym] && <p className="mt-1 text-sm text-muted-foreground">{uses[sym]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Atomic number", String(num)],
          ["Atomic mass", `${mass} u`],
          ["Category", cat],
          ["Symbol", sym],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-surface p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">{v}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Element {num} of the periodic table.{" "}
        <Link to="/tools" className="text-primary underline">Browse all tool kits →</Link>
      </p>
    </div>
  );
}

function StateKit({ kit }: { kit: Kit }) {
  const row = INDIA_STATES.find(([s]) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-") === kit.ref);
  if (!row) return <p className="text-sm text-muted-foreground">Unknown state.</p>;
  const [state, capital, stats, known] = row;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🇮🇳</span>
        <div>
          <p className="text-xl font-bold text-foreground">{state}</p>
          <p className="text-sm text-muted-foreground">Capital: <b className="text-foreground">{capital}</b></p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Capital", capital],
          ["People & area", stats],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-surface p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-surface p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Known for</p>
        <p className="mt-1 text-sm text-foreground">{known}</p>
      </div>
    </div>
  );
}

function CurrencyKit({ kit }: { kit: Kit }) {
  const row = CURRENCIES.find(([c]) => c === kit.ref);
  if (!row) return <p className="text-sm text-muted-foreground">Unknown currency.</p>;
  const [code, name, symbol, countries] = row;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-2xl border bg-surface text-3xl font-bold text-foreground">{symbol}</span>
        <div>
          <p className="text-xl font-bold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">Code: {code} · Symbol: {symbol}</p>
        </div>
      </div>
      <div className="rounded-xl border bg-surface p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Used in</p>
        <p className="mt-1 text-sm text-foreground">{countries}</p>
      </div>
      <CopyBtn text={symbol} label="Copy symbol" />
    </div>
  );
}

/* ── tables & sheets ────────────────────────────────────────────────── */

function TableKit({ kit }: { kit: Kit }) {
  const t = STUDY_TABLES.find((x) => x.id === kit.ref);
  if (!t) return <p className="text-sm text-muted-foreground">Unknown table.</p>;
  const rows: [number, number][] =
    t.kind === "table" ? [...Array(t.upto)].map((_, k) => [k + 1, Number(t.id) * (k + 1)])
    : t.kind === "squares" ? [...Array(t.upto)].map((_, k) => [k + 1, (k + 1) ** 2])
    : t.kind === "cubes" ? [...Array(t.upto)].map((_, k) => [k + 1, (k + 1) ** 3])
    : t.kind === "powers" ? [...Array(t.upto)].map((_, k) => [k + 1, 2 ** k])
    : [...Array(t.upto)].map((_, k) => [k + 1, k + 1]);
  const primes = t.kind === "primes" ? (() => {
    const out: number[] = [];
    for (let n = 2; out.length < 100; n++) {
      if (out.every((p) => n % p !== 0)) out.push(n);
    }
    return out;
  })() : [];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {t.kind === "primes"
          ? primes.map((p) => (
              <span key={p} className="rounded-lg border bg-surface px-2 py-1.5 text-center text-sm font-bold text-foreground">{p}</span>
            ))
          : rows.map(([a, b]) => (
              <span key={a} className="rounded-lg border bg-surface px-2 py-1.5 text-center text-sm text-foreground">
                {t.kind === "table" ? `${t.id} × ${a} = ` : a === b ? "" : ""}<b>{t.kind === "table" ? b : `${a}${t.kind === "squares" ? "²" : t.kind === "cubes" ? "³" : ""} = ${b}`}</b>
              </span>
            ))}
      </div>
      <p className="text-xs text-muted-foreground">{t.desc} · generated fresh, no internet needed</p>
    </div>
  );
}

function SheetKit({ kit }: { kit: Kit }) {
  const sheet = CHEATSHEETS.find((c) => c.id === kit.ref);
  if (!sheet) return <p className="text-sm text-muted-foreground">Unknown sheet.</p>;
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm text-muted-foreground">{sheet.desc}</p>
      <div className="overflow-hidden rounded-xl border">
        {sheet.rows.map(([cmd, what], i) => (
          <div key={cmd} className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${i % 2 ? "bg-surface" : ""}`}>
            <div className="min-w-0">
              <code className="block truncate font-mono text-[13px] font-semibold text-foreground">{cmd}</code>
              <span className="block text-[11px] text-muted-foreground">{what}</span>
            </div>
            <CopyBtn text={cmd} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── web directory ──────────────────────────────────────────────────── */

function DirectoryKit({ kit }: { kit: Kit }) {
  if (kit.ref && WEB_GROUP_META.some((g) => g.id === kit.ref)) {
    const meta = WEB_GROUP_META.find((g) => g.id === kit.ref)!;
    const tools = WEB_TOOLS.filter((t) => t.group === meta.id);
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">Curated free tools on the wider web — {meta.blurb}. Each entry says exactly what it does.</p>
        {tools.map((t) => (
          <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start justify-between gap-3 rounded-xl border bg-surface p-3.5 transition-colors hover:bg-surface-elevated">
            <span className="min-w-0">
              <span className="block text-[14px] font-bold text-foreground">{t.name}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{t.what}</span>
              {t.kidsOk && <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-500">kid-friendly</span>}
            </span>
            <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    );
  }
  const tool = WEB_TOOLS.find((t) => t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === kit.ref || t.name === kit.name);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">What it does</p>
        <p className="mt-1 text-[15px] text-foreground">{tool?.what ?? kit.desc}</p>
        <p className="mt-2 text-[11px] text-muted-foreground">Category: {tool?.group ?? kit.ref} · opens in a new tab · free</p>
      </div>
      <a href={tool?.url ?? "#"} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-background transition-opacity hover:opacity-90">
        Open {tool?.name ?? kit.name} <ExternalLink className="size-4" />
      </a>
    </div>
  );
}

/* ── switch ─────────────────────────────────────────────────────────── */

export function KitView({ kit }: { kit: Kit }) {
  switch (kit.kind) {
    case "converter": return <ConverterKit kit={kit} />;
    case "temperature": return <TemperatureKit kit={kit} />;
    case "element": return <ElementKit kit={kit} />;
    case "state": return <StateKit kit={kit} />;
    case "currency": return <CurrencyKit kit={kit} />;
    case "table": return <TableKit kit={kit} />;
    case "cheatsheet": return <SheetKit kit={kit} />;
    case "directory": return <DirectoryKit kit={kit} />;
    default: return <p className="text-sm text-muted-foreground">This kit isn't available yet.</p>;
  }
}

export { getKit };
