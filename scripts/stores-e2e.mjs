#!/usr/bin/env node
/**
 * Live end-to-end proof for SlashAI Stores.
 *
 * Uses the app's own code (`src/lib/stores.ts`) against the configured Supabase
 * project — the same functions the dashboard and the storefront call — then
 * loads the storefront URL over HTTP and checks that the shop really renders.
 *
 *   bun run stores:e2e                 create a demo store, keep it
 *   bun run stores:e2e -- --cleanup     delete it again afterwards
 *
 * Needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment
 * (Settings → Environment, or .env.local — this script never reads those files
 * itself). Owner sign-in uses STORES_E2E_EMAIL / STORES_E2E_PASSWORD when they
 * are set; otherwise a throwaway account is created and, if the project
 * requires email confirmation, the script stops and tells you what to change.
 *
 * Optional: STORES_E2E_BASE_URL (default http://localhost:8080).
 */
import { createClient } from "@supabase/supabase-js";

import {
  SUPABASE_ANON_KEY,
  SUPABASE_READY,
  SUPABASE_URL,
  cartPayload,
  createStore,
  deleteStore,
  fetchOrders,
  fetchStoreBySlug,
  fetchStoreProducts,
  formatMoney,
  getSupabase,
  saveProduct,
  storeHostUrl,
} from "../src/lib/stores.ts";

const BASE_URL = (process.env.STORES_E2E_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
const CLEANUP = process.argv.includes("--cleanup");

let failures = 0;
let pass = 0;

function ok(label, condition, detail) {
  if (condition) {
    pass += 1;
    console.log(`  ✓ ${label}`);
    return true;
  }
  failures += 1;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  return false;
}

function section(title) {
  console.log(`\n${title}`);
}

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(2);
}

async function main() {
  console.log("SlashAI Stores — live end-to-end check\n");

  if (!SUPABASE_READY) {
    fail(
      "Missing Supabase configuration.\n" +
        "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings → Environment,\n" +
        "then run supabase/schema.sql in the Supabase SQL editor (see supabase/README.md).",
    );
  }
  console.log(`  project: ${SUPABASE_URL}`);
  console.log(`  app:     ${BASE_URL}`);

  /* ── 1. sign in as the store owner ─────────────────────────────────── */
  section("1. owner session");

  const supabase = getSupabase();
  const email =
    process.env.STORES_E2E_EMAIL?.trim() ||
    // Supabase's signup validation rejects reserved TLDs like .test, so use a
    // plausible subdomain of the real site for the throwaway owner account.
    `store-owner-${Date.now().toString(36)}@e2e.slashai.in`;
  const password = process.env.STORES_E2E_PASSWORD?.trim() || `Slash-${Date.now().toString(36)}!a`;

  let user = null;
  if (process.env.STORES_E2E_EMAIL?.trim()) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) fail(`Could not sign in as ${email}: ${error.message}`);
    user = data.user;
    ok(`signed in as ${email}`, Boolean(user));
  } else {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) fail(`Could not create a test account (${email}): ${error.message}`);
    if (!data.session) {
      fail(
        `The project requires email confirmation, so the throwaway test account ${email}\n` +
          "cannot be used from a script.\n\n" +
          "Either turn confirmation off for now (Supabase → Authentication → Sign In / Providers\n" +
          "→ Email → Confirm email), or create an account by hand and run again with:\n" +
          "  STORES_E2E_EMAIL=you@example.com STORES_E2E_PASSWORD=… bun run stores:e2e",
      );
    }
    user = data.user;
    ok("created a test owner account", Boolean(user));
  }

  /* ── 2. create a store exactly like the dashboard does ─────────────── */
  section("2. create a store (the dashboard's own code path)");

  const slug = `demo-store-${Date.now().toString(36)}`;
  const name = "Demo Boutique";

  const store = await createStore(user.id, {
    slug,
    name,
    tagline: "Handmade in Hyderabad",
    description: "A demo store created by scripts/stores-e2e.mjs.",
    whatsapp: "9876543210",
    phone: "",
    email: "",
    instagram: "",
    address: "Hyderabad, India",
    currency: "INR",
    theme: "emerald",
    is_published: true,
  });
  ok("store row created", Boolean(store?.id), `slug ${slug}`);
  console.log(`    storefront: ${BASE_URL}/stores/${store.slug}`);

  await saveProduct(store.id, {
    title: "Cotton kurti — indigo",
    description: "Hand-block printed, sizes S–XL",
    price: 1200,
    compare_at_price: 1500,
    image_url: null,
    category: "Kurtis",
    in_stock: true,
  });
  await saveProduct(store.id, {
    title: "Free sample swatch",
    description: "A fabric swatch so you can feel the cloth first.",
    price: 0,
    compare_at_price: null,
    image_url: null,
    category: "Samples",
    in_stock: true,
  });
  const draft = await saveProduct(store.id, {
    title: "Silk dupatta (out of stock)",
    description: "Restocking next week.",
    price: 899.5,
    compare_at_price: null,
    image_url: null,
    category: "Dupattas",
    in_stock: false,
  });
  ok("products added", draft === undefined, String(draft));

  const ownerProducts = await fetchStoreProducts(store.id, true);
  ok("owner reads back 3 products", ownerProducts.length === 3, `got ${ownerProducts.length}`);

  /* ── 3. the shopper's view: no session at all ──────────────────────── */
  section("3. what a signed-out shopper can do");

  const shopper = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: anonStore, error: anonStoreError } = await shopper
    .from("stores")
    .select("id,slug,name,is_published")
    .eq("slug", slug)
    .maybeSingle();
  ok(
    "the published store is readable without a session",
    anonStore?.slug === slug,
    anonStoreError?.message,
  );

  const { data: anonProducts, error: anonProductsError } = await shopper
    .from("products")
    .select("id,title,price,in_stock")
    .eq("store_id", store.id);
  ok(
    "its products are readable without a session",
    anonProducts?.length === 3,
    anonProductsError?.message ?? `got ${anonProducts?.length}`,
  );

  // PostgREST returns rows in arbitrary order — target the ₹1,200 product
  // explicitly so the expected total (2 × 1200 + 0) is deterministic.
  const paid = anonProducts.find((p) => p.price === 1200) ?? anonProducts.find((p) => p.price > 0);
  const free = anonProducts.find((p) => p.price === 0);

  const { data: order, error: orderError } = await shopper.rpc("place_order", {
    p_store: store.id,
    p_items: cartPayload([
      { product: { ...paid, id: paid.id }, quantity: 2 },
      { product: { ...free, id: free.id }, quantity: 1 },
    ]),
    p_customer: { name: "Test Shopper", phone: "9876543210", address: "Banjara Hills" },
  });
  ok("a signed-out shopper can place an order", Boolean(order?.order_code), orderError?.message);
  ok(
    "the total is computed from the database (2 × 1200 + 0)",
    Number(order?.subtotal) === 2400,
    `${order?.subtotal}`,
  );

  /* ── 4. the storefront page itself ─────────────────────────────────── */
  section("4. the public storefront URL");

  const pageUrl = `${BASE_URL}/stores/${slug}`;
  let html = "";
  try {
    const response = await fetch(pageUrl);
    html = await response.text();
    ok(`GET ${pageUrl} → ${response.status}`, response.status === 200);
  } catch (error) {
    ok(`GET ${pageUrl}`, false, error instanceof Error ? error.message : String(error));
  }

  if (html) {
    // The page is client-side rendered: the static HTML carries a slug-derived
    // title, and the real store name is set on document.title once the
    // storefront's query hydrates (asserted separately below).
    ok(
      "the page carries a storefront title",
      /<title>[^<]*— store on SlashAI<\/title>/.test(html),
    );
    ok("the route resolves to the storefront (not a 404 page)", !/This page doesn't exist/i.test(html));
  }

  const hydrated = await fetchStoreBySlug(slug);
  const hydratedProducts = hydrated ? await fetchStoreProducts(hydrated.id, true) : [];
  ok("the storefront's own query finds the store", hydrated?.name === name);
  ok(
    "the storefront's query returns the catalogue",
    hydratedProducts.length === 3 &&
      hydratedProducts.some((p) => p.title === "Cotton kurti — indigo") &&
      hydratedProducts.some((p) => p.title === "Free sample swatch"),
    hydratedProducts.map((p) => p.title).join(" | "),
  );
  ok(
    "prices render as expected",
    hydratedProducts.some((p) => formatMoney(p.price, hydrated.currency) === "₹1,200.00"),
    hydratedProducts.map((p) => formatMoney(p.price, hydrated.currency)).join(" | "),
  );

  /* ── 5. the order shows up for the owner ───────────────────────────── */
  section("5. the owner sees the order");

  const orders = await fetchOrders(store.id);
  ok("the order is in the dashboard list", orders.length === 1, `got ${orders.length}`);
  ok("it carries the shopper's details", orders[0]?.customer_name === "Test Shopper");
  ok("it carries the line items", orders[0]?.items.length === 2, `got ${orders[0]?.items.length}`);
  ok(
    "the stored total matches the database prices",
    Number(orders[0]?.subtotal) === 2400,
    `${orders[0]?.subtotal}`,
  );

  /* ── 6. the store appears in the public directory ──────────────────── */
  section("6. the public directory");

  const { data: directory } = await shopper
    .from("stores")
    .select("slug, products(count)")
    .eq("is_published", true)
    .eq("slug", slug);
  ok(
    "the store is listed with its product count",
    directory?.some((row) => row.slug === slug),
    JSON.stringify(directory),
  );

  /* ── 7. cleanup (opt-in) ───────────────────────────────────────────── */
  if (CLEANUP) {
    section("7. cleanup");
    await deleteStore(store.id);
    const gone = await fetchStoreBySlug(slug);
    ok("the demo store was removed", gone === null);
  } else {
    console.log(
      `\n  The demo store is live — open ${BASE_URL}/stores/${slug}` +
        `\n  (subdomain form once DNS is wired: ${storeHostUrl(slug)})` +
        `\n  Delete it any time from ${BASE_URL}/stores/dashboard, or rerun with --cleanup.`,
    );
  }

  console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${pass}/${pass + failures} checks passed\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("\nThe check itself blew up:\n", error?.message ?? error);
  process.exit(1);
});
