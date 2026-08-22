import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Pricing, Resource } from "@/lib/resources";

const PRICING_TONE: Record<Pricing, string> = {
  "Completely Free": "border-primary/40 bg-accent text-foreground",
  "Open Source": "border-primary/40 bg-accent text-foreground",
  "Free Tier": "border-border bg-surface text-muted-foreground",
  Freemium: "border-border bg-surface text-muted-foreground",
  "Free for Students": "border-primary/40 bg-accent text-foreground",
  "Limited-Time Free": "border-primary/40 bg-accent text-foreground",
  Paid: "border-border bg-muted text-muted-foreground",
};

export function PricingBadge({ pricing, className }: { pricing: Pricing; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        PRICING_TONE[pricing],
        className,
      )}
    >
      {pricing}
    </span>
  );
}

export function VerifiedLine({ resource }: { resource: Resource }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <BadgeCheck className="size-3.5 text-primary" aria-hidden />
      Last checked {resource.lastVerified}
      {resource.status !== "Active" && ` · ${resource.status}`}
    </span>
  );
}

/** Compact, tappable card used by every resource surface. */
export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      to="/r/$id"
      params={{ id: resource.id }}
      className="panel group flex flex-col gap-2 rounded-xl p-3.5 transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-foreground">{resource.name}</span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {resource.type} · {resource.category}
          </span>
        </span>
        <PricingBadge pricing={resource.pricing} />
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {resource.description}
      </p>
      <div className="flex items-center justify-between gap-2">
        <VerifiedLine resource={resource} />
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}

export function ResourceGrid({
  resources,
  className,
}: {
  resources: Resource[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {resources.map((x) => (
        <ResourceCard key={x.id} resource={x} />
      ))}
    </div>
  );
}

export function VisitButton({ url, label = "Visit resource" }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {label} <ArrowUpRight className="size-4" aria-hidden />
    </a>
  );
}
