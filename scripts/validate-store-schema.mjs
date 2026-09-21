#!/usr/bin/env node
/**
 * Validates `supabase/schema.sql` without a Supabase project.
 *
 * Runs the real schema against PGlite (Postgres 16 compiled to WASM) inside a
 * minimal Supabase-shaped harness: the `auth` and `storage` schemas, the
 * `anon` / `authenticated` roles, `auth.uid()`, `storage.foldername()` and the
 * grants Supabase applies by default. It then drives the multi-tenant rules
 * directly as each role and fails loudly if any of them stops holding.
 *
 *   bun run stores:validate
 *
 * What it proves:
 *   1. The schema applies cleanly, and re-applies (idempotent).
 *   2. An owner can create a store and products; nobody else can read or
 *      change them.
 *   3. Anonymous shoppers see published stores only.
 *   4. `place_order` verifies prices from the database (a forged client price
 *      is ignored), clamps quantities to 1..99 and rejects junk items.
 *   5. Free (0-price) products and unpublished stores behave sensibly.
 *   6. Orders and their line items are readable by the store owner only.
 *
 * This is a schema test, not a replacement for the live check —
 * `scripts/stores-e2e.mjs` covers a real Supabase project and the running app.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PGlite } from "@electric-sql/pglite";

const here = dirname(fileURLToPath(import.meta.url));
const SCHEMA = readFileSync(resolve(here, "../supabase/schema.sql"), "utf8");

const OWNER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";
const UNKNOWN_STORE = "33333333-3333-4333-8333-333333333333";

let failures = 0;
let checks = 0;

function check(label, condition, detail) {
  checks += 1;
  if (condition) {
    console.log(`  ✓ ${label}`);
    return;
  }
  failures += 1;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function section(title) {
  console.log(`\n${title}`);
}

/* ─────────────────────── Supabase-shaped harness ─────────────────────── */

const HARNESS = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin;

create schema if not exists auth;
create table if not exists auth.users (id uuid primary key, email text);

create or replace function auth.uid() returns uuid
language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create schema if not exists storage;
create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false
);
create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text not null,
  owner uuid
);
create or replace function storage.foldername(name text) returns text[]
language sql immutable as $$ select string_to_array(name, '/'); $$;
`;

/** The grants Supabase's default roles hold, so that policies are what is tested. */
const GRANTS = `
grant usage on schema public, storage, auth to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant all on all tables in schema storage to authenticated;
grant select on all tables in schema storage to anon;
grant execute on all functions in schema public to anon, authenticated;
grant execute on all functions in schema storage to authenticated;
`;

/** The schema itself enables RLS on the four public tables (and Supabase ships
 *  storage.objects with RLS on). PGlite connects as the table owner, so it is
 *  forced too — otherwise the policies would never be exercised here. */
const RLS_SETUP = `
alter table storage.objects     enable row level security;
alter table storage.objects     force  row level security;
alter table public.stores       force  row level security;
alter table public.products     force  row level security;
alter table public.orders       force  row level security;
alter table public.order_items  force  row level security;
`;

let db;

/** Run statements as a role, inside its own transaction. */
async function as(role, sub, statements) {
  const claims = sub ? `select set_config('request.jwt.claim.sub', '${sub}', true);` : "";
  try {
    const results = await db.exec(`begin; set local role ${role}; ${claims} ${statements} commit;`);
    return { ok: true, results: results ?? [] };
  } catch (error) {
    try {
      await db.exec("rollback;");
    } catch {
      /* the transaction is already gone */
    }
    return { ok: false, results: [], error: error instanceof Error ? error.message : String(error) };
  }
}

/** Every row returned by an `as()` call, in statement order. */
function rowsOf(outcome) {
  return outcome.results.flatMap((result) => result.rows ?? []);
}

/** First column of the last row-returning statement. */
function scalar(outcome, key) {
  const rows = rowsOf(outcome);
  return rows.length > 0 ? rows[rows.length - 1][key] : undefined;
}

async function sql(text) {
  const result = await db.query(text);
  return result.rows ?? [];
}

async function refuse(label, outcome, fragment) {
  const text = outcome.error ?? "";
  check(
    label,
    !outcome.ok && (fragment ? text.includes(fragment) : true),
    outcome.ok ? "it was allowed" : `error was "${text}"`,
  );
}

/* ─────────────────────────────── the run ─────────────────────────────── */

async function main() {
  console.log("SlashAI Stores — schema validation (PGlite / Postgres 16)\n");

  db = new PGlite();
  await db.exec(HARNESS);

  section("1. the schema applies (and re-applies) cleanly");
  await db.exec(SCHEMA);
  check("supabase/schema.sql ran without error", true);
  await db.exec(SCHEMA);
  check("running it a second time is a no-op (idempotent)", true);

  await db.exec(GRANTS);
  await db.exec(RLS_SETUP);
  await db.exec(`insert into auth.users (id, email) values
    ('${OWNER}', 'owner@example.com'), ('${OTHER}', 'other@example.com');`);

  const names = (await sql(`select table_name from information_schema.tables where table_schema = 'public';`))
    .map((row) => row.table_name);
  check(
    "all four tables exist",
    ["order_items", "orders", "products", "stores"].every((table) => names.includes(table)),
    names.join(", "),
  );
  check("place_order() exists", (await sql(`select 1 from pg_proc where proname = 'place_order';`)).length === 1);

  section("2. an owner can create a store and fill it");

  const create = await as(
    "authenticated",
    OWNER,
    `insert into public.stores (owner_id, slug, name, tagline, whatsapp, currency, theme)
       values ('${OWNER}', 'test-boutique', 'Test Boutique', 'Handmade things', '9876543210', 'INR', 'emerald');`,
  );
  check("owner inserts a store", create.ok, create.error);

  const storeId = (await sql(`select id from public.stores where slug = 'test-boutique';`))[0]?.id;

  const products = await as(
    "authenticated",
    OWNER,
    `insert into public.products (store_id, title, price, compare_at_price, category, sort_order)
       values
         ('${storeId}', 'Cotton kurti', 1200.00, 1500.00, 'Kurtis', 1),
         ('${storeId}', 'Free sample swatch', 0, null, 'Samples', 2),
         ('${storeId}', 'Silk dupatta', 899.50, null, 'Dupattas', 3);`,
  );
  check("owner adds three products (one free, one discounted)", products.ok, products.error);

  section("3. row level security keeps tenants apart");

  // A published store's catalogue is public by design — an anonymous visitor
  // and a signed-in shopper see exactly the same rows. The real protection is
  // that an unpublished store's catalogue is invisible to everyone else, which
  // section 4 checks.
  const otherSeesPublished = await as(
    "authenticated",
    OTHER,
    `select count(*)::int as n from public.products where store_id = '${storeId}';`,
  );
  check(
    "a second signed-in user reads a published store's catalogue",
    scalar(otherSeesPublished, "n") === 3,
    JSON.stringify(rowsOf(otherSeesPublished)),
  );

  const otherUpdate = await as(
    "authenticated",
    OTHER,
    `update public.stores set name = 'Hijacked' where id = '${storeId}';`,
  );
  check("a second signed-in user cannot rename the store", otherUpdate.ok);
  check(
    "the store keeps its own name",
    (await sql(`select name from public.stores where id = '${storeId}';`))[0]?.name === "Test Boutique",
  );

  const otherDelete = await as(
    "authenticated",
    OTHER,
    `delete from public.stores where id = '${storeId}';`,
  );
  check("a second signed-in user cannot delete the store", otherDelete.ok);
  check("the store still exists", (await sql(`select count(*)::int as n from public.stores;`))[0].n === 1);

  await refuse(
    "a user cannot create a store owned by somebody else",
    await as(
      "authenticated",
      OTHER,
      `insert into public.stores (owner_id, slug, name) values ('${OWNER}', 'stolen-store', 'Stolen');`,
    ),
    "row-level security",
  );

  section("4. what an anonymous shopper sees");

  await db.exec(`insert into public.stores (owner_id, slug, name, is_published)
    values ('${OTHER}', 'draft-store', 'Draft Store', false);`);
  const draftId = (await sql(`select id from public.stores where slug = 'draft-store';`))[0].id;
  await as(
    "authenticated",
    OTHER,
    `insert into public.products (store_id, title, price) values ('${draftId}', 'Unreleased item', 499);`,
  );

  const otherSeesDraft = await as(
    "authenticated",
    OTHER, // the draft store's own owner would see it; use a third-party view below
    `select count(*)::int as n from public.products where store_id = '${draftId}';`,
  );
  check("the draft store's owner sees their own draft products", scalar(otherSeesDraft, "n") === 1);

  const anonRead = await as("anon", null, `select slug from public.stores order by slug;`);
  const visible = rowsOf(anonRead).map((row) => row.slug);
  check(
    "anon sees published stores only",
    visible.includes("test-boutique") && !visible.includes("draft-store"),
    visible.join(", "),
  );

  const anonDraft = await as(
    "anon",
    null,
    `select count(*)::int as n from public.products where store_id = '${draftId}';`,
  );
  check("anon cannot see an unpublished store's products", scalar(anonDraft, "n") === 0);

  const otherDraft = await as(
    "authenticated",
    OWNER,
    `select count(*)::int as n from public.products where store_id = '${draftId}';`,
  );
  check(
    "another signed-in user cannot see an unpublished store's products either",
    scalar(otherDraft, "n") === 0,
  );

  const anonProducts = await as(
    "anon",
    null,
    `select count(*)::int as n from public.products where store_id = '${storeId}';`,
  );
  check(
    "anon reads the published store's products",
    scalar(anonProducts, "n") === 3,
    JSON.stringify(anonProducts.error ?? rowsOf(anonProducts)),
  );

  await refuse(
    "anon cannot create a store",
    await as("anon", null, `insert into public.stores (owner_id, slug, name) values ('${OWNER}', 'sneaky', 'Nope');`),
  );

  const anonOrders = await as("anon", null, `select count(*)::int as n from public.orders;`);
  check("anon cannot read orders", scalar(anonOrders, "n") === 0, anonOrders.error);

  await refuse(
    "anon cannot insert orders directly",
    await as(
      "anon",
      null,
      `insert into public.orders (store_id, order_code, customer_name, customer_phone)
         values ('${storeId}', 'HACK-1', 'Mallory', '9999999999');`,
    ),
  );

  section("5. checkout through place_order()");

  /** Orders that should exist once the checks below have run. */
  let placedOrders = 0;

  const paid = (await sql(`select id, price from public.products
    where store_id = '${storeId}' and price > 0 order by price desc;`))[0];
  const freeId = (await sql(`select id from public.products
    where store_id = '${storeId}' and price = 0;`))[0].id;

  const order = await as(
    "anon",
    null,
    `select public.place_order(
       '${storeId}',
       '[{"product_id":"${paid.id}","quantity":2,"price":1,"unit_price":1,"title":"HACKED"}]'::jsonb,
       '{"name":"  Ayesha  ","phone":"98765 43210","email":"a@example.com","address":"Hyderabad","notes":"gift wrap"}'::jsonb
     ) as result;`,
  );
  const placed = scalar(order, "result");
  if (order.ok) placedOrders += 1;
  check("anon can place an order", order.ok, order.error);
  check(
    "the total comes from the database, not the client (2 × 1200)",
    Number(placed?.subtotal) === 2400,
    JSON.stringify(placed),
  );
  check("an order code is returned", /^S\d{6}-[0-9A-F]{4}$/.test(placed?.order_code ?? ""), placed?.order_code);

  const line = (await sql(`select title, unit_price, quantity from public.order_items
    where order_id = '${placed?.order_id}';`))[0];
  check(
    "the line item uses the product's own title and price",
    line?.title === "Cotton kurti" && Number(line?.unit_price) === 1200 && line?.quantity === 2,
    JSON.stringify(line),
  );

  const stored = (await sql(`select customer_name, customer_phone, status, subtotal, currency from public.orders
    where id = '${placed?.order_id}';`))[0];
  check(
    "customer details are trimmed, the order starts as new, currency is the store's",
    stored?.customer_name === "Ayesha" && stored?.status === "new" && stored?.currency === "INR",
    JSON.stringify(stored),
  );

  const clamped = await as(
    "anon",
    null,
    `select public.place_order('${storeId}', '[{"product_id":"${paid.id}","quantity":500}]'::jsonb,
       '{"name":"Bulk","phone":"9876543210"}'::jsonb) as result;`,
  );
  if (clamped.ok) placedOrders += 1;
  const clampedId = scalar(clamped, "result")?.order_id;
  const clampedLine = (await sql(`select quantity from public.order_items where order_id = '${clampedId}';`))[0];
  check("an absurd quantity is clamped to 99", clampedLine?.quantity === 99, JSON.stringify(clampedLine));

  const free = await as(
    "anon",
    null,
    `select public.place_order('${storeId}', '[{"product_id":"${freeId}","quantity":1}]'::jsonb,
       '{"name":"Freebie","phone":"9876543210"}'::jsonb) as result;`,
  );
  if (free.ok) placedOrders += 1;
  check(
    "a 0-price product can still be ordered",
    free.ok && Number(scalar(free, "result")?.subtotal) === 0,
    free.error ?? JSON.stringify(scalar(free, "result")),
  );

  const junk = await as(
    "anon",
    null,
    `select public.place_order('${storeId}', '[{"product_id":"not-a-uuid","quantity":"abc"}]'::jsonb,
       '{"name":"X","phone":"9876543210"}'::jsonb);`,
  );
  await refuse("junk cart entries are rejected without a database error", junk, "no_valid_items");
  check(
    "no order row was left behind by the failed attempts",
    (await sql(`select count(*)::int as n from public.orders;`))[0].n === placedOrders,
  );

  await refuse(
    "a missing phone number is rejected",
    await as(
      "anon",
      null,
      `select public.place_order('${storeId}', '[{"product_id":"${paid.id}","quantity":1}]'::jsonb, '{"name":"No Phone"}'::jsonb);`,
    ),
    "phone_required",
  );

  await refuse(
    "an empty cart is rejected",
    await as(
      "anon",
      null,
      `select public.place_order('${storeId}', '[]'::jsonb, '{"name":"X","phone":"9876543210"}'::jsonb);`,
    ),
    "cart_empty",
  );

  await refuse(
    "a non-array cart is rejected",
    await as(
      "anon",
      null,
      `select public.place_order('${storeId}', '{"product_id":"x"}'::jsonb, '{"name":"X","phone":"9876543210"}'::jsonb);`,
    ),
    "cart_empty",
  );

  await refuse(
    "an unknown store is rejected",
    await as(
      "anon",
      null,
      `select public.place_order('${UNKNOWN_STORE}', '[{"product_id":"${paid.id}","quantity":1}]'::jsonb, '{"name":"X","phone":"9876543210"}'::jsonb);`,
    ),
    "store_not_found",
  );

  await refuse(
    "an unpublished store is rejected",
    await as(
      "anon",
      null,
      `select public.place_order('${draftId}', '[{"product_id":"${paid.id}","quantity":1}]'::jsonb, '{"name":"X","phone":"9876543210"}'::jsonb);`,
    ),
    "store_unavailable",
  );

  // A real cross-tenant attempt: order on the published store but name a
  // product that belongs to a different store. It must not be added.
  const draftProduct = (await sql(`select id from public.products where store_id = '${draftId}';`))[0].id;
  await refuse(
    "a product from another store cannot be smuggled into an order",
    await as(
      "anon",
      null,
      `select public.place_order('${storeId}', '[{"product_id":"${draftProduct}","quantity":1}]'::jsonb, '{"name":"X","phone":"9876543210"}'::jsonb);`,
    ),
    "no_valid_items",
  );
  const mixed = await as(
    "anon",
    null,
    `select public.place_order('${storeId}',
       '[{"product_id":"${draftProduct}","quantity":9},{"product_id":"${paid.id}","quantity":1}]'::jsonb,
       '{"name":"Mixed","phone":"9876543210"}'::jsonb) as result;`,
  );
  if (mixed.ok) placedOrders += 1;
  check(
    "mixing one valid item with a foreign one only keeps the valid one",
    Number(scalar(mixed, "result")?.subtotal) === 1200,
    JSON.stringify(scalar(mixed, "result")),
  );
  check(
    "the foreign line never reached order_items",
    (await sql(`select count(*)::int as n from public.order_items
      where order_id = '${scalar(mixed, "result")?.order_id}';`))[0].n === 1,
  );

  section("6. only the owner sees the orders");

  const ownerOrders = await as(
    "authenticated",
    OWNER,
    `select count(*)::int as n from public.orders where store_id = '${storeId}';`,
  );
  check(
    "the owner sees their orders",
    scalar(ownerOrders, "n") === placedOrders,
    JSON.stringify(ownerOrders.error ?? rowsOf(ownerOrders)),
  );

  const ownerItems = await as("authenticated", OWNER, `select count(*)::int as n from public.order_items;`);
  check(
    "the owner sees the line items",
    scalar(ownerItems, "n") === placedOrders,
    JSON.stringify(ownerItems.error ?? rowsOf(ownerItems)),
  );

  const otherOrders = await as(
    "authenticated",
    OTHER,
    `select count(*)::int as n from public.orders where store_id = '${storeId}';`,
  );
  check("another owner sees none of them", scalar(otherOrders, "n") === 0, JSON.stringify(rowsOf(otherOrders)));

  const ownerStatus = await as(
    "authenticated",
    OWNER,
    `update public.orders set status = 'shipped' where id = '${placed?.order_id}';`,
  );
  check("the owner can move an order along", ownerStatus.ok, ownerStatus.error);

  await as("authenticated", OTHER, `update public.orders set status = 'cancelled' where id = '${placed?.order_id}';`);
  check(
    "an outsider cannot change that status",
    (await sql(`select status from public.orders where id = '${placed?.order_id}';`))[0]?.status === "shipped",
  );

  section("7. store address rules");

  await refuse(
    "a duplicate address is refused",
    await as(
      "authenticated",
      OWNER,
      `insert into public.stores (owner_id, slug, name) values ('${OWNER}', 'test-boutique', 'Clone');`,
    ),
    "duplicate key",
  );

  for (const bad of ["ab", "With Spaces", "UPPER", "-leading", "trailing-"]) {
    await refuse(
      `the address "${bad}" is refused`,
      await as(
        "authenticated",
        OWNER,
        `insert into public.stores (owner_id, slug, name) values ('${OWNER}', '${bad}', 'Bad');`,
      ),
    );
  }

  section("8. product images");

  check(
    "the store-images bucket is public",
    (await sql(`select public from storage.buckets where id = 'store-images';`))[0]?.public === true,
  );

  const upload = await as(
    "authenticated",
    OWNER,
    `insert into storage.objects (bucket_id, name) values ('store-images', '${storeId}/p1.png');`,
  );
  check("the owner can upload into their own folder", upload.ok, upload.error);

  await refuse(
    "another owner cannot upload into someone else's folder",
    await as(
      "authenticated",
      OTHER,
      `insert into storage.objects (bucket_id, name) values ('store-images', '${storeId}/hack.png');`,
    ),
    "row-level security",
  );

  console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${checks - failures}/${checks} checks passed\n`);
  await db.close();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error("\nThe harness itself blew up:\n", error?.message ?? error);
  try {
    await db?.close();
  } catch {
    /* nothing to clean up */
  }
  process.exit(1);
});
