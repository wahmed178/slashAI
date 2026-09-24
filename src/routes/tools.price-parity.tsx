import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { FaqSection } from "@/components/library/FaqSection";

export const Route = createFileRoute("/tools/price-parity")({ component: PriceParity });

/**
 * Local Price Parity — "is this actually cheaper here?" Big Mac index
 * thinking, but for your own city: compare any product's local price against
 * its US/EU price with a PPP (purchasing power parity) adjustment, and get an
 * honest read: cheap because of the market, or cheap because people earn
 * less. Also flips to "what would this cost if I travelled?"
 */

// PPP conversion factors (World Bank 2024, indicative, rounded): local currency
// units per international dollar vs the market exchange rate.
const PPP = {
  IN: { ppp: 21.5, fx: 83.5, currency: "INR" }, // India: ₹21.5 ≈ $1 PPP; ₹83.5 ≈ $1 market
  PK: { ppp: 45.0, fx: 278, currency: "PKR" },
  BD: { ppp: 37.5, fx: 118, currency: "BDT" },
  NG: { ppp: 230.0, fx: 1550, currency: "NGN" },
  EG: { ppp: 11.5, fx: 48, currency: "EGP" },
  ID: { ppp: 4700, fx: 15800, currency: "IDR" },
  PH: { ppp: 19.5, fx: 57, currency: "PHP" },
  BR: { ppp: 2.6, fx: 5.1, currency: "BRL" },
  ZA: { ppp: 7.2, fx: 18.2, currency: "ZAR" },
  US: { ppp: 1.0, fx: 1.0, currency: "USD" },
} as const;

type CountryCode = keyof typeof PPP;

const COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
];

function PriceParity() {
  const [product, setProduct] = useState("iPhone 17");
  const [country, setCountry] = useState<CountryCode>("IN");
  const [localPrice, setLocalPrice] = useState(79900);
  const [usPrice, setUsPrice] = useState(799); // USD

  const p = PPP[country];

  const calc = useMemo(() => {
    const localInUsd = localPrice / p.fx; // market FX conversion
    const pppPrice = localPrice / p.ppp; // what the same money buys locally
    const ratio = usPrice > 0 ? localInUsd / usPrice : 1;
    const pppRatio = usPrice > 0 ? pppPrice / usPrice : 1;
    return { localInUsd, pppPrice, ratio, pppRatio };
  }, [localPrice, usPrice, p]);

  const verdict = (() => {
    if (calc.pppRatio < 0.85)
      return {
        emoji: "🟢",
        label: "Genuinely cheaper here",
        text: `In ${COUNTRIES.find((c) => c.code === country)!.name}, this costs the equivalent of $${calc.pppPrice.toFixed(0)} in local purchasing power vs $${usPrice.toFixed(0)} in the US. On PPP terms you're paying ${(calc.pppRatio * 100).toFixed(0)}% of the American price — this is what an actual bargain looks like.`,
      };
    if (calc.pppRatio > 1.25)
      return {
        emoji: "🔴",
        label: "Premium-priced for your market",
        text: `Converted at market FX it's $${calc.localInUsd.toFixed(0)} — ${(calc.ratio * 100).toFixed(0)}% of the US price. But adjusted for what wages buy locally (PPP), it's $${calc.pppPrice.toFixed(0)} — ${(calc.pppRatio * 100).toFixed(0)}% of the US price. Global brands price this market as "premium"; you're effectively subsidising cheaper markets.`,
      };
    return {
      emoji: "🟡",
      label: "Roughly at parity",
      text: `Purchasing-power adjusted, you're paying $${calc.pppPrice.toFixed(0)} against $${usPrice.toFixed(0)} in the US — within the normal band. Import duties and taxes roughly cancel out wage differences here.`,
    };
  })();

  return (
    <AppShell title="Local Price Parity">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⚖️ Local Price Parity</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          "Is it cheaper in India/Pakistan/Nigeria, or does it just look cheaper?" Enter a product's local price
          and its US price. This applies the same purchasing-power-parity logic behind the Big Mac index — what
          the price means in local buying power — and tells you whether your market is genuinely cheap, at
          parity, or quietly premium-priced.
        </p>
      </header>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Product</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Your country</label>
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-5">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCountry(c.code);
                    // sensible default per currency
                    setLocalPrice(c.code === "IN" ? 79900 : c.code === "US" ? 799 : Math.round(799 * PPP[c.code].fx));
                  }}
                  className={`rounded-xl border px-2 py-2 font-semibold ${country === c.code ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField label={`Local price (${p.currency})`} value={localPrice} onChange={setLocalPrice} step={100} min={0} />
            <NumberField label="US price (USD)" value={usPrice} onChange={setUsPrice} step={10} min={0} />
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${
          verdict.emoji === "🟢" ? "border-emerald-500/40 bg-emerald-500/5" : verdict.emoji === "🔴" ? "border-red-500/40 bg-red-500/5" : "border-amber-500/40 bg-amber-500/5"
        }`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {verdict.emoji} {verdict.label}
          </p>
          <p className="text-sm leading-relaxed text-foreground">{verdict.text}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Market FX → USD" value={`$${calc.localInUsd.toFixed(0)}`} />
          <Stat label="PPP-adjusted → USD" value={`$${calc.pppPrice.toFixed(0)}`} />
          <Stat label="vs US price (FX)" value={`${(calc.ratio * 100).toFixed(0)}%`} />
          <Stat label="vs US price (PPP)" value={`${(calc.pppRatio * 100).toFixed(0)}%`} />
        </div>

        <details className="rounded-2xl border border-border bg-surface p-4">
          <summary className="cursor-pointer text-sm font-bold text-foreground">How PPP works (60 seconds)</summary>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              Exchange rates convert money, not <em>buying power</em>. ₹100 and $1.2 are equal at the market
              rate, but ₹100 in Pune buys a full meal; $1.2 in Seattle buys a napkin. Economists correct this
              with PPP factors — how many local currency units buy the same basket of goods as $1 in the US.
            </p>
            <p>
              The same correction exposes "cheap" markets that are actually premium-priced (electronics in
              India after GST+customs) and "expensive" markets that are cheap in real terms. This tool uses
              indicative World Bank PPP factors (rounded) — treat outputs as directional, not audited.
            </p>
          </div>
        </details>

        <FaqSection />
      </div>
    </AppShell>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-foreground">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-bold text-foreground">{value}</p>
    </div>
  );
}
