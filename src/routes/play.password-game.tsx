import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/play/password-game")({ component: PasswordGame });

interface Rule {
  id: number;
  text: string;
  test: (pw: string) => boolean;
}

const CAPS = "QWERTYUIOPASDFGHJKLZXCVBNM";

const RULES: Rule[] = [
  { id: 1, text: "Your password must be at least 5 characters", test: (pw) => pw.length >= 5 },
  { id: 2, text: "Your password must include a number", test: (pw) => /\d/.test(pw) },
  { id: 3, text: "Your password must include an uppercase letter", test: (pw) => [...pw].some((c) => CAPS.includes(c)) },
  { id: 4, text: "Your password must include a special character", test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(pw) },
  { id: 5, text: "The digits in your password must add up to 25", test: (pw) => [...pw.matchAll(/\d/g)].reduce((a, m) => a + Number(m[0]), 0) === 25 },
  { id: 6, text: "Your password must include a month of the year", test: (pw) => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(pw) },
  { id: 7, text: "Your password must include a Roman numeral", test: (pw) => /[IVXLCDM]/.test(pw) },
  { id: 8, text: "Your password must include one of our sponsors: Pepsi, Starbucks, Shell", test: (pw) => /pepsi|starbucks|shell/i.test(pw) },
  { id: 9, text: "The Roman numerals in your password should multiply to exactly 35", test: (pw) => {
      const re = /[IVXLCDM]+/g;
      let product = 1;
      let any = false;
      for (const m of pw.matchAll(re)) {
        const token = m[0]!;
        const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let sum = 0;
        for (let i = 0; i < token.length; i++) {
          const cur = map[token[i]!]!;
          const next = i + 1 < token.length ? map[token[i + 1]!]! : 0;
          sum += cur < next ? -cur : cur;
        }
        product *= sum;
        any = true;
      }
      return any && product === 35;
    },
  },  { id: 10, text: "Your password must include this CAPTCHA (type it as-is): 7cR4zy", test: (pw) => pw.includes("7cR4zy") },
  { id: 11, text: "Your password must include today's Wordle answer: CRANE", test: (pw) => /crane/i.test(pw) },
  { id: 12, text: "Your password must include a two-letter symbol from the periodic table", test: (pw) => /He|Li|Be|Ne|Na|Mg|Al|Si|Cl|Ar|Ca|Sc|Ti|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|Xe|Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|W|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og/.test(pw) },
  { id: 13, text: "Your password must include the current phase of the moon as emoji 🌑", test: (pw) => pw.includes("🌑") },
  { id: 14, text: "Your password must include a chess move in algebraic notation (e.g. Nf3)", test: (pw) => /[KQRBN][a-h][1-8]|[a-h][1-8]/.test(pw) },
  { id: 15, text: "Your password must contain 🥚. This egg will hatch in a minute if kept safe", test: (pw) => pw.includes("🥚") },
  { id: 16, text: "Your password must contain an airline name: ✈️ Delta, Emirates, or Lufthansa", test: (pw) => /delta|emirates|lufthansa/i.test(pw) },
  { id: 17, text: "The egg 🥚 is hatching! Keep the chick 🐤 alive - do not delete it", test: (pw) => pw.includes("🐤") },
  { id: 18, text: "Your password must include the length of your password as a number", test: (pw) => { const len = pw.length; return new RegExp(`\\b${len}\\b`).test(pw); } },
  { id: 19, text: "The sum of all digits must now be exactly 25 (again!)", test: (pw) => [...pw.matchAll(/\d/g)].reduce((a, m) => a + Number(m[0]), 0) === 25 },
  { id: 20, text: "Your password must NOT contain the letters L, O, or C", test: (pw) => !/[LOC]/.test(pw) },
  { id: 21, text: "Your password must include a sacrificial element - remove any two vowels", test: (pw) => (pw.match(/[aeiouAEIOU]/g) ?? []).length <= pw.replace(/[aeiouAEIOU]/g, "").length },
  { id: 22, text: "Your password must stay under 200 characters", test: (pw) => pw.length <= 200 },
  { id: 23, text: "The Roman numerals must still multiply to 35 (they never stopped counting)", test: (pw) => RULES[8]!.test(pw) },
  { id: 24, text: "Your password must contain 🕐, ☕, and 🎩 - morning tea with a gentleman", test: (pw) => pw.includes("🕐") && pw.includes("☕") && pw.includes("🎩") },
  { id: 25, text: "Final rule: your password must include 🥚, 🐤, and be at least 60 characters", test: (pw) => pw.includes("🥚") && pw.includes("🐤") && pw.length >= 60 },
];

const TOTAL = 25;

function PasswordGame() {
  const [pw, setPw] = useState("");
  const [hatched, setHatched] = useState(false);
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(pw.length);
  }, [pw]);

  const results = useMemo(() => RULES.map((r) => ({ rule: r, ok: r.test(pw) })), [pw]);

  // rules reveal progressively: rule n visible once rule n-1 is satisfied
  const visibleCount = useMemo(() => {
    let n = 1;
    while (n < TOTAL && results[n - 1]!.ok) n++;
    return n;
  }, [results]);

  const satisfied = visibleCount - 1;
  const won = satisfied >= TOTAL;

  useEffect(() => {
    if (pw.includes("🥚") && !hatched) {
      const t = setTimeout(() => setHatched(true), 15_000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [pw, hatched]);

  return (
    <AppShell title="The Password Game">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔑 The Password Game</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rules keep stacking. Keep every previous rule true while adding new ones. {satisfied}/{TOTAL} satisfied.
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-4">
        <div>
          <input
            type="text"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Choose a password..."
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 font-mono text-sm text-foreground focus:border-primary/50 focus:outline-none"
          />
          <p className="mt-1 text-right text-[10px] tabular-nums text-muted-foreground">{length} characters</p>
        </div>

        {won && (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-center">
            <p className="text-lg font-bold text-foreground">🎉 Password accepted!</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your password somehow satisfies {TOTAL} contradictory rules. Corporate security could learn from you.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          {results.slice(0, visibleCount).map(({ rule, ok }) => (
            <div
              key={rule.id}
              className={`flex items-start gap-2 rounded-lg border p-2.5 text-[13px] transition-colors ${
                ok ? "border-emerald-500/30 bg-emerald-500/5 text-foreground" : "border-rose-500/30 bg-rose-500/5 text-foreground"
              }`}
            >
              {ok ? (
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-rose-500" />
              )}
              <span>
                <b>Rule {rule.id}.</b> {rule.text}
              </span>
            </div>
          ))}
        </div>

        {pw.includes("🥚") && !hatched && (
          <p className="text-center text-xs text-muted-foreground">🥚 incubating... do not close this tab</p>
        )}
        {pw.includes("🥚") && hatched && pw.includes("🐤") && (
          <p className="text-center text-xs text-muted-foreground">🐤 peep peep!</p>
        )}
      </div>
    </AppShell>
  );
}
