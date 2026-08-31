import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { Copy, Check, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/tools/lorem")({
  head: () => ({ meta: [{ title: "Content Generator — SlashAI" }] }),
  component: ContentGenerator,
});

const NAMES_M = ["Aarav", "Vivaan", "Aditya", "Arjun", "Siddharth", "Rohan", "Krishna", "Diya", "Rahul", "Vikram", "Sanjay", "Amit", "Rajesh", "Nitin", "Deepak"];
const NAMES_F = ["Priya", "Ananya", "Sneha", "Kavya", "Meera", "Nisha", "Pooja", "Riya", "Sonia", "Neha", "Anjali", "Divya", "Deepa", "Shreya", "Tanvi"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Lucknow"];
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "Rajasthan", "Gujarat", "West Bengal", "Uttar Pradesh", "Madhya Pradesh"];
const COMPANIES = ["TechVista", "InnoSoft", "CloudNine", "DataFlow", "ByteCraft", "CodeHive", "NetPulse", "SoftEdge", "PixelForge", "AquaTech"];
const PRODUCTS = ["Premium Widget", "Smart Sensor Kit", "Wireless Charger Pro", "Ergonomic Mouse", "USB-C Hub", "Noise-Canceling Earbuds", "Mechanical Keyboard", "Portable Monitor", "LED Desk Lamp", "Laptop Stand"];
const DESCRIPTIONS = [
  "High-performance device designed for modern professionals.",
  "Sleek design meets powerful functionality in this premium product.",
  "Built for reliability — tested under extreme conditions.",
  "Easy to set up and use right out of the box.",
  "Compatible with all major operating systems and devices.",
];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T;
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function ContentGenerator() {
  const [type, setType] = useState("name");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const gen: string[] = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case "name": gen.push(rand([...NAMES_M, ...NAMES_F])); break;
        case "male": gen.push(rand(NAMES_M)); break;
        case "female": gen.push(rand(NAMES_F)); break;
        case "address": gen.push(`${randInt(1, 999)}, ${rand(CITIES)}, ${rand(STATES)} - ${randInt(100000, 999999)}`); break;
        case "company": gen.push(`${rand(COMPANIES)} ${rand(["Solutions", "Technologies", "Labs", "Systems", "Corp", "Inc"])}`); break;
        case "product": gen.push(rand(PRODUCTS)); break;
        case "description": gen.push(rand(DESCRIPTIONS)); break;
        case "date": {
          const d = new Date(Date.now() - randInt(0, 365) * 86400000);
          gen.push(d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));
          break;
        }
        case "price": gen.push(`₹${randInt(99, 99999).toLocaleString("en-IN")}`); break;
        case "phone": gen.push(`+91 ${randInt(6000, 9999)} ${randInt(1000, 9999)} ${randInt(1000, 9999)}`); break;
        case "upi": gen.push(`${rand(NAMES_M).toLowerCase()}${randInt(1, 999)}@${rand(["paytm", "ybl", "okicici", "axl", "gpay"])}`); break;
        case "email": gen.push(`${rand(NAMES_M).toLowerCase()}${randInt(1, 99)}@${rand(["gmail.com", "outlook.com", "yahoo.com"])}`); break;
        case "ip": gen.push(`${randInt(10, 192)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`); break;
      }
    }
    setResults(gen);
  }, [type, count]);

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const TYPES: Array<{ id: string; label: string; icon: string }> = [
    { id: "name", label: "Random Name", icon: "👤" },
    { id: "male", label: "Male Name", icon: "👨" },
    { id: "female", label: "Female Name", icon: "👩" },
    { id: "address", label: "Indian Address", icon: "📍" },
    { id: "company", label: "Company Name", icon: "🏢" },
    { id: "product", label: "Product Name", icon: "📦" },
    { id: "description", label: "Product Description", icon: "📝" },
    { id: "date", label: "Random Date", icon: "📅" },
    { id: "price", label: "Price (₹)", icon: "💰" },
    { id: "phone", label: "Phone Number", icon: "📱" },
    { id: "upi", label: "UPI ID", icon: "💳" },
    { id: "email", label: "Email Address", icon: "✉️" },
    { id: "ip", label: "IP Address", icon: "🌐" },
  ];

  return (
    <AppShell title="Content Generator">
      <div className="mx-auto max-w-3xl space-y-5 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate realistic test data — names, addresses, prices, and more.</p>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => setType(t.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-all ${type === t.id ? "bg-primary/10 text-primary border border-primary/30" : "border border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Count + generate */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Count:</span>
            {[5, 10, 20, 50].map((n) => (
              <button key={n} onClick={() => setCount(n)} className={`rounded px-2 py-1 text-xs ${count === n ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{n}</button>
            ))}
          </div>
          <button onClick={generate} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs text-white hover:bg-primary/90">
            <RefreshCw className="size-3.5" /> Generate
          </button>
          {results.length > 0 && (
            <button onClick={copyAll} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
              {copied ? <Check className="size-3.5 text-green" /> : <Copy className="size-3.5" />}
              {copied ? "Copied!" : "Copy all"}
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="rounded-[10px] border border-border bg-surface p-4">
            <div className="space-y-1.5">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-elevated px-3 py-2 text-sm">
                  <span className="w-6 text-right text-[10px] text-muted-foreground">{i + 1}</span>
                  <span className="font-mono text-foreground">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
