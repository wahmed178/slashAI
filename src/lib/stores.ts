/**
 * Slash Stores — multi-tenant storefronts on Supabase.
 *
 * Every store owner gets a page at `/stores/<slug>` and, once the wildcard
 * domain is live, a pretty host at `<slug>.<root domain>`. Shoppers never need
 * an account: checkout goes through the `place_order` RPC, which recomputes
 * prices server-side (see supabase/schema.sql). Owners sign in with email +
 * password and manage everything from `/stores/dashboard`.
 *
 * The Supabase URL and anon key are public by design (the anon key is a
 * publishable key; Row Level Security is what protects the data). They come
 * from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. When either is missing
 * the whole feature degrades to a setup notice instead of crashing, so the
 * rest of SlashAI keeps working with no backend at all.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ─────────────────────────── configuration ─────────────────────────── */

function envString(key: string): string {
  const meta = (import.meta as { env?: Record<string, string | undefined> }).env;
  // Browser builds read Vite's import.meta.env; scripts (bun) fall back to the
  // process environment. Never read the .env files directly.
  const fromProcess = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env?.[key];
  const raw = meta?.[key] ?? fromProcess;
  return typeof raw === "string" ? raw.trim() : "";
}

export const SUPABASE_URL = envString("VITE_SUPABASE_URL");
export const SUPABASE_ANON_KEY = envString("VITE_SUPABASE_ANON_KEY");

/** Traffic is disabled until both keys exist and look plausible. */
export const SUPABASE_READY =
  /^https?:\/\//.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20;

/** Root the store subdomains hang off: `<slug>.slashai.in`. */
export const STORES_ROOT_DOMAIN =
  envString("VITE_STORES_ROOT_DOMAIN").toLowerCase() || "slashai.in";

let client: SupabaseClient | null = null;

/** The shared browser client, or null when the project has no keys yet. */
export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_READY) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}

/* ─────────────────────────── types ─────────────────────────── */

export type StoreThemeId = "graphite" | "emerald" | "sunset" | "ocean";

export interface Store {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  address: string | null;
  currency: string;
  theme: StoreThemeId;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category: string | null;
  in_stock: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  store_id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  notes: string | null;
  subtotal: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  title: string;
  unit_price: number;
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface StoreDraft {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  currency: string;
  theme: StoreThemeId;
  is_published: boolean;
}

export interface ProductDraft {
  title: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category: string;
  in_stock: boolean;
}

/* ─────────────────────────── slugs & hosts ─────────────────────────── */

/**
 * Slugs that must never belong to a store: they would shadow a real SlashAI
 * route (`/stores/dashboard`) or a host that matters (www, api, mail...).
 */
export const RESERVED_SLUGS = new Set([
  "www", "app", "api", "admin", "administrator", "dashboard", "stores", "store",
  "mail", "email", "blog", "docs", "help", "support", "static", "assets", "cdn",
  "dev", "staging", "test", "status", "new", "manage", "live", "hub", "tools",
  "play", "learn", "slash", "me", "about", "signin", "login", "auth", "billing",
  "pay", "checkout", "shop", "shops", "my", "shopify", "slashai",
]);

/** Lowercase, hyphenated, matched to the CHECK constraint in schema.sql. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Same rule as `stores.slug check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$')`. */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(slug) && !/--/.test(slug);
}

/** Human-readable reason a slug is unusable, or null when it is fine. */
export function slugError(slug: string): string | null {
  if (!slug) return "Pick a web address for your store.";
  if (slug.length < 3) return "Use at least 3 characters.";
  if (slug.length > 40) return "Keep it under 40 characters.";
  if (!/^[a-z0-9-]+$/.test(slug)) return "Only lowercase letters, numbers and hyphens.";
  if (!isValidSlug(slug)) return "It must start and end with a letter or number.";
  if (RESERVED_SLUGS.has(slug)) return `“${slug}” is reserved — try another.`;
  return null;
}

/** `https://acme.slashai.in` — the link an owner shares. */
export function storeHostUrl(slug: string): string {
  return `https://${slug}.${STORES_ROOT_DOMAIN}`;
}

/** In-app path, always available even before the wildcard domain exists. */
export function storePath(slug: string, sub = ""): string {
  return `/stores/${slug}${sub}`;
}

/**
 * The store slug when the current host is a store subdomain, else null.
 * `acme.slashai.in` → "acme"; `slashai.in` / `www.slashai.in` → null.
 * `acme.localhost` works too, so local development can fake subdomains.
 */
export function storeHostSlug(hostname?: string | null): string | null {
  const raw =
    hostname ?? (typeof window === "undefined" ? "" : window.location.hostname);
  const host = raw.toLowerCase().replace(/\.$/, "").split(":")[0] ?? "";
  if (!host) return null;

  const roots = [STORES_ROOT_DOMAIN, "localhost"];
  for (const root of roots) {
    const suffix = `.${root}`;
    if (!host.endsWith(suffix)) continue;
    const sub = host.slice(0, -suffix.length);
    if (!sub || sub.includes(".")) continue; // one level only: acme.slashai.in
    if (RESERVED_SLUGS.has(sub) || !isValidSlug(sub)) return null;
    return sub;
  }
  return null;
}

/* ─────────────────────────── money ─────────────────────────── */

export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "PKR", "BDT"] as const;

export function formatMoney(amount: number, currency = "INR"): string {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

/* ─────────────────────────── cart ─────────────────────────── */

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

/** The shape the `place_order` RPC expects. Prices are never sent. */
export function cartPayload(lines: CartLine[]): Array<{ product_id: string; quantity: number }> {
  return lines.map((line) => ({ product_id: line.product.id, quantity: line.quantity }));
}

export function cartStorageKey(slug: string): string {
  return `slashai.cart.${slug}`;
}

export function readCart(slug: string): Array<{ product_id: string; quantity: number }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cartStorageKey(slug));
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line): line is { product_id: string; quantity: number } => {
        if (!line || typeof line !== "object") return false;
        const l = line as { product_id?: unknown; quantity?: unknown };
        return typeof l["product_id"] === "string" && typeof l["quantity"] === "number";
      })
      .map((line) => ({ product_id: line.product_id, quantity: Math.max(1, Math.min(99, Math.round(line.quantity))) }));
  } catch {
    return [];
  }
}

export function writeCart(
  slug: string,
  lines: Array<{ product_id: string; quantity: number }>,
): void {
  if (typeof window === "undefined") return;
  try {
    if (lines.length === 0) window.localStorage.removeItem(cartStorageKey(slug));
    else window.localStorage.setItem(cartStorageKey(slug), JSON.stringify(lines));
  } catch {
    /* quota or private mode — the cart simply does not persist */
  }
}

/* ─────────────────────────── store themes ─────────────────────────── */

/**
 * Tenant palettes. Like the category tints in `category-colors.ts` these are
 * deliberate literal colours: they are what a store owner picks, not part of
 * the SlashAI theme tokens.
 */
export interface StoreTheme {
  id: StoreThemeId;
  label: string;
  accent: string;
  tint: string;
  gradient: string;
}

export const STORE_THEMES: StoreTheme[] = [
  {
    id: "graphite",
    label: "Graphite",
    accent: "#e2e8f0",
    tint: "rgba(226,232,240,0.12)",
    gradient: "linear-gradient(135deg, #64748b, #1e293b)",
  },
  {
    id: "emerald",
    label: "Emerald",
    accent: "#34d399",
    tint: "rgba(52,211,153,0.12)",
    gradient: "linear-gradient(135deg, #34d399, #0f766e)",
  },
  {
    id: "sunset",
    label: "Sunset",
    accent: "#fb923c",
    tint: "rgba(251,146,60,0.12)",
    gradient: "linear-gradient(135deg, #fb923c, #be185d)",
  },
  {
    id: "ocean",
    label: "Ocean",
    accent: "#38bdf8",
    tint: "rgba(56,189,248,0.12)",
    gradient: "linear-gradient(135deg, #38bdf8, #4338ca)",
  },
];

export function storeTheme(id: string | null | undefined): StoreTheme {
  return STORE_THEMES.find((t) => t.id === id) ?? STORE_THEMES[0]!;
}

/* ─────────────────────────── queries ─────────────────────────── */

const STORE_COLUMNS =
  "id,owner_id,slug,name,tagline,description,logo_url,whatsapp,phone,email,instagram,address,currency,theme,is_published,created_at,updated_at";
const PRODUCT_COLUMNS =
  "id,store_id,title,description,price,compare_at_price,image_url,category,in_stock,sort_order,created_at,updated_at";

/** Turns any Supabase/network failure into something worth showing a human. */
export function friendlyError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : ((error as { message?: string } | null)?.message ?? "");

  if (!message) return "Something went wrong. Please try again.";
  if (/fetch|network|failed to load/i.test(message))
    return "Could not reach the store service. Check your connection and try again.";
  if (/store_not_found/.test(message)) return "That store does not exist any more.";
  if (/store_unavailable/.test(message)) return "This store is not accepting orders right now.";
  if (/name_required/.test(message)) return "Please enter your name.";
  if (/phone_required/.test(message)) return "Please enter a phone number so the store can reach you.";
  if (/cart_empty/.test(message)) return "Your cart is empty.";
  if (/no_valid_items/.test(message))
    return "Those items are no longer available — refresh the store and try again.";
  if (/too_many_items/.test(message)) return "That is too many items in one order.";
  if (/duplicate key|already exists/i.test(message)) return "That web address is already taken.";
  if (/row-level security|permission denied/i.test(message))
    return "You do not have permission to do that.";
  if (/invalid login credentials/i.test(message)) return "Wrong email or password.";
  if (/email not confirmed/i.test(message)) return "Confirm your email first — check your inbox.";
  if (/rate limit|too many requests/i.test(message))
    return "Too many attempts. Wait a minute and try again.";
  return message;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Stores are not connected yet (missing Supabase keys).");
  return supabase;
}

export async function fetchStoreBySlug(slug: string): Promise<Store | null> {
  const { data, error } = await db()
    .from("stores")
    .select(STORE_COLUMNS)
    .eq("slug", slug.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return (data as Store | null) ?? null;
}

export async function fetchStoreProducts(
  storeId: string,
  includeOutOfStock = true,
): Promise<Product[]> {
  let query = db()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("store_id", storeId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (!includeOutOfStock) query = query.eq("in_stock", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Product[] | null) ?? [];
}

export interface StoreSummary extends Store {
  productCount: number;
}

/** Published stores, newest first, with a product count for the directory. */
export async function fetchPublishedStores(limit = 60): Promise<StoreSummary[]> {
  const { data, error } = await db()
    .from("stores")
    .select(`${STORE_COLUMNS}, products(count)`)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as Array<Store & { products?: Array<{ count: number }> }>).map((row) => {
    const { products, ...store } = row;
    return { ...store, productCount: products?.[0]?.count ?? 0 };
  });
}

export async function fetchMyStores(ownerId: string): Promise<Store[]> {
  const { data, error } = await db()
    .from("stores")
    .select(STORE_COLUMNS)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Store[] | null) ?? [];
}

export async function createStore(ownerId: string, draft: StoreDraft): Promise<Store> {
  const { data, error } = await db()
    .from("stores")
    .insert({
      owner_id: ownerId,
      slug: draft.slug,
      name: draft.name.trim(),
      tagline: emptyToNull(draft.tagline),
      description: emptyToNull(draft.description),
      whatsapp: emptyToNull(draft.whatsapp),
      phone: emptyToNull(draft.phone),
      email: emptyToNull(draft.email),
      instagram: emptyToNull(draft.instagram),
      address: emptyToNull(draft.address),
      currency: draft.currency,
      theme: draft.theme,
      is_published: draft.is_published,
    })
    .select(STORE_COLUMNS)
    .single();
  if (error) throw error;
  return data as Store;
}

export async function updateStore(id: string, draft: StoreDraft): Promise<void> {
  const { error } = await db()
    .from("stores")
    .update({
      name: draft.name.trim(),
      tagline: emptyToNull(draft.tagline),
      description: emptyToNull(draft.description),
      whatsapp: emptyToNull(draft.whatsapp),
      phone: emptyToNull(draft.phone),
      email: emptyToNull(draft.email),
      instagram: emptyToNull(draft.instagram),
      address: emptyToNull(draft.address),
      currency: draft.currency,
      theme: draft.theme,
      is_published: draft.is_published,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function saveProduct(
  storeId: string,
  draft: ProductDraft,
  productId?: string,
): Promise<void> {
  const payload = {
    store_id: storeId,
    title: draft.title.trim(),
    description: emptyToNull(draft.description),
    price: draft.price,
    compare_at_price: draft.compare_at_price,
    image_url: draft.image_url,
    category: emptyToNull(draft.category),
    in_stock: draft.in_stock,
  };
  const supabase = db();
  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("products").insert(payload);
  if (error) throw error;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await db().from("products").delete().eq("id", productId);
  if (error) throw error;
}

export async function deleteStore(storeId: string): Promise<void> {
  const { error } = await db().from("stores").delete().eq("id", storeId);
  if (error) throw error;
}

/** Orders + their line items, newest first. Owner-only (enforced by RLS). */
export async function fetchOrders(storeId: string, limit = 100): Promise<OrderWithItems[]> {
  const supabase = db();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  return ((data ?? []) as Array<Order & { order_items: OrderItem[] | null }>).map((row) => {
    const { order_items, ...order } = row;
    return { ...order, items: order_items ?? [] };
  });
}

export async function setOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await db().from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

export interface OrderResult {
  order_id: string;
  order_code: string;
  subtotal: number;
  currency: string;
}

export async function submitOrder(input: {
  storeId: string;
  lines: CartLine[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  };
}): Promise<OrderResult> {
  const { data, error } = await db().rpc("place_order", {
    p_store: input.storeId,
    p_items: cartPayload(input.lines),
    p_customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email ?? "",
      address: input.customer.address ?? "",
      notes: input.customer.notes ?? "",
    },
  });
  if (error) throw error;
  return data as OrderResult;
}

/* ─────────────────────────── storage ─────────────────────────── */

export const STORE_IMAGE_BUCKET = "store-images";

/** Validates and uploads an image into the owner's folder. Returns its URL. */
export async function uploadStoreImage(
  storeId: string,
  file: File,
): Promise<string> {
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];
  if (!allowed.includes(file.type)) {
    throw new Error("Use a PNG, JPG, WebP, GIF or AVIF image.");
  }
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Keep images under 4 MB.");
  }

  const supabase = db();
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${storeId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "png"}`;
  const { error } = await supabase.storage
    .from(STORE_IMAGE_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(STORE_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* ─────────────────────────── messaging helpers ─────────────────────────── */

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Digits-only phone for wa.me links (assumes +91 when no country code). */
export function waLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const full = digits.length === 10 ? `91${digits}` : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${full}${query}`;
}

/** Prefilled "is this available?" message for the storefront. */
export function enquiryMessage(store: Store, product?: Product): string {
  const about = product ? ` about “${product.title}”` : "";
  return `Hi ${store.name}! I found your store on SlashAI${about}. Could you share the details?`;
}

/** Order summary an owner can send or a customer can forward on WhatsApp. */
export function orderMessage(
  store: Store,
  order: OrderWithItems | OrderResult,
  items: OrderItem[] | CartLine[],
): string {
  const code = "order_code" in order ? order.order_code : "";
  const lines = items.map((item) =>
    "product" in item
      ? `${item.quantity} × ${item.product.title} — ${formatMoney(item.product.price * item.quantity, store.currency)}`
      : `${item.quantity} × ${item.title} — ${formatMoney(item.unit_price * item.quantity, store.currency)}`,
  );
  const subtotal =
    "subtotal" in order ? formatMoney(order.subtotal, store.currency) : "";
  return [
    `Order ${code} — ${store.name}`,
    "",
    ...lines,
    "",
    `Total: ${subtotal}`,
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");
}

export const ORDER_STATUSES: Array<{ id: OrderStatus; label: string }> = [
  { id: "new", label: "New" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];
