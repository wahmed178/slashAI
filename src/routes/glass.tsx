import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/glass")({
  head: () => ({
    meta: [
      { title: "✦ Glass — SlashAI" },
      {
        name: "description",
        content:
          "SlashAI Glass — more power, same calm. Premium features for builders who want more.",
      },
    ],
  }),
  component: GlassPage,
});

const BENEFITS = [
  "Unlimited AI generators — no daily cap.",
  "Your library across every device — synced.",
  "Team workspaces for builders — share and collaborate.",
];

function GlassPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!email.trim() || !email.includes("@")) return;
    // Store locally (honest: "stored locally for now")
    const existing = JSON.parse(localStorage.getItem("glass_waitlist") || "[]");
    if (!existing.includes(email.trim())) {
      existing.push(email.trim());
      localStorage.setItem("glass_waitlist", JSON.stringify(existing));
    }
    setSubmitted(true);
  }, [email]);

  return (
    <AppShell hideHeaderSearch title="Glass">
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-4 text-center">
        {/* Iridescent badge */}
        <div
          className="mb-6 rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,165,250,0.15), rgba(52,211,153,0.15))",
            border: "1px solid rgba(167,139,250,0.25)",
            color: "#c4b5fd",
          }}
        >
          ✦ Coming Soon
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3] sm:text-4xl">
          SlashAI Glass
        </h1>
        <p className="mt-3 max-w-md text-base text-[#8b949e]">
          More power, same calm.
        </p>

        {/* Benefits */}
        <div className="mt-8 space-y-4">
          {BENEFITS.map((b) => (
            <p
              key={b}
              className="text-sm text-[#8b949e]"
            >
              {b}
            </p>
          ))}
        </div>

        {/* Email form */}
        <div className="mt-10 w-full max-w-sm">
          {submitted ? (
            <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/10 p-4">
              <p className="text-sm font-medium text-[#3fb950]">
                You're on the list. We'll be in touch.
              </p>
              <p className="mt-1 text-xs text-[#8b949e]">
                Stored locally for now — we'll set up real soon.
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-sm text-[#e6edf3] placeholder:text-[#8b949e]/50 focus:border-[#58a6ff]/50 focus:outline-none focus:ring-1 focus:ring-[#58a6ff]/30"
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!email.trim() || !email.includes("@")}
                className="shrink-0 rounded-lg bg-[#58a6ff] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#58a6ff]/90 disabled:opacity-40"
              >
                Join waitlist
              </button>
            </div>
          )}
        </div>

        {/* Price hint */}
        <p className="mt-6 text-xs text-[#8b949e]/60">
          Planned from ₹299/month · $4/month — early access will be cheaper.
        </p>
      </div>
    </AppShell>
  );
}
