import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Coffee,
  Copy,
  Check,
  Heart,
  QrCode,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/coffee")({
  head: () => ({
    meta: [
      { title: "Buy Me a Coffee · Support SlashAI" },
      {
        name: "description",
        content:
          "Support Waseem Ahmed and SlashAI. 100% free AI tools, commands and games with zero ads. Pay via UPI (Google Pay, PhonePe, Paytm) or Buy Me a Coffee.",
      },
      { property: "og:title", content: "Buy Me a Coffee · Support SlashAI" },
      {
        property: "og:description",
        content: "Help keep SlashAI 100% free, private, and ad-free forever. Support via UPI or Buy Me a Coffee.",
      },
    ],
  }),
  component: CoffeePage,
});

const UPI_ID = "wahmed178-1@okhdfcbank";
const BMC_URL = "https://buymeacoffee.com/wahmed178";
const UPI_DEEP_LINK = `upi://pay?pa=${UPI_ID}&pn=Waseem%20Ahmed&cu=INR`;

function CoffeePage() {
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success("UPI ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Failed to copy. Please select and copy manually.");
    }
  };

  return (
    <AppShell wide hideHeaderSearch title="Buy Me a Coffee">
      <div className="mx-auto max-w-2xl py-4 pb-14">
        {/* Header Badge */}
        <header className="page-enter text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[11.5px] font-bold text-amber-300">
            <Coffee className="size-3.5" aria-hidden /> Support the Creator
          </span>
          <h1 className="mt-3.5 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Buy Waseem a Coffee ☕
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
            SlashAI is built and maintained by <b className="text-foreground">Waseem Ahmed</b> from Hyderabad, India.
            It is 100% free, offline-first, and will never have ads or paywalls. If it saved you time,
            consider fueling the project!
          </p>
        </header>

        {/* Payment Methods Grid */}
        <div className="mt-7 space-y-5">
          {/* UPI & QR Code Card */}
          <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <QrCode className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-[16px] font-bold text-foreground">Pay via UPI / Google Pay / PhonePe</h2>
                <p className="text-[12px] text-muted-foreground">Zero fee, instant transfer in India & international UPI</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row sm:items-start">
              {/* QR Code Container */}
              <div className="flex flex-col items-center rounded-2xl border border-border bg-white p-3.5 shadow-md">
                <img
                  src="/images/upi-qr.png"
                  alt="Google Pay UPI QR code for wahmed178-1@okhdfcbank"
                  className="size-52 rounded-lg object-contain sm:size-56"
                  loading="eager"
                />
                <span className="mt-2 text-[11px] font-semibold text-slate-700">Scan with any UPI app</span>
              </div>

              {/* UPI Details & Actions */}
              <div className="flex flex-1 flex-col justify-between self-stretch space-y-4 pt-1 text-center sm:text-left">
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">UPI ID</p>
                  <div className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated p-2.5 sm:justify-start">
                    <code className="select-all font-mono text-[13px] font-bold text-primary">
                      {UPI_ID}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-foreground transition-colors hover:border-primary/40 active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-primary" aria-hidden /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" aria-hidden /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct UPI Mobile Deep link */}
                <div>
                  <a
                    href={UPI_DEEP_LINK}
                    className="ripple-press flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#818cf8] px-4 text-[13.5px] font-bold text-white shadow-md transition-transform active:scale-95"
                  >
                    <Smartphone className="size-4" aria-hidden /> Open in UPI App (GPay / PhonePe)
                  </a>
                  <p className="mt-1.5 text-center text-[11px] text-muted-foreground sm:text-left">
                    Works on Android and iOS devices with UPI apps installed.
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-surface-elevated/40 p-3 text-[12px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Account Name:</span> Waseem Ahmed · HDFC Bank
                </div>
              </div>
            </div>
          </section>

          {/* Buy Me A Coffee (International) */}
          <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface to-surface p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-[#FFDD00] text-black shadow-sm">
                  <Coffee className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-[16px] font-bold text-foreground">International & Card Supporters</h2>
                  <p className="text-[12px] text-muted-foreground">Support via Credit Card, Debit Card, Apple Pay, or PayPal</p>
                </div>
              </div>
            </div>

            <p className="mt-3.5 text-[13px] leading-relaxed text-muted-foreground">
              If you are visiting from outside India or prefer supporting via card, Buy Me a Coffee makes it
              instant without requiring an account.
            </p>

            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ripple-press mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-[#FFDD00] px-5 text-[14px] font-black text-black shadow-md transition-transform active:scale-95 hover:brightness-105"
            >
              <Coffee className="size-4.5" aria-hidden />
              <span>Buy me a coffee on buymeacoffee.com</span>
              <ExternalLink className="size-3.5 opacity-70" aria-hidden />
            </a>
          </section>
        </div>

        {/* Why Support Matters */}
        <section className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
            <ShieldCheck className="size-4.5 text-primary" aria-hidden /> Where does your support go?
          </h3>
          <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
              <span>Keeping SlashAI <b>100% free and ad-free</b> for students, developers, and creators worldwide.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
              <span>Domain registration (<code className="rounded bg-surface-elevated px-1 font-mono text-[12px] text-foreground">slashai.in</code>), PWA hosting, and Android app maintenance.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
              <span>Late-night chai & coffee sessions adding new offline tools, games, and prompt vaults.</span>
            </li>
          </ul>

          <div className="mt-5 border-t border-border/80 pt-4 flex flex-wrap items-center justify-between gap-3 text-[13px]">
            <Link to="/about" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Read the full story on About page <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <Link to="/explore" className="text-muted-foreground hover:text-foreground">
              Browse 5,700+ commands →
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
