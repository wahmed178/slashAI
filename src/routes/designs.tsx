import { createFileRoute } from "@tanstack/react-router";
import { useLibrary } from "@/hooks/use-library";
import type { Theme } from "@/hooks/use-library";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/designs")({
  head: () => ({
    meta: [
      { title: "Designs - SlashAI" },
      {
        name: "description",
        content:
          "Four hand-tuned themes - Dark, Light, AMOLED and Glass. Preview each one and apply it instantly. Every theme is free.",
      },
    ],
  }),
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
    id: 'dark' as Theme,
    name: 'Dark',
    brand: 'SlashAI default',
    description: 'The signature SlashAI look: near-black navy canvas with an electric cyan accent. Easy on the eyes.',
    accent: '#2dd4bf',
    accentLabel: 'Electric Cyan',
    vibe: 'Default theme',
    bgPreview: '#0a0a0f',
    surfacePreview: '#12151c',
    borderPreview: '#242a35',
    features: [
      'Near-black navy canvas',
      'Layered surfaces',
      'Electric cyan primary',
      'Space Grotesk typography',
      'Subtle glass morphism',
    ],
  },
  {
    id: 'light' as Theme,
    name: 'Light',
    brand: 'SlashAI',
    description: 'Bright, clean and readable - great for daylight and well-lit rooms.',
    accent: '#0d9488',
    accentLabel: 'Deep Teal',
    vibe: 'Daylight theme',
    bgPreview: '#fafafa',
    surfacePreview: '#ffffff',
    borderPreview: '#e5e7eb',
    features: [
      'Near-white canvas',
      'High contrast text',
      'Deep teal primary',
      'Soft shadows',
      'Same layout, brighter',
    ],
  },
  {
    id: 'amoled' as Theme,
    name: 'AMOLED',
    brand: 'SlashAI',
    description: 'True pixel-off black. Maximum contrast, minimum battery drain on OLED screens.',
    accent: '#2dd4bf',
    accentLabel: 'Electric Cyan',
    vibe: 'Battery saver',
    bgPreview: '#000000',
    surfacePreview: '#0a0a0a',
    borderPreview: '#1f1f1f',
    features: [
      'Pure black background',
      'Pixels actually turn off',
      'Saves battery on OLED',
      'Cyan accents pop harder',
      'Great at night',
    ],
  },
  {
    id: 'glass' as Theme,
    name: 'Glass',
    brand: 'SlashAI',
    description: 'Frosted violet-dark surfaces with translucent panels and a soft teal accent.',
    accent: '#7dd3fc',
    accentLabel: 'Frost Teal',
    vibe: 'Glassmorphism',
    bgPreview: '#0d0b1a',
    surfacePreview: '#1a1630',
    borderPreview: '#332b55',
    features: [
      'Frosted violet surfaces',
      'Translucent panels',
      'Soft glows and blur',
      'Teal accent',
      'Premium dark look',
    ],
  },
];

function DesignsPage() {
  const { settings, updateSettings } = useLibrary();

  return (
    <AppShell title="Designs">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Designs
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Four hand-tuned themes for SlashAI. Click any design to apply
          it instantly - every theme is free.
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
                >                    <div
                    className="rounded-md px-3 py-1 text-xs font-semibold"
                    style={{
                      background: design.accent,
                      color: "#ffffff",
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
