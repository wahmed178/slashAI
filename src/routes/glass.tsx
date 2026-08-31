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
          "SlashAI Glass — free for first 1,000 members. Unlock premium dark themes.",
      },
    ],
  }),
  component: GlassPage,
});

const BENEFITS = [
  "Access 8+ premium themes — Glass, Batman, Ocean, Moonlight & more.",
  "Premium themes have built-in accent colours — no extra setup.",
  "Free for the first 1,000 members — claim yours now.",
];

function GlassPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [isGlass, setIsGlass] = useState(() => {
    try { return localStorage.getItem("slashai-glass-user") === "true"; }
    catch { return false; }
  });

  const handleSubmit = useCallback(() => {
    if (!email.trim() || !email.includes("@")) return;
    // Store locally (honest: "stored locally for now")
    const existing = JSON.parse(localStorage.getItem("glass_waitlist") || "[]");
    if (!existing.includes(email.trim())) {
      existing.push(email.trim());
      localStorage.setItem("glass_waitlist", JSON.stringify(existing));
    }
    // Activate Glass status so sidebar updates
    localStorage.setItem("slashai-glass-user", "true");
    setIsGlass(true);
    // Apply Glass theme across the entire app
    document.documentElement.classList.add("glass");
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          SlashAI Glass
        </h1>
        <p className="mt-3 max-w-md text-base text-muted-foreground">
          Free for the first 1,000 customers. Unlocks premium themes.
        </p>

        {/* Benefits */}
        <div className="mt-8 space-y-4">
          {BENEFITS.map((b) => (
            <p
              key={b}
              className="text-sm text-muted-foreground"
            >
              {b}
            </p>
          ))}
        </div>

        {/* Email form */}
        <div className="mt-10 w-full max-w-sm">
          {submitted || isGlass ? (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm font-medium text-green-500">
                ✦ You're a Glass member!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Premium themes are now unlocked. Go to Settings → Theme to try them.
              </p>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("slashai-glass-user");
                  setIsGlass(false);
                  setSubmitted(false);
                  // Remove Glass theme
                  document.documentElement.classList.remove("glass");
                }}
                className="mt-3 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Reset to Free Plan
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!email.trim() || !email.includes("@")}
                className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
              >
                Join waitlist
              </button>
            </div>
          )}
        </div>

        {/* Fine print */}
        <p className="mt-6 text-xs text-muted-foreground/60">
          Free for the first 1,000 members. One membership per email.
        </p>
      </div>
    </AppShell>
  );
}
