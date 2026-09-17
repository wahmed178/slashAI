import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  Gauge,
  Heart,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";
import { VERIFIED_TOTAL } from "@/lib/commands";
import { RESOURCE_TOTAL } from "@/lib/resources";
import { ALL_ROADMAPS } from "@/lib/roadmaps";
import { GLOSSARY_TOTAL } from "@/lib/glossary";
import { SLASH_TOOL_COUNT } from "@/lib/slashkits";
import { PLAY_GAME_COUNT } from "@/lib/slashplay";
import { COURSE_COUNT, TOTAL_LESSONS } from "@/lib/courses";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SlashAI - built by Waseem Ahmed, free forever" },
      {
        name: "description",
        content:
          "The story behind SlashAI: Waseem Ahmed built a free, no-login library of 5,000+ AI commands, 150+ tools and 50+ games after a decade of deleted side projects. Free forever, no account needed.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Zap,
    tint: "#2dd4bf",
    title: "SlashKits",
    desc: "150+ real utilities that finish in seconds: calculators, converters, image tools, text helpers, timers — no signup, no ads, no waiting.",
    to: "/tools",
    cta: "Open the kits",
  },
  {
    icon: Gauge,
    tint: "#f472b6",
    title: "SlashPlay",
    desc: "50+ games you can actually play — quick solo plays, zen toys and pass-and-play duels. Every game runs offline once loaded.",
    to: "/play",
    cta: "Play something",
  },
  {
    icon: Sparkles,
    tint: "#818cf8",
    title: "Slash Courses",
    desc: "Structured courses with real lessons and graded module tests — inspired by roadmap.sh. Progress saves on your device.",
    to: "/learn",
    cta: "Start learning",
  },
  {
    icon: Compass,
    tint: "#fb923c",
    title: "Discovery",
    desc: "A feed of every resource, tool and game in the app — colour-coded, searchable, endless scroll.",
    to: "/discover",
    cta: "Start discovering",
  },
  {
    icon: Search,
    tint: "#38bdf8",
    title: "Free Search",
    desc: "A private meta search engine. One query, every major free engine, instant Wikipedia answers — and SlashAI never sees what you searched.",
    to: "/web-search",
    cta: "Search privately",
  },
  {
    icon: Terminal,
    tint: "#4ade80",
    title: "The Command Bar",
    desc: "Type a slash command — /invoice, /muhurrat, /promo-mode — and get the exact tool. Viral prompt commands updated with what's trending.",
    to: "/explore",
    cta: "Browse commands",
  },
];

function AboutPage() {
  return (
    <AppShell wide hideHeaderSearch title="About SlashAI">
      <div className="mx-auto max-w-3xl pb-10">
        {/* hero */}
        <section className="page-enter rounded-3xl border border-border bg-surface p-6 text-center sm:p-9">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11.5px] font-bold text-primary">
            <Heart className="size-3.5" aria-hidden />
            100% free · no account · no tracking
          </span>
          <h1 className="mt-4 font-display text-[26px] font-black leading-tight tracking-tight text-foreground sm:text-[34px]">
            <span className="bg-gradient-to-r from-[#2dd4bf] via-[#818cf8] to-[#f472b6] bg-clip-text text-transparent">
              Free AI for everyone.
            </span>{" "}
            Forever.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            SlashAI is one calm place for the internet's useful things — {SLASH_TOOL_COUNT}+
            instant tools, {PLAY_GAME_COUNT}+ games, structured courses, a private search engine
            and {VERIFIED_TOTAL.toLocaleString()} copy-ready AI commands. No account. No ads. No
            paywall. Built in India 🇮🇳.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to="/tools"
              className="ripple-press inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#818cf8] px-5 text-[14px] font-black text-white shadow-lg transition-transform active:scale-95"
            >
              Try a tool now <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/learn"
              className="ripple-press inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-[14px] font-bold text-foreground transition-colors hover:border-primary/40"
            >
              Take a free course
            </Link>
          </div>
        </section>

        {/* founder story */}
        <section className="mt-5 rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <h2 className="text-[16px] font-bold text-foreground">The story behind SlashAI</h2>
          <div className="mt-3 space-y-3.5 text-[13.5px] leading-relaxed text-muted-foreground">
            <p>
              Hi — I'm <b className="text-foreground">Waseem Ahmed</b>, from Hyderabad, India. I
              graduated with a BCA in 2019, and like a lot of people with a laptop and more ideas
              than money, I kept building things nobody asked for.
            </p>
            <p>
              I ran Instagram pages — <i>motivationaltongue</i>, <i>untold tongue</i>, book-summary
              blogs. They grew, some did okay, and then one by one I deleted all of them. Not
              because they failed, but because I was making content I didn't believe in, chasing
              numbers that meant nothing. Starting over was scary. It was also the most honest
              thing I'd done.
            </p>
            <p>
              Then the AI boom happened. I watched friends — students, shopkeepers, my own family —
              bounce off ChatGPT not because AI is hard, but because good prompting is. The people
              who needed it most got the least out of it.
            </p>
            <p>
              So I rebuilt, from zero, with one rule I actually believe in:{" "}
              <b className="text-foreground">make AI accessible to everyone — free forever, no
              account needed</b>. No signup walls, no "free tier", no dark patterns. You open
              SlashAI, copy a command, paste it into ChatGPT, Gemini or Claude, and it works. That's
              the whole product.
            </p>
            <p>
              Everything here runs on your device. I can't see your searches, your favourites or
              your progress — there's no server holding them. If SlashAI ever can't pay for itself,
              it costs me a cup of chai a month to keep the lights on. That's the deal I made with
              the version of me who deleted everything and started again.
            </p>
          </div>
        </section>

        {/* by the numbers */}
        <section className="mt-5">
          <h2 className="px-1 text-[16px] font-bold text-foreground">By the numbers</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { value: VERIFIED_TOTAL.toLocaleString(), label: "AI commands" },
              { value: `${SLASH_TOOL_COUNT}+`, label: "browser tools" },
              { value: `${PLAY_GAME_COUNT}+`, label: "playable games" },
              { value: `${TOTAL_LESSONS}`, label: "course lessons" },
              { value: `${COURSE_COUNT}`, label: "structured courses" },
              { value: `${RESOURCE_TOTAL}+`, label: "curated resources" },
              { value: `${GLOSSARY_TOTAL}+`, label: "glossary terms" },
              { value: `${ALL_ROADMAPS.length}`, label: "founder roadmaps" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-surface px-3 py-4 text-center">
                <p className="font-display text-[20px] font-black text-foreground">{s.value}</p>
                <p className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* what's inside */}
        <section className="mt-6">
          <h2 className="px-1 text-[16px] font-bold text-foreground">What's inside</h2>
          <div className="stagger-children mt-3 grid gap-3 sm:grid-cols-2">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.title}
                  to={p.to}
                  style={{ ["--tint" as string]: p.tint }}
                  className="tint-card group rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5"
                >
                  <span
                    className="grid size-11 place-items-center rounded-xl text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${p.tint}, ${p.tint}99)` }}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-3.5 text-[15.5px] font-black text-foreground">{p.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{p.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold" style={{ color: p.tint }}>
                    {p.cta}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* how it works */}
        <section className="mt-6 rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <h2 className="text-[16px] font-bold text-foreground">How it works</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Press <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[13px] text-foreground">/</code>{" "}
            anywhere to search commands. Use Discover to browse free tools, APIs and channels. Take
            a structured course with real lessons and graded tests. Everything you save stays on
            your device — there is no account and no server holding your data.
          </p>
        </section>

        {/* why it's different */}
        <section className="mt-5 rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <h2 className="flex items-center gap-2 text-[16px] font-bold text-foreground">
            <Shield className="size-5 text-primary" aria-hidden />
            Why SlashAI feels different
          </h2>
          <ul className="mt-4 flex flex-col gap-3.5">
            {[
              ["Private by design", "No accounts, no analytics profile, no sold data. The search engine forwards nothing to us — results open directly on the source engines."],
              ["Offline-first", "Install it as an app and everything — tools, games, courses, the whole catalog — keeps working with zero connection."],
              ["Real content, no placeholders", "Every widget computes, every game plays, every lesson teaches, every test grades. If it's listed, it works."],
              ["Built to feel premium", "Colour-coded categories, smooth 120Hz-ready animations, four themes from near-black to full AMOLED."],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15">
                  <Shield className="size-3 text-primary" aria-hidden />
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold text-foreground">{title}</span>
                  <span className="block text-[12.5px] leading-relaxed text-muted-foreground">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <FaqSection />

        {/* built with */}
        <section className="mt-6 rounded-3xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-bold text-foreground">Built with</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            React · TanStack Start · Tailwind CSS. Live data from Open-Meteo, CoinGecko, Aladhan,
            TheSportsDB, HackerNews, AlQuran.cloud, NASA APOD, Open Trivia Database, Frankfurter and
            OpenAQ — all free public APIs, all called straight from your browser.
          </p>
        </section>

        {/* share CTA */}
        <section className="mt-5 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-surface to-surface p-6 text-center sm:p-7">
          <h2 className="font-display text-[20px] font-black text-foreground">Know someone who needs this?</h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
            Share SlashAI — it's free for everyone, and it stays that way.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://wa.me/?text=SlashAI%20%E2%80%94%20one%20bar%20with%20150%2B%20tools%2C%2050%2B%20games%2C%20free%20courses%20and%20a%20private%20search%20engine.%20Free%2C%20no%20login%3A%20https%3A%2F%2Fslashai.in"
              target="_blank"
              rel="noreferrer noopener"
              className="ripple-press inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#25D366] px-4 text-[13px] font-bold text-white"
            >
              Share on WhatsApp
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=SlashAI%20%E2%80%94%20one%20bar%20with%20150%2B%20free%20tools%2C%2050%2B%20games%20and%20free%20courses.%20No%20login%2C%20no%20ads.&url=https%3A%2F%2Fslashai.in"
              target="_blank"
              rel="noreferrer noopener"
              className="ripple-press inline-flex h-10 items-center gap-1.5 rounded-xl bg-foreground px-4 text-[13px] font-bold text-background"
            >
              Post on X
            </a>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText("https://slashai.in").catch(() => {});
              }}
              className="ripple-press inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-background px-4 text-[13px] font-bold text-foreground hover:border-primary/40"
            >
              Copy link
            </button>
          </div>
        </section>

        {/* suggest + meta links */}
        <section className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px]">
          <a
            href="https://github.com/wahmed178/slashAI/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary transition-all hover:text-primary/80"
          >
            Found something we missed? Open an issue →
          </a>
          <Link to="/changelog" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
            Changelog
          </Link>
          <Link to="/keyboard" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
            Keyboard shortcuts
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
