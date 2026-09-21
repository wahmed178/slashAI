/**
 * Small shared pieces for the store platform: setup notice, form fields,
 * inline notices and skeletons. Kept in one file so the storefront and the
 * owner dashboard look identical without duplicating markup.
 */
import type { ReactNode } from "react";

import { STORE_THEMES, type StoreThemeId } from "@/lib/stores";

/* ─────────────────────────── setup notice ─────────────────────────── */

/** Shown wherever a Supabase-backed screen needs keys the project doesn't have. */
export function SetupNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-left">
      <p className="text-[13.5px] font-bold text-foreground">
        Slash Stores needs a Supabase project
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
        Add these two keys in <b className="text-foreground">Settings → Environment</b> and the
        storefronts start working — no other change needed:
      </p>
      <ul className="mt-2.5 space-y-1 font-mono text-[12px] text-foreground">
        <li>VITE_SUPABASE_URL</li>
        <li>VITE_SUPABASE_ANON_KEY</li>
      </ul>
      {!compact ? (
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
          Then run <span className="font-mono text-foreground">supabase/schema.sql</span> in the
          Supabase SQL editor. That creates the tables, Row Level Security and the checkout
          function. To serve stores on <span className="font-mono">store.slashai.in</span> add{" "}
          <span className="font-mono">VITE_STORES_ROOT_DOMAIN</span> and point a wildcard domain
          at the site — the walkthrough is in{" "}
          <span className="font-mono text-foreground">supabase/README.md</span>.
        </p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── form fields ─────────────────────────── */

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  prefix?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "decimal" | "numeric";
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  required,
  multiline,
  rows = 3,
  prefix,
  autoComplete,
  inputMode,
}: FieldProps) {
  const base =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";

  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-foreground">
        {label}
        {required ? <span className="text-rose-400"> *</span> : null}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={base}
        />
      ) : prefix ? (
        <span className="flex items-stretch overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
          <span className="flex items-center border-r border-border bg-surface px-3 font-mono text-[12px] text-muted-foreground">
            {prefix}
          </span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </span>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={base}
        />
      )}
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

/* ─────────────────────────── notices ─────────────────────────── */

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  const styles: Record<string, string> = {
    error: "border-rose-500/30 bg-rose-500/8 text-rose-300",
    success: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
    info: "border-border bg-surface text-muted-foreground",
  };
  return (
    <p className={`rounded-xl border px-3.5 py-2.5 text-[12.5px] leading-relaxed ${styles[tone]}`}>
      {children}
    </p>
  );
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-surface-elevated"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── theme picker ─────────────────────────── */

export function ThemePicker({
  value,
  onChange,
}: {
  value: StoreThemeId;
  onChange: (theme: StoreThemeId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STORE_THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => onChange(theme.id)}
          aria-pressed={value === theme.id}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
            value === theme.id
              ? "border-primary/60 text-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="size-3.5 rounded-full" style={{ background: theme.gradient }} />
          {theme.label}
        </button>
      ))}
    </div>
  );
}
