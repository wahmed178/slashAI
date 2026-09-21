/**
 * Owner dashboard for Slash Stores — `/stores/dashboard`.
 *
 * Three jobs, in this order: sign in (email + password via Supabase Auth),
 * create a store (which reserves its subdomain), then run it — products,
 * orders and settings. Nothing here is visible to shoppers; Row Level Security
 * means an owner can only ever read or write their own store.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  LogOut,
  Package,
  Plus,
  Receipt,
  Settings2,
  Store as StoreIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Field, Notice, SetupNotice, Skeleton, ThemePicker } from "./StoreBits";
import { useMyStores, useStoreAuth, useStoreOrders, useStoreProducts } from "@/hooks/use-stores";
import {
  CURRENCIES,
  ORDER_STATUSES,
  SUPABASE_READY,
  STORES_ROOT_DOMAIN,
  createStore,
  deleteProduct,
  deleteStore,
  formatMoney,
  friendlyError,
  saveProduct,
  setOrderStatus,
  slugError,
  slugify,
  storeHostUrl,
  storeTheme,
  updateStore,
  uploadStoreImage,
  waLink,
  type OrderStatus,
  type Product,
  type ProductDraft,
  type Store,
  type StoreDraft,
  type StoreThemeId,
} from "@/lib/stores";

const emptyDraft = (): StoreDraft => ({
  slug: "",
  name: "",
  tagline: "",
  description: "",
  whatsapp: "",
  phone: "",
  email: "",
  instagram: "",
  address: "",
  currency: "INR",
  theme: "graphite",
  is_published: true,
});

const draftFromStore = (store: Store): StoreDraft => ({
  slug: store.slug,
  name: store.name,
  tagline: store.tagline ?? "",
  description: store.description ?? "",
  whatsapp: store.whatsapp ?? "",
  phone: store.phone ?? "",
  email: store.email ?? "",
  instagram: store.instagram ?? "",
  address: store.address ?? "",
  currency: store.currency,
  theme: store.theme,
  is_published: store.is_published,
});

const emptyProduct = (): ProductDraft => ({
  title: "",
  description: "",
  price: 0,
  compare_at_price: null,
  image_url: null,
  category: "",
  in_stock: true,
});

export function StoreManager({ initialSlug }: { initialSlug?: string | undefined }) {
  const auth = useStoreAuth();
  const { stores, loading, error, reload } = useMyStores(auth.user?.id ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Deep link from a storefront: /stores/dashboard?store=<slug>
  useEffect(() => {
    if (stores.length === 0) return;
    setSelectedId((current) => {
      if (current && stores.some((s) => s.id === current)) return current;
      const wanted = initialSlug ? stores.find((s) => s.slug === initialSlug) : undefined;
      return (wanted ?? stores[0])?.id ?? null;
    });
  }, [stores, initialSlug]);

  const selected = useMemo(
    () => stores.find((store) => store.id === selectedId) ?? null,
    [stores, selectedId],
  );

  if (!SUPABASE_READY) {
    return (
      <div className="mx-auto max-w-2xl">
        <SetupNotice />
      </div>
    );
  }

  if (auth.loading) {
    return (
      <div className="mx-auto max-w-2xl py-6">
        <Skeleton lines={4} />
      </div>
    );
  }

  if (!auth.user) return <AuthCard auth={auth} />;

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-[22px] font-black text-foreground">Your stores</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Signed in as <span className="text-foreground">{auth.user.email}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => void auth.signOut()}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-3.5" aria-hidden /> Sign out
        </button>
      </div>

      {error ? (
        <div className="mt-3">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4">
          <Skeleton lines={3} />
        </div>
      ) : null}

      {/* store switcher */}
      {stores.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {stores.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => setSelectedId(store.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                store.id === selectedId
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className="size-2.5 rounded-full"
                style={{ background: storeTheme(store.theme).gradient }}
              />
              {store.name}
              {!store.is_published ? (
                <span className="text-[10px] font-bold text-amber-400">DRAFT</span>
              ) : null}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCreating((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-[12.5px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3.5" aria-hidden /> New store
          </button>
        </div>
      ) : null}

      {creating || stores.length === 0 ? (
        <CreateStoreCard
          ownerId={auth.user.id}
          onCreated={(store) => {
            setCreating(false);
            setSelectedId(store.id);
            toast.success(`${store.name} is live`);
            reload();
          }}
          onCancel={stores.length > 0 ? () => setCreating(false) : undefined}
        />
      ) : null}

      {selected ? (
        <StoreWorkspace key={selected.id} store={selected} onChanged={reload} />
      ) : null}
    </div>
  );
}

/* ─────────────────────────── auth ─────────────────────────── */

function AuthCard({ auth }: { auth: ReturnType<typeof useStoreAuth> }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = useCallback(async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        await auth.signIn(email, password);
        toast.success("Welcome back");
      } else {
        const { needsConfirmation } = await auth.signUp(email, password);
        if (needsConfirmation) setSent(true);
        else toast.success("Account created");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : friendlyError(cause));
    } finally {
      setBusy(false);
    }
  }, [auth, email, mode, password]);

  if (sent) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-5 text-center">
        <span className="text-[30px]">📩</span>
        <h1 className="mt-2 text-[17px] font-bold text-foreground">Confirm your email</h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          We sent a confirmation link to <b className="text-foreground">{email}</b>. Open it, then
          come back and sign in.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 h-10 rounded-xl border border-border px-4 text-[13px] font-semibold text-foreground"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h1 className="font-display text-[20px] font-black text-foreground">
          {mode === "signin" ? "Store owner sign in" : "Create a store account"}
        </h1>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
          An account is only needed to <b className="text-foreground">run</b> a store. Shoppers buy
          without signing in — free, no fees.
        </p>

        <div className="mt-4 flex gap-2">
          {(["signin", "signup"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMode(id);
                setError(null);
              }}
              className={`h-9 flex-1 rounded-xl border text-[12.5px] font-bold transition-colors ${
                mode === id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {id === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="At least 6 characters"
            required
          />
        </div>

        {error ? (
          <div className="mt-3">
            <Notice>{error}</Notice>
          </div>
        ) : null}

        <button
          type="button"
          disabled={busy}
          onClick={() => void submit()}
          className="mt-4 h-11 w-full rounded-xl bg-primary text-[13.5px] font-bold text-background disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── create store ─────────────────────────── */

function CreateStoreCard({
  ownerId,
  onCreated,
  onCancel,
}: {
  ownerId: string;
  onCreated: (store: Store) => void;
  onCancel?: (() => void) | undefined;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [tagline, setTagline] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState<StoreThemeId>("graphite");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = slugTouched ? slug : slugify(name);
  const problem = effectiveSlug ? slugError(effectiveSlug) : null;

  const submit = useCallback(async () => {
    if (name.trim().length < 2) {
      setError("Give the store a name.");
      return;
    }
    const slugProblem = slugError(effectiveSlug);
    if (slugProblem) {
      setError(slugProblem);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const store = await createStore(ownerId, {
        ...emptyDraft(),
        slug: effectiveSlug,
        name,
        tagline,
        whatsapp,
        currency,
        theme,
      });
      onCreated(store);
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setBusy(false);
    }
  }, [currency, effectiveSlug, name, onCreated, ownerId, tagline, theme, whatsapp]);

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <StoreIcon className="size-4 text-primary" aria-hidden />
        <h2 className="text-[15px] font-bold text-foreground">Create your store</h2>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto text-[12px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Your store goes live at{" "}
        <span className="font-mono text-foreground">
          {effectiveSlug || "your-store"}.{STORES_ROOT_DOMAIN}
        </span>{" "}
        right away. Add products next — it takes a minute.
      </p>

      <div className="mt-4 space-y-3">
        <Field label="Store name" value={name} onChange={setName} placeholder="Ayesha Boutique" required />
        <Field
          label="Web address"
          value={effectiveSlug}
          onChange={(value) => {
            setSlugTouched(true);
            setSlug(value.toLowerCase());
          }}
          prefix={`${STORES_ROOT_DOMAIN}/`}
          placeholder="ayesha-boutique"
          hint={
            problem ??
            "Lowercase letters, numbers and hyphens. This becomes the subdomain and the link you share."
          }
        />
        <Field
          label="One-line tagline"
          value={tagline}
          onChange={setTagline}
          placeholder="Hand-embroidered kurtis, made in Hyderabad"
        />
        <Field
          label="WhatsApp number"
          value={whatsapp}
          onChange={setWhatsapp}
          placeholder="98765 43210"
          inputMode="tel"
          hint="Shoppers tap one button and land in your WhatsApp with the order already written out."
        />
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-semibold text-foreground">Currency</span>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13.5px] text-foreground focus:border-primary focus:outline-none"
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-1.5 block text-[12px] font-semibold text-foreground">Look</span>
          <ThemePicker value={theme} onChange={setTheme} />
        </div>
      </div>

      {error ? (
        <div className="mt-3">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onClick={() => void submit()}
        className="mt-4 h-11 w-full rounded-xl bg-primary text-[13.5px] font-bold text-background disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create store"}
      </button>
    </div>
  );
}

/* ─────────────────────────── workspace ─────────────────────────── */

type Tab = "products" | "orders" | "settings";

function StoreWorkspace({ store, onChanged }: { store: Store; onChanged: () => void }) {
  const [tab, setTab] = useState<Tab>("products");
  const products = useStoreProducts(store.id);
  const orders = useStoreOrders(store.id);

  return (
    <div className="mt-5">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="grid size-11 place-items-center rounded-xl text-[17px] font-black text-white"
            style={{ background: storeTheme(store.theme).gradient }}
          >
            {store.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-foreground">{store.name}</p>
            <a
              href={`/stores/${store.slug}`}
              className="font-mono text-[11.5px] text-primary hover:underline"
            >
              /stores/{store.slug}
            </a>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard
                  .writeText(storeHostUrl(store.slug))
                  .then(() => toast.success("Store link copied"))
                  .catch(() => toast.error("Could not copy"));
              }}
              className="h-9 rounded-xl border border-border px-3 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
            >
              Copy link
            </button>
            <a
              href={`/stores/${store.slug}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-semibold text-foreground"
            >
              <ExternalLink className="size-3.5" aria-hidden /> Open
            </a>
          </div>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          Share <span className="font-mono text-foreground">{storeHostUrl(store.slug)}</span> — it
          needs a wildcard <span className="font-mono">*.{STORES_ROOT_DOMAIN}</span> domain in
          Vercel, which the setup guide covers.
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {(
          [
            { id: "products", label: `Products (${products.products.length})`, icon: Package },
            { id: "orders", label: `Orders (${orders.orders.length})`, icon: Receipt },
            { id: "settings", label: "Settings", icon: Settings2 },
          ] as const
        ).map((entry) => {
          const Icon = entry.icon;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[12.5px] font-semibold transition-colors ${
                tab === entry.id
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" aria-hidden />
              {entry.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {tab === "products" ? (
          <ProductsTab store={store} products={products.products} loading={products.loading} reload={products.reload} />
        ) : null}
        {tab === "orders" ? (
          <OrdersTab store={store} orders={orders.orders} loading={orders.loading} error={orders.error} reload={orders.reload} />
        ) : null}
        {tab === "settings" ? <SettingsTab store={store} onSaved={onChanged} /> : null}
      </div>
    </div>
  );
}

/* ─────────────────────────── products ─────────────────────────── */

function ProductsTab({
  store,
  products,
  loading,
  reload,
}: {
  store: Store;
  products: Product[];
  loading: boolean;
  reload: () => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>(emptyProduct());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setDraft(emptyProduct());
    setEditingId(null);
    setError(null);
  };

  const submit = useCallback(async () => {
    if (draft.title.trim().length < 1) {
      setError("Give the product a name.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await saveProduct(store.id, draft, editingId ?? undefined);
      toast.success(editingId ? "Product updated" : "Product added");
      reset();
      reload();
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setBusy(false);
    }
  }, [draft, editingId, reload, store.id]);

  const onImage = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setUploading(true);
      setError(null);
      try {
        const url = await uploadStoreImage(store.id, file);
        setDraft((current) => ({ ...current, image_url: url }));
        toast.success("Image uploaded");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : friendlyError(cause));
      } finally {
        setUploading(false);
      }
    },
    [store.id],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="text-[14px] font-bold text-foreground">
          {editingId ? "Edit product" : "Add a product"}
        </h3>
        <div className="mt-3 space-y-3">
          <Field
            label="Product name"
            value={draft.title}
            onChange={(value) => setDraft((c) => ({ ...c, title: value }))}
            placeholder="Cotton kurti — indigo"
            required
          />
          <Field
            label="Description"
            value={draft.description}
            onChange={(value) => setDraft((c) => ({ ...c, description: value }))}
            multiline
            placeholder="Hand-block printed, sizes S–XL"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label={`Price (${store.currency})`}
              value={String(draft.price)}
              onChange={(value) => setDraft((c) => ({ ...c, price: toNumber(value) }))}
              inputMode="decimal"
              type="number"
              required
            />
            <Field
              label="Was (optional)"
              value={draft.compare_at_price === null ? "" : String(draft.compare_at_price)}
              onChange={(value) =>
                setDraft((c) => ({ ...c, compare_at_price: value === "" ? null : toNumber(value) }))
              }
              inputMode="decimal"
              type="number"
              hint="Shows a struck-through price"
            />
          </div>
          <Field
            label="Category (optional)"
            value={draft.category}
            onChange={(value) => setDraft((c) => ({ ...c, category: value }))}
            placeholder="Kurtis"
          />

          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-foreground">
              Photo (optional)
            </span>
            <div className="flex items-center gap-3">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface-elevated text-[20px]">
                {draft.image_url ? (
                  <img src={draft.image_url} alt="" className="size-full object-cover" />
                ) : (
                  "🛍️"
                )}
              </span>
              <label className="inline-flex h-9 cursor-pointer items-center rounded-xl border border-border px-3 text-[12px] font-semibold text-foreground">
                {uploading ? "Uploading…" : draft.image_url ? "Replace photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => void onImage(event.target.files?.[0])}
                />
              </label>
              {draft.image_url ? (
                <button
                  type="button"
                  onClick={() => setDraft((c) => ({ ...c, image_url: null }))}
                  className="text-[12px] font-semibold text-muted-foreground hover:text-rose-400"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>

          <label className="flex items-center gap-2 text-[12.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.in_stock}
              onChange={(event) => setDraft((c) => ({ ...c, in_stock: event.target.checked }))}
              className="size-4 accent-[var(--primary)]"
            />
            In stock
          </label>
        </div>

        {error ? (
          <div className="mt-3">
            <Notice>{error}</Notice>
          </div>
        ) : null}

        <div className="mt-4 flex gap-2">
          {editingId ? (
            <button
              type="button"
              onClick={reset}
              className="h-10 flex-1 rounded-xl border border-border text-[12.5px] font-bold text-foreground"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="h-10 flex-[2] rounded-xl bg-primary text-[13px] font-bold text-background disabled:opacity-50"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Add product"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="text-[14px] font-bold text-foreground">Catalogue</h3>
        {loading ? (
          <div className="mt-3">
            <Skeleton lines={3} />
          </div>
        ) : products.length === 0 ? (
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            No products yet. Add your first one above — it appears on the storefront straight away.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-elevated text-[18px]">
                  {product.image_url ? (
                    <img src={product.image_url} alt="" className="size-full object-cover" />
                  ) : (
                    "🛍️"
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-foreground">
                    {product.title}
                  </span>
                  <span className="block text-[11.5px] text-muted-foreground">
                    {formatMoney(product.price, store.currency)}
                    {!product.in_stock ? " · sold out" : ""}
                    {product.category ? ` · ${product.category}` : ""}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(product.id);
                    setDraft({
                      title: product.title,
                      description: product.description ?? "",
                      price: product.price,
                      compare_at_price: product.compare_at_price,
                      image_url: product.image_url,
                      category: product.category ?? "",
                      in_stock: product.in_stock,
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-lg border border-border px-2.5 py-1 text-[11.5px] font-semibold text-foreground"
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${product.title}`}
                  onClick={() => {
                    void (async () => {
                      try {
                        await deleteProduct(product.id);
                        toast.success("Product deleted");
                        reload();
                      } catch (cause) {
                        toast.error(friendlyError(cause));
                      }
                    })();
                  }}
                  className="text-muted-foreground hover:text-rose-400"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── orders ─────────────────────────── */

function OrdersTab({
  store,
  orders,
  loading,
  error,
  reload,
}: {
  store: Store;
  orders: ReturnType<typeof useStoreOrders>["orders"];
  loading: boolean;
  error: string | null;
  reload: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">Orders</h3>
        <button
          type="button"
          onClick={reload}
          className="rounded-lg border border-border px-2.5 py-1 text-[11.5px] font-semibold text-muted-foreground hover:text-foreground"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mt-3">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-3">
          <Skeleton lines={3} />
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-2 text-[12.5px] text-muted-foreground">
          No orders yet. Every order placed on your storefront shows up here with the customer's
          name, phone and items.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-border bg-background p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12.5px] font-bold text-foreground">
                  {order.order_code}
                </span>
                <span className="text-[11.5px] text-muted-foreground">
                  {new Date(order.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="ml-auto text-[13px] font-black text-foreground">
                  {formatMoney(order.subtotal, order.currency)}
                </span>
              </div>

              <p className="mt-2 text-[12.5px] text-foreground">
                {order.customer_name} · {order.customer_phone}
                {order.customer_email ? ` · ${order.customer_email}` : ""}
              </p>
              {order.customer_address ? (
                <p className="mt-0.5 text-[12px] text-muted-foreground">{order.customer_address}</p>
              ) : null}
              {order.notes ? (
                <p className="mt-0.5 text-[12px] italic text-muted-foreground">“{order.notes}”</p>
              ) : null}

              <ul className="mt-2 space-y-0.5">
                {order.items.map((item) => (
                  <li key={item.id} className="text-[12px] text-muted-foreground">
                    {item.quantity} × {item.title} —{" "}
                    {formatMoney(item.unit_price * item.quantity, order.currency)}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={order.status}
                  onChange={(event) => {
                    const status = event.target.value as OrderStatus;
                    void (async () => {
                      try {
                        await setOrderStatus(order.id, status);
                        toast.success("Order updated");
                        reload();
                      } catch (cause) {
                        toast.error(friendlyError(cause));
                      }
                    })();
                  }}
                  className="h-8 rounded-lg border border-border bg-surface px-2 text-[12px] font-semibold text-foreground"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {order.customer_phone ? (
                  <a
                    href={waLink(
                      order.customer_phone,
                      `Hi ${order.customer_name}, about your order ${order.order_code} from ${store.name}:`,
                    )}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-8 items-center rounded-lg bg-[#25D366] px-3 text-[12px] font-bold text-white"
                  >
                    Message buyer
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────── settings ─────────────────────────── */

function SettingsTab({ store, onSaved }: { store: Store; onSaved: () => void }) {
  const [draft, setDraft] = useState<StoreDraft>(() => draftFromStore(store));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = useCallback(async () => {
    if (draft.name.trim().length < 2) {
      setError("Give the store a name.");
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await updateStore(store.id, draft);
      setSaved(true);
      toast.success("Store updated");
      onSaved();
    } catch (cause) {
      setError(friendlyError(cause));
    } finally {
      setBusy(false);
    }
  }, [draft, onSaved, store.id]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="text-[14px] font-bold text-foreground">Store details</h3>
        <div className="mt-3 space-y-3">
          <Field label="Store name" value={draft.name} onChange={(v) => setDraft((c) => ({ ...c, name: v }))} required />
          <Field label="Tagline" value={draft.tagline} onChange={(v) => setDraft((c) => ({ ...c, tagline: v }))} />
          <Field
            label="About the store"
            value={draft.description}
            onChange={(v) => setDraft((c) => ({ ...c, description: v }))}
            multiline
            rows={4}
          />
          <Field label="WhatsApp" value={draft.whatsapp} onChange={(v) => setDraft((c) => ({ ...c, whatsapp: v }))} inputMode="tel" />
          <Field label="Phone" value={draft.phone} onChange={(v) => setDraft((c) => ({ ...c, phone: v }))} inputMode="tel" />
          <Field label="Email" value={draft.email} onChange={(v) => setDraft((c) => ({ ...c, email: v }))} type="email" />
          <Field label="Instagram handle" value={draft.instagram} onChange={(v) => setDraft((c) => ({ ...c, instagram: v }))} placeholder="ayesha.boutique" />
          <Field label="Address" value={draft.address} onChange={(v) => setDraft((c) => ({ ...c, address: v }))} />
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-foreground">Currency</span>
            <select
              value={draft.currency}
              onChange={(event) => setDraft((c) => ({ ...c, currency: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[13.5px] text-foreground focus:border-primary focus:outline-none"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-foreground">Look</span>
            <ThemePicker value={draft.theme} onChange={(theme) => setDraft((c) => ({ ...c, theme }))} />
          </div>
          <label className="flex items-center gap-2 text-[12.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.is_published}
              onChange={(event) => setDraft((c) => ({ ...c, is_published: event.target.checked }))}
              className="size-4 accent-[var(--primary)]"
            />
            Store is live — uncheck to hide it from shoppers
          </label>
        </div>

        {error ? (
          <div className="mt-3">
            <Notice>{error}</Notice>
          </div>
        ) : null}
        {saved && !error ? (
          <div className="mt-3">
            <Notice tone="success">Saved.</Notice>
          </div>
        ) : null}

        <button
          type="button"
          disabled={busy}
          onClick={() => void submit()}
          className="mt-4 h-11 w-full rounded-xl bg-primary text-[13.5px] font-bold text-background disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save store"}
        </button>
      </div>

      <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4">
        <h3 className="text-[14px] font-bold text-foreground">Delete this store</h3>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Removes the store, its products and its order history. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => {
            void (async () => {
              if (
                typeof window !== "undefined" &&
                !window.confirm(`Delete ${store.name} and all of its data?`)
              ) {
                return;
              }
              try {
                await deleteStore(store.id);
                toast.success("Store deleted");
                onSaved();
              } catch (cause) {
                toast.error(friendlyError(cause));
              }
            })();
          }}
          className="mt-3 h-9 rounded-xl border border-rose-500/40 px-3 text-[12px] font-bold text-rose-300"
        >
          Delete store
        </button>
      </div>
    </div>
  );
}

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}
