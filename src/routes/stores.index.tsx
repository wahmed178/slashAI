import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Globe, ShieldCheck, Store as StoreIcon, Zap } from "lucide-react";

import { AppShell } from "@/components/library/AppShell";
import { SetupNotice, Skeleton } from "@/components/stores/StoreBits";
import { useStoreDirectory } from "@/hooks/use-stores";
import { STORE_SIGNUP_FORM_URL, STORES_ROOT_DOMAIN, storeTheme } from "@/lib/stores";

export const Route = createFileRoute("/stores/")({
  head: () => ({
    meta: [
      { title: "SlashAI Stores — free online shops for small businesses" },
      {
        name: "description",
        content:
          "Free hosted storefronts for small businesses and creators: add products, share your own subdomain, take orders on WhatsApp. No fees, no commission, no shopper accounts.",
      },
    ],
  }),
  component: StoresDirectory,
});

const STEPS = [
  {
    icon: StoreIcon,
    title: "Claim your address",
    body: `Sign in, name the store, and pick an address like yourstore.${STORES_ROOT_DOMAIN}. It is reserved instantly.`,
  },
  {
    icon: Zap,
    title: "Add your products",
    body: "Name, price, photo, stock — one form per product. Photos upload straight from your phone.",
  },
  {
    icon: Globe,
    title: "Share one link",
    body: "Shoppers browse without an account, place an order, and the details land in your dashboard and WhatsApp.",
  },
];

function StoresDirectory() {
  const { stores, loading, error } = useStoreDirectory();

  return (
    <AppShell wide title="Stores">
      <header className="page-enter pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11.5px] font-bold text-primary">
          <StoreIcon className="size-3.5" aria-hidden />
          Free for every small business
        </span>
        <h1 className="mt-3 bg-gradient-to-r from-[#2dd4bf] via-[#38bdf8] to-[#a78bfa] bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          SlashAI Stores
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          A real online shop in a few minutes: your own subdomain, your products, your
          customers — no platform fees, no commission and no account for shoppers.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/stores/dashboard"
            className="ripple-press inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#818cf8] px-5 text-[13.5px] font-black text-white"
          >
            Open your store <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href="#how"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-[13.5px] font-bold text-foreground"
          >
            How it works
          </a>
        </div>
        <p className="mt-3 text-[12.5px] text-muted-foreground">
          Already have a store website or storefront?{" "}
          <a
            href={STORE_SIGNUP_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
          >
            Add it to this directory with a 1-minute form
          </a>
          .
        </p>
      </header>

      <section className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <ClipboardList className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-[13.5px] font-bold text-foreground">Have a store website or storefront already?</h2>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
            List it here so shoppers can find it — fill the short Google Form and we add your store to the directory.
          </p>
        </div>
        <a
          href={STORE_SIGNUP_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ripple-press inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-background sm:ml-auto"
        >
          Fill the form <ArrowRight className="size-4" aria-hidden />
        </a>
      </section>

      <section id="how" className="mt-6 grid gap-3 sm:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-2xl border border-border bg-surface p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/12">
                <Icon className="size-4 text-primary" aria-hidden />
              </span>
              <h2 className="mt-3 text-[14px] font-bold text-foreground">{step.title}</h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          [
            "No commission, ever",
            "SlashAI does not touch your money. Orders are orders — you take payment the way you already do: UPI, cash on delivery or bank transfer.",
          ],
          [
            "Built for WhatsApp shops",
            "Every order comes with a one-tap WhatsApp hand-off for both sides, so the conversation can continue where it always happens.",
          ],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-border bg-surface p-4">
            <h2 className="flex items-center gap-2 text-[14px] font-bold text-foreground">
              <ShieldCheck className="size-4 text-emerald-400" aria-hidden />
              {title}
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      {error ? (
        <div className="mt-6">
          <SetupNotice />
        </div>
      ) : null}

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-bold text-foreground">Browse stores</h2>
          {!loading && !error ? (
            <span className="text-[12px] text-muted-foreground">
              {stores.length} live store{stores.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-3">
            <Skeleton lines={3} />
          </div>
        ) : stores.length === 0 && !error ? (
          <div className="mt-3 rounded-2xl border border-border bg-surface p-8 text-center">
            <span className="text-[34px]">🏪</span>
            <p className="mt-2 text-[14px] font-bold text-foreground">No stores yet</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Yours could be the first one on the block.
            </p>
            <Link
              to="/stores/dashboard"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-[13px] font-bold text-background"
            >
              Create a store
            </Link>
            <p className="mt-3 text-[12px] text-muted-foreground">
              Or{" "}
              <a
                href={STORE_SIGNUP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
              >
                list your existing store website
              </a>{" "}
              with the form.
            </p>
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const theme = storeTheme(store.theme);
              return (
                <Link
                  key={store.id}
                  to="/stores/$slug"
                  params={{ slug: store.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40"
                >
                  <div
                    className="h-20 w-full"
                    style={{ background: `linear-gradient(135deg, ${theme.tint}, transparent 75%)` }}
                  />
                  <div className="-mt-8 flex items-start gap-3 px-4 pb-4">
                    {store.logo_url ? (
                      <img
                        src={store.logo_url}
                        alt=""
                        className="size-14 shrink-0 rounded-2xl border border-border object-cover"
                      />
                    ) : (
                      <span
                        className="grid size-14 shrink-0 place-items-center rounded-2xl text-[20px] font-black text-white"
                        style={{ background: theme.gradient }}
                      >
                        {store.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 pt-9">
                      <h3 className="truncate text-[14.5px] font-bold text-foreground">
                        {store.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">
                        {store.tagline ?? "Open the store to see what is in stock."}
                      </p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {store.productCount} item{store.productCount === 1 ? "" : "s"} · prices in{" "}
                        {store.currency}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
