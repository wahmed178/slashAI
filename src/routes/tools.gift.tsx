import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools/gift")({ component: GiftGenerator });

interface Gift { name: string; desc: string; why: string; price: string; tags: string[] }

const GIFTS: Record<string, Record<string, Gift[]>> = {
  friend: {
    "under500": [
      { name: "Personalized Keychain", desc: "Custom metal keychain with name engraving", why: "Thoughtful, useful daily reminder", price: "₹200–400", tags: ["personal", "everyday"] },
      { name: "Scented Candle Set", desc: "3-pack soy candles in lavender, vanilla, jasmine", why: "Relaxing and universally liked", price: "₹300–500", tags: ["home", "relaxing"] },
      { name: "Custom Meme Mug", desc: "Print a funny inside joke on a ceramic mug", why: "Personal and gets used daily", price: "₹250–400", tags: ["funny", "personal"] },
      { name: "Mini Succulent Set", desc: "3 small succulents in pastel pots", why: "Low-maintenance greenery for desk", price: "₹300–500", tags: ["plants", "desk"] },
    ],
    "500-2000": [
      { name: "Portable Bluetooth Speaker", desc: "JBL Go 3 or equivalent", why: "Music lover's perfect companion", price: "₹800–1,500", tags: ["tech", "music"] },
      { name: "Gourmet Chocolate Box", desc: "Artisan chocolates from local chocolatier", why: "Indulgent treat everyone loves", price: "₹600–1,200", tags: ["food", "premium"] },
      { name: "Customized Notebook", desc: "Leather-bound with embossed initials", why: "Classy and personal", price: "₹500–1,000", tags: ["stationery", "personal"] },
      { name: "Board Game", desc: "Codenames, Catan, or Exploding Kittens", why: "Creates shared memories", price: "₹800–1,800", tags: ["fun", "group"] },
    ],
  },
  partner: {
    "500-2000": [
      { name: "Photo Book", desc: "Custom photo book with your best moments", why: "Deeply personal and emotional", price: "₹800–1,500", tags: ["personal", "memories"] },
      { name: "Couple Watch Set", desc: "Matching minimalist watches", why: "Wear a piece of each other daily", price: "₹1,500–2,000", tags: ["fashion", "matching"] },
      { name: "Experience Voucher", desc: "Couples spa, dinner, or adventure activity", why: "Creates new memories together", price: "₹1,000–2,000", tags: ["experience", "together"] },
      { name: "Personalized Star Map", desc: "Map of the sky on your first date", why: "Romantic and unique", price: "₹800–1,500", tags: ["romantic", "decor"] },
    ],
    "2000-5000": [
      { name: "Smart Watch", desc: "Amazfit or Samsung Galaxy Watch", why: "Health tracking + style", price: "₹3,000–5,000", tags: ["tech", "health"] },
      { name: "Silk Scarf / Pocket Square", desc: "Premium silk accessory", why: "Timeless elegance", price: "₹2,000–3,500", tags: ["fashion", "premium"] },
      { name: "Weekend Getaway", desc: "Book a 2-night stay at a hill station", why: "Quality time away from routine", price: "₹3,000–5,000", tags: ["experience", "travel"] },
    ],
  },
  parent: {
    "under5000": [
      { name: "Digital Photo Frame", desc: "WiFi frame that cycles family photos", why: "See loved ones every day", price: "₹2,000–4,000", tags: ["tech", "family"] },
      { name: "Massager Cushion", desc: "Heated neck/back massager pillow", why: "Comfort for everyday aches", price: "₹1,500–3,000", tags: ["health", "comfort"] },
      { name: "Subscription Box", desc: "Tea, snacks, or book subscription for 3 months", why: "Gift that keeps giving", price: "₹1,500–3,000", tags: ["food", "ongoing"] },
      { name: "Smart Light Bulb Set", desc: "Philips Hue or equivalent starter kit", why: "Smart home made easy", price: "₹2,500–4,500", tags: ["tech", "home"] },
    ],
  },
};

const RECIPIENTS = ["friend", "partner", "parent", "sibling", "boss"];
const BUDGETS = ["under500", "500-2000", "2000-5000"];
const OCCASIONS = ["birthday", "eid", "diwali", "wedding", "thankYou", "justBecause"];

function GiftGenerator() {
  const [recipient, setRecipient] = useState("friend");
  const [budget, setBudget] = useState("500-2000");

  const results = useMemo(() => {
    const byRecipient = GIFTS[recipient] || {};
    const direct = byRecipient[budget] || [];
    const all = Object.values(byRecipient).flat();
    return direct.length > 0 ? direct : all.slice(0, 6);
  }, [recipient, budget]);

  return (
    <AppShell title="Gift Ideas">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🎁 Gift Idea Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">Curated gift ideas by recipient, budget, and occasion. No AI — all hand-picked.</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Recipient</label>
            <div className="flex flex-wrap gap-1.5">
              {RECIPIENTS.map(r => (
                <button key={r} onClick={() => setRecipient(r)} className={`rounded-lg border px-2.5 py-1 text-xs capitalize transition-colors ${recipient === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Budget</label>
            <div className="flex flex-wrap gap-1.5">
              {BUDGETS.map(b => (
                <button key={b} onClick={() => setBudget(b)} className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${budget === b ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {b === "under500" ? "Under ₹500" : b === "500-2000" ? "₹500–2,000" : "₹2,000–5,000"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((g, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-foreground">{g.name}</h3>
                <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">{g.price}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
              <p className="mt-2 text-[11px] text-primary">💡 {g.why}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {g.tags.map(t => <span key={t} className="rounded-md bg-surface-elevated px-1.5 py-0.5 text-[9px] text-muted-foreground capitalize">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
