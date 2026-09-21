-- ============================================================================
-- SlashAI Stores — multi-tenant storefront schema
--
-- Paste this whole file into the Supabase SQL editor (Dashboard → SQL Editor →
-- New query → Run). It is idempotent, so re-running it is safe.
--
-- Tenancy model: every row carries store_id. Row Level Security guarantees a
-- store owner can only read/write their own store, and the public can only read
-- published stores. Anonymous visitors never write tables directly — checkout
-- goes through the place_order() RPC, which recomputes prices server-side.
-- ============================================================================

-- gen_random_uuid() is core on PostgreSQL 13+, so pgcrypto is only a safety net
-- for older projects — and some Postgres builds simply do not ship it, so a
-- missing extension must not abort the whole script.
do $$
begin
  create extension if not exists pgcrypto;
  raise notice 'pgcrypto present';
exception when others then
  raise notice 'pgcrypto unavailable — using the built-in gen_random_uuid()';
end
$$;

-- ----------------------------------------------------------------------------
-- Tables
--
-- The helper functions live below the tables on purpose: a `language sql`
-- function body is validated when it is created, so `owns_store()` cannot be
-- defined before `public.stores` exists (Postgres raises 42P01).
-- ----------------------------------------------------------------------------

create table if not exists public.stores (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references auth.users (id) on delete cascade,
  slug         text not null unique
               check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  name         text not null check (char_length(name) between 2 and 80),
  tagline      text,
  description  text,
  logo_url     text,
  whatsapp     text,
  phone        text,
  email        text,
  instagram    text,
  address      text,
  currency     text not null default 'INR',
  theme        text not null default 'graphite'
               check (theme in ('graphite', 'emerald', 'sunset', 'ocean')),
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists stores_owner_idx on public.stores (owner_id);
create index if not exists stores_published_idx
  on public.stores (is_published, created_at desc);

create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  store_id         uuid not null references public.stores (id) on delete cascade,
  title            text not null check (char_length(title) between 1 and 140),
  description      text,
  price            numeric(10, 2) not null default 0 check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price >= 0),
  image_url        text,
  category         text,
  in_stock         boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_store_idx
  on public.products (store_id, sort_order, created_at desc);

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  store_id         uuid not null references public.stores (id) on delete cascade,
  order_code       text not null unique,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  customer_address text,
  notes            text,
  subtotal         numeric(10, 2) not null default 0,
  currency         text not null default 'INR',
  status           text not null default 'new'
                   check (status in ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at       timestamptz not null default now()
);

create index if not exists orders_store_idx
  on public.orders (store_id, created_at desc);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  title      text not null,
  unit_price numeric(10, 2) not null default 0,
  quantity   integer not null check (quantity > 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ----------------------------------------------------------------------------
-- Helpers
-- ----------------------------------------------------------------------------

-- True when the signed-in user owns the given store.
create or replace function public.owns_store(sid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.stores s
    where s.id = sid and s.owner_id = auth.uid()
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Timestamps
-- ----------------------------------------------------------------------------

drop trigger if exists stores_touch on public.stores;
create trigger stores_touch before update on public.stores
  for each row execute function public.touch_updated_at();

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.stores       enable row level security;
alter table public.products     enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;

-- stores ---------------------------------------------------------------------
drop policy if exists "stores public read" on public.stores;
create policy "stores public read" on public.stores
  for select using (is_published or owner_id = auth.uid());

drop policy if exists "stores owner insert" on public.stores;
create policy "stores owner insert" on public.stores
  for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists "stores owner update" on public.stores;
create policy "stores owner update" on public.stores
  for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "stores owner delete" on public.stores;
create policy "stores owner delete" on public.stores
  for delete to authenticated using (owner_id = auth.uid());

-- products -------------------------------------------------------------------
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (
    exists (select 1 from public.stores s where s.id = store_id and s.is_published)
    or public.owns_store(store_id)
  );

drop policy if exists "products owner write" on public.products;
create policy "products owner write" on public.products
  for all to authenticated
  using (public.owns_store(store_id))
  with check (public.owns_store(store_id));

-- orders ---------------------------------------------------------------------
-- Customers never insert here directly; place_order() does it as the definer.
drop policy if exists "orders owner read" on public.orders;
create policy "orders owner read" on public.orders
  for select to authenticated using (public.owns_store(store_id));

drop policy if exists "orders owner update" on public.orders;
create policy "orders owner update" on public.orders
  for update to authenticated
  using (public.owns_store(store_id)) with check (public.owns_store(store_id));

drop policy if exists "order items owner read" on public.order_items;
create policy "order items owner read" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and public.owns_store(o.store_id)
    )
  );

-- ----------------------------------------------------------------------------
-- Checkout RPC — atomic, price-verified, public
-- ----------------------------------------------------------------------------

create or replace function public.place_order(
  p_store uuid,
  p_items jsonb,
  p_customer jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_published boolean;
  v_currency  text;
  v_name      text := nullif(trim(coalesce(p_customer ->> 'name', '')), '');
  v_phone     text := nullif(trim(coalesce(p_customer ->> 'phone', '')), '');
  v_code      text;
  v_order_id  uuid;
  v_subtotal  numeric(10, 2) := 0;
  v_items     integer := 0;
  v_item      record;
begin
  select s.is_published, s.currency into v_published, v_currency
  from public.stores s where s.id = p_store;

  if v_published is null then
    raise exception 'store_not_found' using errcode = 'P0001';
  end if;
  if not v_published then
    raise exception 'store_unavailable' using errcode = 'P0001';
  end if;
  if v_name is null then
    raise exception 'name_required' using errcode = 'P0001';
  end if;
  if v_phone is null or char_length(v_phone) < 6 then
    raise exception 'phone_required' using errcode = 'P0001';
  end if;
  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'cart_empty' using errcode = 'P0001';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'too_many_items' using errcode = 'P0001';
  end if;

  v_code := 'S' || to_char(now(), 'YYMMDD') || '-' ||
            upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4));

  insert into public.orders (
    store_id, order_code, customer_name, customer_phone, customer_email,
    customer_address, notes, subtotal, currency
  ) values (
    p_store, v_code, v_name, v_phone,
    nullif(trim(coalesce(p_customer ->> 'email', '')), ''),
    nullif(trim(coalesce(p_customer ->> 'address', '')), ''),
    nullif(trim(coalesce(p_customer ->> 'notes', '')), ''),
    0, coalesce(v_currency, 'INR')
  ) returning id into v_order_id;

  -- Prices and titles are read from products (never trusted from the client),
  -- and quantities are clamped to 1..99. Both casts are guarded: a malformed
  -- entry is skipped instead of blowing up the whole checkout.
  for v_item in
    select p.id as product_id, p.title, p.price, x.quantity
    from (
      select nullif(i ->> 'product_id', '')::uuid as pid,
             least(greatest(coalesce((i ->> 'quantity')::int, 1), 1), 99) as quantity
      from jsonb_array_elements(p_items) as i
      where coalesce(i ->> 'product_id', '') ~ '^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12}$'
        and coalesce(i ->> 'quantity', '1') ~ '^[0-9]{1,4}$'
    ) x
    join public.products p on p.id = x.pid and p.store_id = p_store
  loop
    insert into public.order_items (order_id, product_id, title, unit_price, quantity)
    values (v_order_id, v_item.product_id, v_item.title, v_item.price, v_item.quantity);

    v_subtotal := v_subtotal + (v_item.price * v_item.quantity);
    v_items := v_items + 1;
  end loop;

  -- A store may legitimately sell something for 0 (free samples, a gift), so
  -- the check is "did anything at all match", not "is the subtotal above 0".
  if v_items = 0 then
    delete from public.orders where id = v_order_id;
    raise exception 'no_valid_items' using errcode = 'P0001';
  end if;

  update public.orders
     set subtotal = v_subtotal,
         currency = coalesce(v_currency, 'INR')
   where id = v_order_id;

  return jsonb_build_object(
    'order_id',   v_order_id,
    'order_code', v_code,
    'subtotal',   v_subtotal,
    'currency',   coalesce(v_currency, 'INR')
  );
end;
$$;

revoke all on function public.place_order(uuid, jsonb, jsonb) from public;
grant execute on function public.place_order(uuid, jsonb, jsonb) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Storage — product images
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('store-images', 'store-images', true)
on conflict (id) do update set public = true;

drop policy if exists "store images public read" on storage.objects;
create policy "store images public read" on storage.objects
  for select using (bucket_id = 'store-images');

drop policy if exists "store images owner write" on storage.objects;
create policy "store images owner write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'store-images'
    and public.owns_store(nullif((storage.foldername(name))[1], '')::uuid)
  );

drop policy if exists "store images owner update" on storage.objects;
create policy "store images owner update" on storage.objects
  for update to authenticated using (
    bucket_id = 'store-images'
    and public.owns_store(nullif((storage.foldername(name))[1], '')::uuid)
  );

drop policy if exists "store images owner delete" on storage.objects;
create policy "store images owner delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'store-images'
    and public.owns_store(nullif((storage.foldername(name))[1], '')::uuid)
  );
