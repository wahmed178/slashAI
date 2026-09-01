import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLibrary } from "@/hooks/use-library";
import type { Theme } from "@/hooks/use-library";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/designs")({
  component: DesignsPage,
});

interface DesignCard {
  id: Theme;
  name: string;
  brand: string;
  description: string;
  accent: string;
  accentLabel: string;
  vibe: string;
  bgPreview: string;
  surfacePreview: string;
  borderPreview: string;
  features: string[];
}

const DESIGNS: DesignCard[] = [
  {
    id: "linear",
    name: "Linear",
    brand: "Linear.app",
    description:
      "Ultra-minimal dark canvas with lavender-blue accent. Dense, technical, quietly luxurious.",
    accent: "#5e6ad2",
    accentLabel: "Lavender Blue",
    vibe: "Developer productivity",
    bgPreview: "#010102",
    surfacePreview: "#0f1011",
    borderPreview: "#23252a",
    features: [
      "Near-pure black canvas (#010102)",
      "4-step surface ladder",
      "Hairline borders only",
      "Negative tracking display",
      "Single chromatic accent",
    ],
  },
  {
    id: "notion",
    name: "Notion",
    brand: "Notion",
    description:
      "Confident, illustration-rich brand voice with deep navy hero and signature purple CTA.",
    accent: "#5645d4",
    accentLabel: "Notion Purple",
    vibe: "All-in-one workspace",
    bgPreview: "#0a1530",
    surfacePreview: "#1a2a52",
    borderPreview: "#2a3a62",
    features: [
      "Deep navy hero band",
      "Signature purple pill CTA",
      "Pastel feature cards",
      "8px rectangular buttons",
      "Notion-Sans typography",
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    brand: "Vercel",
    description:
      "Black-and-white precision with a multi-color mesh gradient at hero scale.",
    accent: "#171717",
    accentLabel: "Ink Black",
    vibe: "Frontend platform",
    bgPreview: "#fafafa",
    surfacePreview: "#ffffff",
    borderPreview: "#ebebeb",
    features: [
      "Near-white canvas",
      "Ink-near-black primary",
      "Multi-color mesh gradient",
      "Geist font family",
      "Stacked shadow elevation",
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    brand: "Stripe",
    description:
      "Financial infrastructure brand with electric indigo primary and atmospheric gradient mesh.",
    accent: "#533afd",
    accentLabel: "Electric Indigo",
    vibe: "Payment infrastructure",
    bgPreview: "#ffffff",
    surfacePreview: "#f6f9fc",
    borderPreview: "#e3e8ee",
    features: [
      "Gradient mesh hero backdrop",
      "Indigo primary CTA",
      "Thin weight typography (300)",
      "Tabular figures for money",
      "Cream band interludes",
    ],
  },
  {
    id: "supabase",
    name: "Supabase",
    brand: "Supabase",
    description:
      "Clean white canvas with a single signature emerald-green CTA. Quietly technical.",
    accent: "#3ecf8e",
    accentLabel: "Emerald Green",
    vibe: "Open-source database",
    bgPreview: "#ffffff",
    surfacePreview: "#fafafa",
    borderPreview: "#dfdfdf",
    features: [
      "White canvas marketing",
      "Single emerald primary",
      "Product UI mockups",
      "6px button radii",
      "Code blocks in dark",
    ],
  },
  {
    id: "framer",
    name: "Framer",
    brand: "Framer",
    description:
      "Confident dark-canvas builder with white display type and vibrant gradient spotlight cards.",
    accent: "#ffffff",
    accentLabel: "Pure White",
    vibe: "Website builder",
    bgPreview: "#090909",
    surfacePreview: "#141414",
    borderPreview: "#262626",
    features: [
      "Pure black canvas",
      "White pill CTAs",
      "Gradient spotlight cards",
      "Massive negative tracking",
      "Inter Variable body type",
    ],
  },
];

function DesignsPage() {
  const { settings, updateSettings } = useLibrary();
  const [isGlass, setIsGlass] = useState(false);

  useEffect(() => {
    try {
      setIsGlass(localStorage.getItem("slashai-glass-user") === "true");
    } catch {
      setIsGlass(false);
    }
  }, []);

  if (!isGlass) {
    return (
      <AppShell title="Designs">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-surface text-4xl">
            ✦
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Premium Designs
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Unlock 6 premium design systems — Linear, Notion, Vercel, Stripe,
            Supabase, and Framer. Each transforms the entire SlashAI interface.
          </p>
          <Link
            to="/glass"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            ✦ Claim Glass Membership — Free
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Free for the first 1,000 customers. Unlocks premium themes.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Designs">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          ✦ Premium Designs
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Transform SlashAI with design systems from the world's best brands.
          Click any design to apply it instantly.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESIGNS.map((design) => {
          const isActive = settings.theme === design.id;
          return (
            <button
              key={design.id}
              type="button"
              onClick={() => {
                updateSettings({ theme: design.id });
              }}
              className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40 hover:shadow-lg"
              }`}
            >
              {/* Preview bar */}
              <div
                className="flex h-24 items-end gap-0 overflow-hidden"
                style={{ background: design.bgPreview }}
              >
                <div
                  className="h-full w-1/4"
                  style={{ background: design.surfacePreview }}
                />
                <div
                  className="h-full w-1/4"
                  style={{
                    background: design.surfacePreview,
                    borderLeft: `1px solid ${design.borderPreview}`,
                  }}
                />
                <div
                  className="flex h-full w-2/4 items-center justify-center"
                  style={{ background: design.bgPreview }}
                >
                  <div
                    className="rounded-md px-3 py-1 text-xs font-semibold"
                    style={{
                      background: design.accent,
                      color:
                        design.id === "vercel" || design.id === "supabase"
                          ? "#ffffff"
                          : design.accent === "#ffffff"
                            ? "#000000"
                            : "#ffffff",
                    }}
                  >
                    Get Started
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {design.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {design.vibe}
                    </p>
                  </div>
                  <div
                    className="size-4 rounded-full"
                    style={{ background: design.accent }}
                    title={design.accentLabel}
                  />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {design.description}
                </p>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {design.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="rounded-md bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Apply button */}
                {isActive ? (
                  <div className="mt-3 flex h-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary">
                    ✓ Active
                  </div>
                ) : (
                  <div className="mt-3 flex h-8 items-center justify-center rounded-lg border border-border bg-surface-elevated text-xs font-medium text-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    Apply {design.name}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Reset to default */}
      {settings.theme !== "dark" && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => updateSettings({ theme: "dark" })}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset to Dark theme
          </button>
        </div>
      )}
    </AppShell>
  );
}
