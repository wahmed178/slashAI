/**
 * React hooks for Slash Stores.
 *
 * Every hook is safe when the Supabase keys are missing: the Supabase-backed
 * ones resolve with an explanatory error and `SUPABASE_READY === false` so the
 * page can render a setup notice instead of crashing. Nothing here reads or
 * writes SlashAI's localStorage state — store data lives in Postgres.
 */
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import {
  SUPABASE_READY,
  fetchMyStores,
  fetchOrders,
  fetchPublishedStores,
  fetchStoreBySlug,
  fetchStoreProducts,
  friendlyError,
  getSupabase,
  type OrderWithItems,
  type Product,
  type Store,
  type StoreSummary,
} from "@/lib/stores";

export const NOT_CONNECTED =
  "Stores are not connected yet — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";

/* ─────────────────────────── auth ─────────────────────────── */

export interface StoreAuth {
  ready: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export function useStoreAuth(): StoreAuth {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(SUPABASE_READY);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error(NOT_CONNECTED);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw new Error(friendlyError(error));
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error(NOT_CONNECTED);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) throw new Error(friendlyError(error));
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { ready: SUPABASE_READY, loading, user, signIn, signUp, signOut };
}

/* ─────────────────────────── generic loader ─────────────────────────── */

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

/**
 * Runs `load` whenever `key` or the manual `reload()` changes. Deliberately
 * tiny: the store pages need at most a handful of these.
 */
function useAsync<T>(
  initial: T,
  load: () => Promise<T>,
  key: string,
  enabled = true,
): AsyncState<T> & { reload: () => void } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(enabled && SUPABASE_READY);
  const [error, setError] = useState<string | null>(
    SUPABASE_READY ? null : NOT_CONNECTED,
  );
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!SUPABASE_READY || !enabled) {
      setLoading(false);
      setError(SUPABASE_READY ? null : NOT_CONNECTED);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);

    void load()
      .then((result) => {
        if (!active) return;
        setData(result);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(friendlyError(cause));
        setLoading(false);
      });

    return () => {
      active = false;
    };
    // `load` is recreated per render on purpose; `key` + `nonce` drive refetches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce, enabled]);

  return { data, loading, error, reload };
}

/* ─────────────────────────── data ─────────────────────────── */

/** Published stores for the `/stores` directory. */
export function useStoreDirectory() {
  const state = useAsync<StoreSummary[]>(
    [],
    () => fetchPublishedStores(60),
    "store-directory",
  );
  return { stores: state.data, loading: state.loading, error: state.error, reload: state.reload };
}

export interface StorefrontState {
  store: Store | null;
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** A single public storefront: the store row plus its in-stock products. */
export function useStorefront(slug: string): StorefrontState {
  const state = useAsync<{ store: Store | null; products: Product[] }>(
    { store: null, products: [] },
    async () => {
      const store = await fetchStoreBySlug(slug);
      if (!store) throw new Error("That store does not exist.");
      const products = await fetchStoreProducts(store.id, true);
      return { store, products };
    },
    `storefront:${slug}`,
    slug.length > 0,
  );

  return {
    store: state.data.store,
    products: state.data.products,
    loading: state.loading,
    error: state.error,
    reload: state.reload,
  };
}

/** Stores owned by the signed-in user. */
export function useMyStores(ownerId: string | null) {
  const state = useAsync<Store[]>(
    [],
    () => fetchMyStores(ownerId as string),
    `my-stores:${ownerId ?? ""}`,
    Boolean(ownerId),
  );
  return { stores: state.data, loading: state.loading, error: state.error, reload: state.reload };
}

/** Orders for a store the user owns (RLS hides anyone else's). */
export function useStoreOrders(storeId: string | null) {
  const state = useAsync<OrderWithItems[]>(
    [],
    () => fetchOrders(storeId as string),
    `store-orders:${storeId ?? ""}`,
    Boolean(storeId),
  );
  return { orders: state.data, loading: state.loading, error: state.error, reload: state.reload };
}

/** Owner-side product list, including sold-out items. */
export function useStoreProducts(storeId: string | null) {
  const state = useAsync<Product[]>(
    [],
    () => fetchStoreProducts(storeId as string, true),
    `store-products:${storeId ?? ""}`,
    Boolean(storeId),
  );
  return { products: state.data, loading: state.loading, error: state.error, reload: state.reload };
}
