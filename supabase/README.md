# SlashAI Stores — Supabase + subdomain setup

SlashAI Stores turns this app into a multi-tenant store host: anybody can sign
in, create a store, add products and take orders — each store on its own
subdomain. Shoppers never need an account.

Everything in this folder and in `src/lib/stores.ts`, `src/components/stores/*`
and the `/stores/*` routes is the implementation. This file is the checklist to
switch it on.

---

## 1. Create the Supabase project

1. Go to <https://supabase.com/dashboard> and create a project (the free tier is
   enough — this uses Postgres, Auth and Storage only).
2. Copy **Project URL** and **anon public key** from
   *Project Settings → API*.

## 2. Add the keys to the environment

In **Settings → Environment** (or `.env.local` for local work) add:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the `anon public` key |
| `VITE_STORES_ROOT_DOMAIN` | optional, defaults to `slashai.in` |

The anon key is a **publishable** key — it is meant to be visible in the
browser. All protection comes from Row Level Security in the schema below.
Never put the `service_role` key in this app.

Until both keys exist, `/stores` and `/stores/dashboard` show a setup notice and
the rest of SlashAI behaves exactly as before (no backend, no accounts).

## 3. Run the schema

Open **SQL Editor → New query**, paste all of `supabase/schema.sql`, and run it.
It is idempotent — running it again after an update is safe.

That script creates:

- `stores`, `products`, `orders`, `order_items`
- Row Level Security: the public can read **published** stores and their
  products; an owner can read/write only their own rows; order rows are
  readable only by the store owner
- `place_order(store, items, customer)` — the public checkout RPC. It is
  `security definer`, so anonymous shoppers can place an order without any
  direct table access, and it **recomputes every price from the products
  table** (client prices are ignored) and clamps quantities to 1–99
- a public `store-images` Storage bucket with per-owner write policies keyed on
  the `<store_id>/` folder prefix

## 4. Auth settings

- *Authentication → Providers → Email*: keep it on. Email confirmations are
  recommended for real users (sign-ups then land on a "confirm your email"
  screen). **For a quick first test, turn *Confirm email* off** — otherwise you
  must click a link in an inbox before a store can be created. Turn it back on
  before sharing the link with real shop owners.
- *Authentication → URL configuration*: set the site URL to `https://slashai.in`
  and add `https://slashai.in/**` plus `http://localhost:5173/**` to the
  redirect allow-list.
- Turn on the email rate limit if you expect spam sign-ups; the app already
  surfaces "too many attempts" gracefully.
- Nobody gets a store until they sign up, and a store account can only ever
  touch its own data — so it is safe to hand a subdomain to a friend or a
  client: they sign in with their own email and own their store.

## 5. Wildcard subdomain (`*.slashai.in`)

Stores work at `https://slashai.in/stores/<slug>` with no DNS work at all. The
pretty address — `https://<slug>.slashai.in` — needs two steps:

1. **Vercel** → Project → *Settings → Domains* → add `*.slashai.in`
   (Vercel asks for a CNAME; a wildcard `CNAME * → cname.vercel-dns.com` is
   generated for you).
2. **Your DNS provider** (wherever `slashai.in` is managed) → add:

   | Type | Name | Value |
   | --- | --- | --- |
   | `CNAME` | `*` | `cname.vercel-dns.com` |

   If a wildcard `CNAME` conflicts with existing records for `www`, `mail` or
   similar, add explicit records for those first — a wildcard never overrides a
   more specific record.

`vercel.json` already sends `Strict-Transport-Security` with `includeSubDomains`,
so every store gets HTTPS automatically through Vercel's certificate.

Once DNS resolves, the app serves the store directly on the bare host:
`src/components/stores/StoreHostGate.tsx` reads `window.location.host`, and when
it matches `<slug>.<VITE_STORES_ROOT_DOMAIN>` it renders that storefront
standalone (own header, no SlashAI bottom dock) instead of the app shell. Every
other host — including `slashai.in` and `www.slashai.in` — is untouched, and all
existing routes keep working.

Reserved subdomains (`www`, `api`, `app`, `mail`, `dashboard`, …) are listed in
`RESERVED_SLUGS` (`src/lib/stores.ts`) and cannot be claimed as a store address.

## 6. Verify it

Two checks ship with the repo:

```sh
bun run stores:validate   # schema, RLS and checkout — no Supabase needed
bun run stores:e2e        # the real thing: creates a demo store, opens it
```

`stores:validate` runs `supabase/schema.sql` inside an in-process Postgres
(PGlite) with a Supabase-shaped `auth`/`storage` harness, then drives every
rule: tenant isolation, published-only reads, price verification, quantity
clamping, free products, address validation and the image-folder policies.
Run it after any change to the schema — it needs no keys and no network.

`stores:e2e` uses the app's own code (`src/lib/stores.ts`) against the configured
project: it signs in, creates a store, adds products, places an order as a
signed-out shopper, loads the storefront URL over HTTP and confirms the owner
sees the order. It prints the storefront link and keeps the demo store (pass
`-- --cleanup` to delete it).

Manual check, once the keys are in:

1. Open `/stores/dashboard`, create an account, create a store.
2. Add a product, then open `/stores/<slug>` — it should appear.
3. Add it to the cart and place an order with just a name and a phone number.
4. Back in the dashboard, the order is there; move it to *Confirmed*.

## 7. What an owner can do

`/stores/dashboard`:

- create a store (name + web address + WhatsApp + currency + look); the slug is
  validated against the same rule as the database `CHECK` constraint
- add products with photo, price, "was" price, category and stock; photos are
  uploaded to `store-images/<store_id>/`
- see every order with the customer's name, phone, address, notes and items,
  move it through New → Confirmed → Shipped → Delivered / Cancelled, and reply
  on WhatsApp with one tap (prefilled with the order code)

## 8. What a shopper sees

`/stores/<slug>` (or `<slug>.slashai.in`):

- branded hero, products, one-tap WhatsApp / call / Instagram / email
- a cart that survives a refresh (localStorage, per store)
- a checkout form that needs only a name and phone
- an order code on success, plus "Send the order on WhatsApp" so the
  conversation can continue where the store already works

No shopper account, no card details, no commission — the store keeps the money
and SlashAI never touches it.

---

## Security notes

- `place_order` is the only anonymous write path, and it validates the store is
  published, requires a name and a phone number, caps the cart at 50 lines and
  ignores client-supplied prices entirely.
- Storage writes are limited to a folder named after a store the caller owns.
- The dashboard is `noindex`; store pages are indexable.
- Re-running the schema never drops data: every statement is `create ... if not
  exists`, `drop policy if exists` or `create or replace`.
