import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Wrench,
  Gamepad2,
  Zap,
  ShieldCheck,
  WifiOff,
} from "lucide-react";

import { VERIFIED_TOTAL } from "@/lib/commands";
import { ALL_SLASH_TOOLS } from "@/lib/slashkits";
import { PLAY_GAME_COUNT } from "@/lib/slashplay";
import { RESOURCE_TOTAL } from "@/lib/resources";

/**
 * First-visit welcome overlay. Shown once per device (localStorage gate on
 * "slashai.welcomed"): explains what SlashAI does and gives three clear
 * starting points. Pure client component - renders nothing on SSR, so it
 * never affects SEO or the served HTML.
 */

const KEY = "slashai.welcomed";

export function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* private mode - stay silent, never block the app */
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  const features = [
    {
      icon: Search,
      title: `${VERIFIED_TOTAL.toLocaleString()} AI commands`,
      text: "Copy-ready prompts for writing, coding, design and more - with examples.",
      to: "/search",
      cta: "Search commands",
    },
    {
      icon: Wrench,
      title: `${ALL_SLASH_TOOLS.length}+ free tools`,
      text: "Compress images, make PDFs, scan documents - all in your browser.",
      to: "/tools",
      cta: "Open tools",
    },
    {
      icon: Gamepad2,
      title: `${PLAY_GAME_COUNT} games`,
      text: "Quick brain games and time-wasters for when you need a break.",
      to: "/play",
      cta: "Play now",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to SlashAI"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-sidebar-border bg-surface shadow-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(480px 200px at 15% 0%, rgba(45,212,191,0.12), transparent 70%)",
          }}
        />

        <div className="relative p-5 sm:p-7">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-mono text-lg font-bold text-background">
              /
            </span>
            <div>
              <p className="text-[15px] font-bold leading-tight text-foreground">
                Welcome to SlashAI
              </p>
              <p className="text-[12px] leading-tight text-muted-foreground">
                The free AI toolbox - no account, no tracking
              </p>
            </div>
          </div>

          {/* What is this site */}
          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            SlashAI gives you <b className="text-foreground">{VERIFIED_TOTAL.toLocaleString()}+ copy-ready AI
            commands</b>, {RESOURCE_TOTAL} curated resources, {ALL_SLASH_TOOLS.length}+ browser tools
            and {PLAY_GAME_COUNT} games. Everything works offline and stays free
            - your data never leaves your device.
          </p>

          {/* Three entry points */}
          <div className="mt-4 grid gap-2">
            {features.map((f) => (
              <button
                key={f.to}
                type="button"
                onClick={() => {
                  close();
                  navigate({ to: f.to });
                }}
                className="group flex items-start gap-3 rounded-xl border border-border bg-surface-elevated p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-foreground">
                    {f.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
                    {f.text}
                  </span>
                </span>
                <span className="mt-1 hidden shrink-0 text-[11px] font-medium text-primary sm:block">
                  {f.cta} →
                </span>
              </button>
            ))}
          </div>

          {/* Trust row */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden /> No sign-up
            </span>
            <span className="inline-flex items-center gap-1">
              <WifiOff className="size-3.5 text-primary" aria-hidden /> Works offline
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="size-3.5 text-primary" aria-hidden /> 100% free
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <Link
              to="/about"
              onClick={close}
              className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Learn more
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-[13px] font-bold text-background transition-colors hover:bg-primary/90"
            >
              Start exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
