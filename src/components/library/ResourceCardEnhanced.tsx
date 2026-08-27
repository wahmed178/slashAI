import { useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Bookmark, Check } from "lucide-react";

import type { Resource, Pricing } from "@/lib/resources";

/* ──────────── pricing badge colors ──────────── */
const PRICING_STYLE: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  "Completely Free": {
    text: "#3fb950",
    bg: "rgba(63,185,80,0.1)",
    border: "rgba(63,185,80,0.3)",
  },
  "Free Tier": {
    text: "#58a6ff",
    bg: "rgba(88,166,255,0.1)",
    border: "rgba(88,166,255,0.3)",
  },
  "Open Source": {
    text: "#d29922",
    bg: "rgba(210,153,34,0.1)",
    border: "rgba(210,153,34,0.3)",
  },
  Freemium: {
    text: "#8b949e",
    bg: "#21262d",
    border: "#30363d",
  },
  "Free for Students": {
    text: "#3fb950",
    bg: "rgba(63,185,80,0.1)",
    border: "rgba(63,185,80,0.3)",
  },
  "Limited-Time Free": {
    text: "#d29922",
    bg: "rgba(210,153,34,0.1)",
    border: "rgba(210,153,34,0.3)",
  },
  Paid: {
    text: "#8b949e",
    bg: "#21262d",
    border: "#30363d",
  },
};

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export function ResourceCardEnhanced({
  resource,
  compact = false,
}: {
  resource: Resource;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(() => {
    try {
      const s = localStorage.getItem("slashai-saved-resources");
      return s ? JSON.parse(s) as string[] : [];
    } catch {
      return [];
    }
  });

  const domain = getDomain(resource.url);
  const isSaved = saved.includes(resource.id);
  const pricingStyle = PRICING_STYLE[resource.pricing] ?? PRICING_STYLE["Freemium"]!;

  const toggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSaved((prev) => {
        const next = isSaved ? prev.filter((id) => id !== resource.id) : [...prev, resource.id];
        localStorage.setItem("slashai-saved-resources", JSON.stringify(next));
        return next;
      });
    },
    [isSaved, resource.id],
  );

  return (
    <Link
      to="/r/$id"
      params={{ id: resource.id }}
      className="resource-card-enhanced group"
    >
      {/* LEFT: favicon block */}
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[18px] font-bold"
        style={{ background: "#21262d", color: "#8b949e", fontFamily: "var(--font-mono)" }}
      >
        {domain ? (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt=""
            className="size-6 rounded"
            loading="lazy"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent && !parent.querySelector(".fallback-letter")) {
                const span = document.createElement("span");
                span.className = "fallback-letter";
                span.textContent = resource.name.charAt(0).toUpperCase();
                parent.appendChild(span);
              }
            }}
          />
        ) : (
          <span>{resource.name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* CENTER: text column */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-[#e6edf3]">
          {resource.name}
        </p>
        {!compact && (
          <p className="mt-0.5 line-clamp-2 text-[13px] text-[#8b949e]">
            {resource.description}
          </p>
        )}
        {/* Tag row */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px]" style={{ background: "#21262d", borderColor: "#30363d", color: "#8b949e" }}>
            {resource.category}
          </span>
          <span
            className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px]"
            style={{ background: pricingStyle.bg, borderColor: pricingStyle.border, color: pricingStyle.text }}
          >
            {resource.pricing}
          </span>
          <span className="text-[10px] text-[#8b949e]">
            Last checked {resource.lastVerified}
          </span>
        </div>
      </div>

      {/* RIGHT: action buttons */}
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 items-center gap-1 rounded-md border px-2.5 text-[10px] font-medium transition-all duration-150"
          style={{
            background: "#21262d",
            borderColor: "#30363d",
            color: "#58a6ff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(88,166,255,0.08)";
            e.currentTarget.style.borderColor = "#58a6ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#21262d";
            e.currentTarget.style.borderColor = "#30363d";
          }}
        >
          Visit <ExternalLink className="size-3" />
        </a>
        <button
          type="button"
          onClick={toggleSave}
          className="rounded p-1 transition-colors duration-150"
          style={{ color: isSaved ? "#58a6ff" : "#8b949e" }}
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Bookmark className="size-4" fill={isSaved ? "#58a6ff" : "none"} />
        </button>
      </div>
    </Link>
  );
}
