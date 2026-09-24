import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/inheritance-talk")({ component: InheritanceTalk });

/**
 * Inheritance Talk — the conversation nobody has until it's too late.
 * Families avoid estate conversations for decades, then fight for years
 * after. This tool prepares the user to open that conversation with a
 * parent: a readiness checklist (what documents exist, what's unclear),
 * a fairness-tension read on how the estate is currently informally
 * planned, and a set of gentle openers that avoid the "are you dying?"
 * tone that makes everyone shut down. No legal advice — a conversation
 * preparation kit. Everything stays on this device.
 */

type DocStatus = "yes" | "no" | "unsure";

interface Doc {
  key: string;
  label: string;
  why: string;
}

const DOCS: Doc[] = [
  { key: "will", label: "Written will exists", why: "Without one, the estate follows intestacy law — which usually splits things in ways families didn't expect." },
  { key: "assets", label: "Asset list (bank, property, gold, deposits)", why: "Most disputes are not about fairness — they're about assets nobody knew existed appearing later." },
  { key: "nominations", label: "Nominations updated on all accounts", why: "A stale nomination (an old employer's PF, a joint account) overrides even a will in practice for that asset." },
  { key: "debts", label: "Debts & liabilities listed", why: "Heirs often discover loans only after; surprises in this direction are the fastest route to conflict." },
  { key: "digital", label: "Digital life covered (phone, email, cloud, social)", why: "Photos, bills, subscriptions and even business accounts live behind passwords nobody has." },
  { key: "witnesses", label: "Will signed with required witnesses", why: "A will that fails formalities can be contested as invalid — worse than never writing one, because it signals intent without effect." },
  { key: "location", label: "Someone knows where documents are", why: "The most common failure is not the will's content — it's that nobody can find it." },
  { key: "executor", label: "An executor/writer is named and aware", why: "An unaware executor delays settlement by years and invites suspicion between siblings." },
];

interface Heir {
  name: string;
  relation: string;
  sharePct: number;
  caregiving: boolean;
  financiallySet: boolean;
}

const HOT_BUTTONS = [
  { key: "caregiver", label: "One sibling does most of the caregiving" },
  { key: "house", label: "One heir lives in / wants the family home" },
  { key: "business", label: "A family business only some heirs work in" },
  { key: "gold", label: "Gold/jewellery intended for specific people" },
  { key: "debt", label: "One heir has lent money to, or borrowed from, a parent" },
  { key: "step", label: "Step-family or a second marriage in the picture" },
];

function InheritanceTalk() {
  const [docs, setDocs] = useState<Record<string, DocStatus>>({});
  const [heirs, setHeirs] = useState<Heir[]>([
    { name: "", relation: "Sibling 1", sharePct: 50, caregiving: false, financiallySet: false },
    { name: "", relation: "Sibling 2", sharePct: 50, caregiving: false, financiallySet: false },
  ]);
  const [hot, setHot] = useState<Set<string>>(new Set());
  const [stage, setStage] = useState<"avoiding" | "thinking" | "ready">("thinking");

  const readiness = useMemo(() => {
    const answered = DOCS.filter((d) => docs[d.key] && docs[d.key] !== "unsure").length;
    const yes = DOCS.filter((d) => docs[d.key] === "yes").length;
    const score = Math.round((yes / DOCS.length) * 100);
    const clarity = Math.round((answered / DOCS.length) * 100);
    return { yes, answered, score, clarity };
  }, [docs]);

  const shareTotal = heirs.reduce((a, h) => a + (Number(h.sharePct) || 0), 0);
  const caregiverHeirs = heirs.filter((h) => h.caregiving).length;
  const tensionPoints: string[] = [];
  if (Math.abs(shareTotal - 100) > 1) tensionPoints.push(`Shares currently add to ${shareTotal}% — implicit plans drift because nobody wrote the numbers down.`);
  if (caregiverHeirs > 0 && Math.abs(shareTotal - 100) <= 1) {
    const equal = heirs.every((h) => Math.abs(h.sharePct - 100 / heirs.length) < 2);
    if (equal && caregiverHeirs < heirs.length)
      tensionPoints.push("Shares are equal but not everyone carries the caregiving load — the most common silent resentment in estates.");
  }
  for (const key of hot) {
    const h = HOT_BUTTONS.find((x) => x.key === key);
    if (h) tensionPoints.push(h.label);
  }
  if (docs["nominations"] === "no" || docs["nominations"] === "unsure")
    tensionPoints.push("Nominations may be stale — these quietly override intentions on individual assets.");

  const openers = [
    stage === "avoiding"
      ? "“I read that most family fights after a death aren't about money — they're about surprises. I'd hate for us to be surprised. Can we spend 20 minutes making sure everything is written down somewhere?”"
      : "“I want to make sure I know what you'd want — not to plan around it, just so none of us have to guess someday.”",
    "“Where are the important papers kept? Even just telling me the drawer would help me help you someday.”",
    "“Is there anything on your accounts — nominations, joint holders — that's out of date? I read those cause more problems than wills do.”",
    heirs.some((h) => h.caregiving)
      ? "“I know you've said you want things equal, and I also want to make sure the person doing the day-to-day care isn't penalised for it. Have you thought about how you'd want that recognised?”"
      : "“Is there anything you'd want split unevenly — for a reason? Better we all hear the reason from you than invent one later.”",
    "“Would you be open to a one-page list of what exists — not values, just names of accounts and where things are? We don't need to read it, just know it's there if ever needed.”",
  ];

  return (
    <AppShell title="Inheritance Talk">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🕊️ Inheritance Talk</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Families avoid estate conversations for decades, then fight for years. This isn't legal advice —
          it's the preparation kit for the conversation: how ready your family's paperwork actually is, where
          the tensions hide, and openers that don't sound like "are you dying?". Everything stays on this
          device; nothing you type leaves the page.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* stage */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Where are you today?</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
            {([
              ["avoiding", "🙈 We avoid it"],
              ["thinking", "💭 I've been thinking about it"],
              ["ready", "🗓️ We're discussing it"],
            ] as const).map(([s, lab]) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`rounded-xl border px-2 py-2 font-semibold ${stage === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
              >
                {lab}
              </button>
            ))}
          </div>
        </div>

        {/* readiness checklist */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Family paperwork readiness</p>
            <span className={`text-sm font-extrabold ${readiness.score >= 75 ? "text-emerald-500" : readiness.score >= 40 ? "text-amber-500" : "text-red-400"}`}>
              {readiness.score}%
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${readiness.score >= 75 ? "bg-emerald-500" : readiness.score >= 40 ? "bg-amber-500" : "bg-red-400"}`}
              style={{ width: `${readiness.score}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {readiness.yes} of {DOCS.length} in place · {DOCS.length - readiness.answered} you haven't checked · clarity {readiness.clarity}%
          </p>
          <div className="mt-3 space-y-2.5">
            {DOCS.map((d) => (
              <div key={d.key} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-semibold text-foreground">{d.label}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{d.why}</p>
                <div className="mt-2 flex gap-1.5 text-[10px] font-bold">
                  {(["yes", "no", "unsure"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setDocs((prev) => ({ ...prev, [d.key]: v }))}
                      className={`rounded-full px-2.5 py-0.5 ${
                        docs[d.key] === v
                          ? v === "yes"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : v === "no"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-amber-500/20 text-amber-500"
                          : "border border-border text-muted-foreground"
                      }`}
                    >
                      {v === "yes" ? "✓ in place" : v === "no" ? "✗ not done" : "? unsure"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* heirs & shares */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Heirs — the informal plan today</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Not what's legal — what's <em>assumed</em>. Writing the assumption down is the point.
          </p>
          <div className="mt-3 space-y-3">
            {heirs.map((h, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Name (optional)</label>
                    <input
                      value={h.name}
                      onChange={(e) => setHeirs((prev) => prev.map((hh, j) => (j === i ? { ...hh, name: e.target.value } : hh)))}
                      className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Assumed share: {h.sharePct}%</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={h.sharePct}
                      onChange={(e) => setHeirs((prev) => prev.map((hh, j) => (j === i ? { ...hh, sharePct: Number(e.target.value) } : hh)))}
                      className="w-full accent-[var(--primary)]"
                    />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
                  <button
                    onClick={() => setHeirs((prev) => prev.map((hh, j) => (j === i ? { ...hh, caregiving: !hh.caregiving } : hh)))}
                    className={`rounded-full px-2.5 py-0.5 ${h.caregiving ? "bg-primary/20 text-primary" : "border border-border text-muted-foreground"}`}
                  >
                    🤲 does the caregiving
                  </button>
                  <button
                    onClick={() => setHeirs((prev) => prev.map((hh, j) => (j === i ? { ...hh, financiallySet: !hh.financiallySet } : hh)))}
                    className={`rounded-full px-2.5 py-0.5 ${h.financiallySet ? "bg-primary/20 text-primary" : "border border-border text-muted-foreground"}`}
                  >
                    💰 already financially supported
                  </button>
                  <button
                    onClick={() => setHeirs((prev) => prev.filter((_, j) => j !== i))}
                    disabled={heirs.length <= 1}
                    className="rounded-full border border-border px-2.5 py-0.5 text-muted-foreground hover:text-red-400 disabled:opacity-30"
                  >
                    ✕ remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setHeirs((prev) => [...prev, { name: "", relation: `Heir ${prev.length + 1}`, sharePct: 0, caregiving: false, financiallySet: false }])}
            className="mt-3 w-full rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
          >
            + add heir
          </button>
          <p className={`mt-2 text-[11px] font-semibold ${Math.abs(shareTotal - 100) <= 1 ? "text-emerald-500" : "text-amber-500"}`}>
            Shares add to {shareTotal}% {Math.abs(shareTotal - 100) <= 1 ? "— written-down and consistent" : "— the gap is exactly where future conflict grows"}
          </p>
        </div>

        {/* hot buttons */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Known tension points</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Tick what applies. Naming a tension out loud is what defuses it.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {HOT_BUTTONS.map((b) => (
              <button
                key={b.key}
                onClick={() =>
                  setHot((prev) => {
                    const n = new Set(prev);
                    if (n.has(b.key)) n.delete(b.key);
                    else n.add(b.key);
                    return n;
                  })
                }
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${hot.has(b.key) ? "bg-amber-500/20 text-amber-600" : "border border-border text-muted-foreground"}`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* tension read */}
        {tensionPoints.length > 0 && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              ⚠️ What will likely come up
            </p>
            <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-foreground">
              {tensionPoints.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* openers */}
        <details className="rounded-2xl border border-border bg-surface p-4" open>
          <summary className="cursor-pointer text-sm font-bold text-foreground">
            💬 Openers that don't sound like "are you dying?"
          </summary>
          <div className="mt-3 space-y-2">
            {openers.map((line, i) => (
              <p key={i} className="rounded-xl border border-border bg-background p-3 text-sm leading-relaxed text-foreground">
                {line}
                <CopyButton text={line} />
              </p>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Start with documents, not money. "Where are the papers?" opens the same door without triggering
            the fear that "what do I inherit?" does. And when it gets emotional — pause, don't push. This
            conversation is a marathon, not one dinner.
          </p>
        </details>

        <p className="text-center text-[11px] text-muted-foreground">
          This tool prepares conversations; it is not legal advice. For wills, nominations and trusts, consult
          a qualified professional in your jurisdiction.
        </p>

        <FaqSection />
      </div>
    </AppShell>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${done ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground hover:text-foreground"}`}
    >
      {done ? "copied" : "copy"}
    </button>
  );
}
