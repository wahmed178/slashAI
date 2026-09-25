/**
 * Public storefront — what a shopper sees at `/stores/<slug>` (and on
 * `<slug>.slashai.in` once the wildcard domain is live).
 *
 * Shoppers need no account: the cart lives in localStorage for the visit,
 * checkout calls the `place_order` RPC which verifies prices server-side, and
 * the confirmation screen can forward the order to the owner on WhatsApp —
 * which is how most small Indian stores actually take orders.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Link2, MapPin, Minus, Phone, Plus, Share2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Notice, SetupNotice, Skeleton } from "./StoreBits";
import {
  STORE_SIGNUP_FORM_URL,
  SUPABASE_READY,
  cartCount,
  cartPayload,
  cartSubtotal,
  enquiryMessage,
  formatMoney,
  friendlyError,
  orderMessage,
  readCart,
  storeHostUrl,
  storeTheme,
  submitOrder,
  waLink,
  writeCart,
  type CartLine,
  type OrderResult,
  type Product,
  type Store,
} from "@/lib/stores";
import { useStorefront } from "@/hooks/use-stores";

interface Placed {
  result: OrderResult;
  lines: CartLine[];
}

export function Storefront({ slug, standalone = false }: { slug: string; standalone?: boolean }) {
  const { store, products, loading, error } = useStorefront(slug);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);

  // Restore this store's saved cart exactly once per store, as soon as the
  // catalogue is known. Re-running later (a refresh, a store reload) would
  // throw away whatever the shopper has added in the meantime.
  const hydrated = useRef<string | null>(null);
  useEffect(() => {
    if (!store || products.length === 0) return;
    if (hydrated.current === slug) return;
    hydrated.current = slug;
    const restored = readCart(slug)
      .map((line) => {
        const product = products.find((p) => p.id === line.product_id);
        return product ? { product, quantity: line.quantity } : null;
      })
      .filter((line): line is CartLine => line !== null);
    if (restored.length > 0) setLines(restored);
  }, [store, products, slug]);

  // Persist, but never before the restore pass has run for this store —
  // otherwise the first render would wipe the saved cart.
  useEffect(() => {
    if (hydrated.current !== slug) return;
    writeCart(slug, cartPayload(lines));
  }, [slug, lines]);

  const count = cartCount(lines);
  const subtotal = cartSubtotal(lines);

  const changeQuantity = useCallback((productId: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((line) =>
          line.product.id === productId
            ? { ...line, quantity: Math.max(0, Math.min(99, line.quantity + delta)) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const addToCart = useCallback((product: Product) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: Math.min(99, line.quantity + 1) }
            : line,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.title} added`);
  }, []);

  if (!SUPABASE_READY) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <SetupNotice />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Skeleton lines={5} />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="mx-auto max-w-xl px-4 py-14 text-center">
        <span className="text-[40px]">🔍</span>
        <h1 className="mt-3 font-display text-[22px] font-black text-foreground">
          Store not found
        </h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {error ?? "That store does not exist."} The address may be mistyped, or the owner may
          have unpublished it.
        </p>
        <a
          href="/stores"
          className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-[13px] font-bold text-background"
        >
          Browse all stores
        </a>
      </div>
    );
  }

  const theme = storeTheme(store.theme);

  return (
    <div
      className={standalone ? "min-h-screen bg-background pb-28" : "pb-28"}
      style={{ ["--store-accent" as string]: theme.accent }}
    >
      {standalone ? <StoreTopBar name={store.name} /> : null}

      {/* branded hero */}
      <header
        className="relative overflow-hidden rounded-3xl border border-border p-5 sm:p-7"
        style={{ background: `linear-gradient(150deg, ${theme.tint}, transparent 70%)` }}
      >
        <div className="flex items-start gap-4">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt=""
              className="size-16 shrink-0 rounded-2xl border border-border object-cover sm:size-20"
            />
          ) : (
            <span
              className="grid size-16 shrink-0 place-items-center rounded-2xl text-[26px] font-black text-white sm:size-20"
              style={{ background: theme.gradient }}
            >
              {store.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[22px] font-black leading-tight text-foreground sm:text-[28px]">
              {store.name}
            </h1>
            {store.tagline ? (
              <p className="mt-1 text-[13.5px] text-muted-foreground">{store.tagline}</p>
            ) : null}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11.5px]">
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-semibold text-muted-foreground">
                {products.length} item{products.length === 1 ? "" : "s"}
              </span>
              {store.address ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground">
                  <MapPin className="size-3" aria-hidden />
                  {store.address}
                </span>
              ) : null}
              {!store.is_published ? (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-400">
                  Preview — not published
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {store.description ? (
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
            {store.description}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {store.whatsapp ? (
            <a
              href={waLink(store.whatsapp, enquiryMessage(store))}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 text-[12.5px] font-bold text-white"
            >
              💬 WhatsApp
            </a>
          ) : null}
          {store.phone ? (
            <a
              href={`tel:${store.phone.replace(/\s+/g, "")}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-[12.5px] font-semibold text-foreground"
            >
              <Phone className="size-3.5" aria-hidden /> Call
            </a>
          ) : null}
          {store.instagram ? (
            <a
              href={`https://instagram.com/${store.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-[12.5px] font-semibold text-foreground"
            >
              📷 Instagram
            </a>
          ) : null}
          {store.email ? (
            <a
              href={`mailto:${store.email}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-[12.5px] font-semibold text-foreground"
            >
              ✉️ Email
            </a>
          ) : null}
          <ShareStoreButton slug={slug} />
        </div>
      </header>

      {/* products */}
      <section className="mt-5">
        <h2 className="px-1 text-[15px] font-bold text-foreground">Shop</h2>
        {products.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-border bg-surface p-6 text-center">
            <span className="text-[30px]">📦</span>
            <p className="mt-2 text-[13.5px] font-semibold text-foreground">
              Nothing in the shop yet
            </p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              {store.whatsapp
                ? "Message the store on WhatsApp — they will tell you what is available."
                : "Check back soon."}
            </p>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={store.currency}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-center text-[11.5px] text-muted-foreground">
        Powered by{" "}
        <a href="/stores" className="font-semibold text-primary">
          SlashAI Stores
        </a>{" "}
        · free for every small business ·{" "}
        <a
          href={STORE_SIGNUP_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:text-primary/80"
        >
          list your store
        </a>
      </p>

      {/* sticky cart bar */}
      {count > 0 && !cartOpen && !placed ? (
        <div className="fixed inset-x-0 bottom-[68px] z-40 px-3 sm:bottom-4">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-primary/40 bg-surface px-4 py-3 shadow-xl backdrop-blur"
          >
            <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-[15px]">
              <ShoppingBag className="size-4 text-primary" aria-hidden />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[13px] font-bold text-foreground">
                {count} item{count === 1 ? "" : "s"} in cart
              </span>
              <span className="block text-[11.5px] text-muted-foreground">
                {formatMoney(subtotal, store.currency)}
              </span>
            </span>
            <span className="rounded-xl bg-primary px-3.5 py-2 text-[12.5px] font-bold text-background">
              Checkout
            </span>
          </button>
        </div>
      ) : null}

      {cartOpen || placed ? (
        <CartPanel
          store={store}
          lines={lines}
          placed={placed}
          onClose={() => {
            setCartOpen(false);
            setPlaced(null);
          }}
          onQuantity={changeQuantity}
          onRemove={(id) => setLines((prev) => prev.filter((line) => line.product.id !== id))}
          onPlaced={(result, snapshot) => {
            setPlaced({ result, lines: snapshot });
            setLines([]);
          }}
        />
      ) : null}
    </div>
  );
}

/* ─────────────────────────── pieces ─────────────────────────── */

function StoreTopBar({ name }: { name: string }) {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <a
          href="/"
          className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden /> SlashAI
        </a>
        <span className="ml-auto truncate text-[12.5px] font-semibold text-foreground">{name}</span>
      </div>
    </div>
  );
}

function ShareStoreButton({ slug }: { slug: string }) {
  const link = storeHostUrl(slug);
  return (
    <button
      type="button"
      onClick={() => {
        void (async () => {
          const url = typeof window === "undefined" ? link : `${link}`;
          try {
            if (typeof navigator !== "undefined" && navigator.share) {
              await navigator.share({ url, title: "Store" });
              return;
            }
            await navigator.clipboard.writeText(url);
            toast.success("Store link copied");
          } catch {
            toast.error("Could not share the link");
          }
        })();
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 text-[12.5px] font-semibold text-foreground"
    >
      <Share2 className="size-3.5" aria-hidden /> Share store
    </button>
  );
}

function ProductCard({
  product,
  currency,
  onAdd,
}: {
  product: Product;
  currency: string;
  onAdd: () => void;
}) {
  const discounted =
    product.compare_at_price !== null && product.compare_at_price > product.price;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square w-full overflow-hidden bg-surface-elevated">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span className="grid size-full place-items-center text-[34px]">🛍️</span>
        )}
        {!product.in_stock ? (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-[10.5px] font-bold text-white">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-[13px] font-semibold leading-snug text-foreground">{product.title}</h3>
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-[11.5px] text-muted-foreground">
            {product.description}
          </p>
        ) : null}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[14px] font-black text-foreground">
            {formatMoney(product.price, currency)}
          </span>
          {discounted ? (
            <span className="text-[11px] text-muted-foreground line-through">
              {formatMoney(product.compare_at_price ?? 0, currency)}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!product.in_stock}
          onClick={onAdd}
          className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-[12.5px] font-bold text-background transition-opacity disabled:opacity-40"
        >
          {product.in_stock ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

function CartPanel({
  store,
  lines,
  placed,
  onClose,
  onQuantity,
  onRemove,
  onPlaced,
}: {
  store: Store;
  lines: CartLine[];
  placed: Placed | null;
  onClose: () => void;
  onQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onPlaced: (result: OrderResult, snapshot: CartLine[]) => void;
}) {
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => cartSubtotal(lines), [lines]);

  const submit = useCallback(async () => {
    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 6) {
      setError("Please enter a phone number the store can reach you on.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const snapshot = lines;
      const result = await submitOrder({
        storeId: store.id,
        lines: snapshot,
        customer: { name, phone, email, address, notes },
      });
      onPlaced(result, snapshot);
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setBusy(false);
    }
  }, [address, email, lines, name, notes, onPlaced, phone, store.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-4 sm:rounded-3xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        {placed ? (
          <OrderSuccess store={store} placed={placed} onClose={onClose} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-foreground">
                {step === "cart" ? "Your cart" : "Delivery details"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            {step === "cart" ? (
              <>
                {lines.length === 0 ? (
                  <p className="mt-4 text-[13px] text-muted-foreground">
                    Your cart is empty. Add something from the shop.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-border">
                    {lines.map((line) => (
                      <li key={line.product.id} className="flex items-center gap-3 py-3">
                        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-elevated text-[20px]">
                          {line.product.image_url ? (
                            <img
                              src={line.product.image_url}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            "🛍️"
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-foreground">
                            {line.product.title}
                          </span>
                          <span className="block text-[11.5px] text-muted-foreground">
                            {formatMoney(line.product.price, store.currency)} each
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`One less ${line.product.title}`}
                            onClick={() => onQuantity(line.product.id, -1)}
                            className="grid size-7 place-items-center rounded-lg border border-border text-foreground"
                          >
                            <Minus className="size-3.5" aria-hidden />
                          </button>
                          <span className="w-6 text-center text-[13px] font-bold text-foreground">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`One more ${line.product.title}`}
                            onClick={() => onQuantity(line.product.id, 1)}
                            className="grid size-7 place-items-center rounded-lg border border-border text-foreground"
                          >
                            <Plus className="size-3.5" aria-hidden />
                          </button>
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${line.product.title}`}
                          onClick={() => onRemove(line.product.id)}
                          className="text-muted-foreground hover:text-rose-400"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[13px] font-semibold text-muted-foreground">Subtotal</span>
                  <span className="text-[16px] font-black text-foreground">
                    {formatMoney(subtotal, store.currency)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={lines.length === 0}
                  onClick={() => setStep("details")}
                  className="mt-4 h-11 w-full rounded-xl bg-primary text-[13.5px] font-bold text-background disabled:opacity-40"
                >
                  Continue
                </button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  You pay the store directly — no card details are taken here.
                </p>
              </>
            ) : (
              <>
                <div className="mt-3 space-y-3">
                  <StoreField label="Your name" required value={name} onChange={setName} placeholder="Waseem Ahmed" />
                  <StoreField
                    label="Phone / WhatsApp"
                    required
                    value={phone}
                    onChange={setPhone}
                    placeholder="98765 43210"
                    inputMode="tel"
                  />
                  <StoreField
                    label="Email (optional)"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    type="email"
                  />
                  <StoreField
                    label="Delivery address (optional)"
                    value={address}
                    onChange={setAddress}
                    placeholder="Flat, street, city, PIN"
                    multiline
                  />
                  <StoreField
                    label="Anything else? (optional)"
                    value={notes}
                    onChange={setNotes}
                    placeholder="Size, colour, preferred delivery time…"
                    multiline
                  />
                </div>

                {error ? (
                  <div className="mt-3">
                    <Notice>{error}</Notice>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[13px] text-muted-foreground">
                    {cartCount(lines)} item{cartCount(lines) === 1 ? "" : "s"}
                  </span>
                  <span className="text-[16px] font-black text-foreground">
                    {formatMoney(subtotal, store.currency)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="h-11 flex-1 rounded-xl border border-border text-[13px] font-bold text-foreground"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void submit()}
                    className="h-11 flex-[2] rounded-xl bg-primary text-[13.5px] font-bold text-background disabled:opacity-50"
                  >
                    {busy ? "Placing order…" : "Place order"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function OrderSuccess({
  store,
  placed,
  onClose,
}: {
  store: Store;
  placed: Placed;
  onClose: () => void;
}) {
  const message = orderMessage(store, placed.result, placed.lines);
  return (
    <div className="text-center">
      <span className="grid mx-auto size-14 place-items-center rounded-full bg-emerald-500/15">
        <Check className="size-7 text-emerald-400" aria-hidden />
      </span>
      <h2 className="mt-3 font-display text-[20px] font-black text-foreground">Order placed</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {store.name} has your order. Keep this code — the store will use it to find you.
      </p>
      <p className="mt-4 font-mono text-[18px] font-bold text-foreground">
        {placed.result.order_code}
      </p>
      <p className="mt-1 text-[15px] font-bold text-foreground">
        {formatMoney(placed.result.subtotal, placed.result.currency)}
      </p>

      <div className="mt-5 space-y-2">
        {store.whatsapp ? (
          <a
            href={waLink(store.whatsapp, message)}
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#25D366] text-[13.5px] font-bold text-white"
          >
            Send the order on WhatsApp
          </a>
        ) : null}
        {store.phone ? (
          <a
            href={`tel:${store.phone.replace(/\s+/g, "")}`}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-[13px] font-bold text-foreground"
          >
            Call the store
          </a>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-xl border border-border text-[13px] font-bold text-foreground"
        >
          Keep shopping
        </button>
      </div>
    </div>
  );
}

/** Local copy of the field markup — the checkout is tighter than StoreBits.Field. */
function StoreField({
  label,
  value,
  onChange,
  placeholder,
  required,
  multiline,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  inputMode?: "text" | "tel" | "email";
}) {
  const base =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-foreground">
        {label}
        {required ? <span className="text-rose-400"> *</span> : null}
      </span>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={base}
        />
      ) : (
        <input
          value={value}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={base}
        />
      )}
    </label>
  );
}

/** Small helper used by the directory and the subdomain gate. */
export function StoreLinkChip({ url, label }: { url: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard
          .writeText(url)
          .then(() => toast.success(`${label} copied`))
          .catch(() => toast.error("Could not copy"));
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-[11.5px] font-semibold text-muted-foreground hover:text-foreground"
    >
      <Link2 className="size-3" aria-hidden />
      {url.replace(/^https?:\/\//, "")}
    </button>
  );
}
