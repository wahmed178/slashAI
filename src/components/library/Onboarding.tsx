import { useState } from "react";
import { ArrowRight, Check, Sparkles, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLibrary } from "@/hooks/use-library";
import { INTERESTS } from "@/lib/collections";
import { PERSONAS } from "@/lib/personas";
import { VERIFIED_TOTAL } from "@/lib/commands";
import { cn } from "@/lib/utils";

/**
 * Three-slide, skippable first-run wizard. Everything it collects is optional
 * and stored on-device; skipping leaves the app fully usable.
 */
export function Onboarding({ onDone }: { onDone?: () => void }) {
  const { settings, updateSettings } = useLibrary();
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState(settings.persona);
  const [interests, setInterests] = useState<string[]>(settings.interests);

  const finish = (patch: Partial<typeof settings> = {}) => {
    updateSettings({ onboarded: true, persona, interests, ...patch });
    onDone?.();
  };

  const skip = () => {
    updateSettings({ onboarded: true });
    onDone?.();
  };

  const toggleInterest = (id: string) =>
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to SlashAI"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Terminal className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-foreground">SlashAI</span>
          <button
            type="button"
            onClick={skip}
            className="ml-auto min-h-10 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <div className="mt-4 flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <section className="flex flex-1 flex-col justify-center py-10">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <Sparkles className="size-7" aria-hidden />
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground">
              AI made simple. For everyone.
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              {VERIFIED_TOTAL.toLocaleString()} ready-to-use commands. Find yours in seconds, copy
              it, paste it into any AI.
            </p>
            <Button size="lg" className="mt-7 gap-2 self-start" onClick={() => setStep(1)}>
              Get started <ArrowRight className="size-4" />
            </Button>
          </section>
        )}

        {step === 1 && (
          <section className="flex-1 py-8">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Who are you?</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Pick the closest one — it only shapes what we suggest first.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {PERSONAS.map((p) => {
                const on = persona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPersona(on ? "" : p.id)}
                    className={cn(
                      "flex min-h-16 items-center gap-2.5 rounded-xl border px-3 text-left transition-colors",
                      on
                        ? "border-primary bg-accent text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="text-xl" aria-hidden>
                      {p.emoji}
                    </span>
                    <span className="min-w-0 text-sm font-medium">{p.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="gap-2" onClick={() => setStep(2)}>
                Continue <ArrowRight className="size-4" />
              </Button>
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flex-1 py-8">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              What do you use AI for?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Choose as many as you like, or none at all.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {INTERESTS.map((i) => {
                const on = interests.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleInterest(i.id)}
                    className={cn(
                      "flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
                      on
                        ? "border-primary bg-accent text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {on && <Check className="size-3.5" aria-hidden />}
                    {i.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="gap-2" onClick={() => finish()}>
                Start exploring <ArrowRight className="size-4" />
              </Button>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              No account, no tracking — all of this stays on your device and can be changed any
              time from the Me tab.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
