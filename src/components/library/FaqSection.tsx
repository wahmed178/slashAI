import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { faqsForPath } from "@/lib/seo";
import { useLocation } from "@tanstack/react-router";

/**
 * Visible FAQ accordion for tool/landing pages. Content comes from the same
 * registry the root head uses for FAQPage JSON-LD, so markup always matches
 * visible content (a Google requirement for FAQ rich results). Renders
 * nothing on paths without FAQ entries.
 */
export function FaqSection() {
  const { pathname } = useLocation();
  const faqs = faqsForPath(pathname);
  const [open, setOpen] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-8">
      <h2
        id="faq-heading"
        className="text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground"
      >
        Frequently asked questions
      </h2>
      <div className="mt-3 space-y-2">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left"
              >
                <span className="text-[13px] font-semibold text-foreground">
                  {f.q}
                </span>
                <ChevronDown
                  aria-hidden
                  className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="px-3.5 pb-3.5 text-[13px] leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
