import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type MetaDescriptor,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type JSX, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/error-reporting";
import { registerServiceWorker } from "../lib/register-sw";
import {
  installChunkErrorRecovery,
  installBfcacheRecovery,
  isChunkLoadError,
  recoveredThisSession,
  hardReloadFresh,
  setupServiceWorkerUpdates,
} from "../lib/app-update";
import { LibraryProvider } from "@/hooks/use-library";
import { StoreHostGate } from "@/components/stores/StoreHostGate";
import { KeyboardShortcutsProvider } from "@/lib/keyboard-shortcuts.tsx";
import { Toaster } from "@/components/ui/sonner";
import { WhatsNewDialog } from "@/components/library/WhatsNewDialog";
import { WelcomeTour } from "@/components/library/WelcomeTour";
import { CoffeeNudge } from "@/components/library/CoffeeNudge";
import {
  SITE_URL,
  SITE_NAME,
  OG_IMAGE,
  canonicalUrl,
  seoForPath,
  websiteJsonLd,
  organizationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="max-w-md text-center">
        <p className="font-mono text-[64px] font-bold leading-none text-primary sm:text-[80px]">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">This page doesn't exist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be old or mistyped. Everything else is still here - try one of these instead.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
          <Link
            to="/explore"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Browse commands
          </Link>
          <Link
            to="/tools"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Open SlashKits
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Tip: press <kbd className="rounded border border-border bg-surface px-1 font-mono">/</kbd> anywhere in SlashAI to search.
        </p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  const stale = isChunkLoadError(error?.message ?? "");

  useEffect(() => {
    if (!recoveredThisSession()) {
      // Stale bundle: hard-reload immediately (no user action needed).
      if (stale) {
        void hardReloadFresh();
        return;
      }
      // Non-stale first error: still try one hard reload on mobile/WebView
      // where the true cause is often a stale asset that throws a generic error.
      if (typeof navigator !== "undefined" && /mobile|webview|iphone|ipad|android/i.test(navigator.userAgent)) {
        void hardReloadFresh();
        return;
      }
    }
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error, stale]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {stale
            ? "The app updated in the background and this cached copy is out of date."
            : "Something went wrong. Try refreshing — if it keeps happening, head back home."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              if (stale) {
                void hardReloadFresh();
                return;
              }
              // On any error, always try a hard reload first (clears stale assets).
              if (!recoveredThisSession()) {
                void hardReloadFresh();
                return;
              }
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /**
   * Re-runs for every navigation (SSR + client) via executeHead, so canonical
   * URLs, Open Graph / Twitter metadata and JSON-LD stay in sync with the
   * active page. Per-page titles/descriptions from child routes keep winning
   * (deepest match wins in buildTagsFromMatches); the registry here only
   * fills pages whose route has no head() of its own.
   */
  head: ({ matches }) => {
    const deepest = matches[matches.length - 1];
    const pathname = deepest?.pathname ?? "/";
    const seo = seoForPath(pathname);

    const meta: Array<MetaDescriptor> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: seo.title },
      { name: "description", content: seo.description },
      { name: "author", content: SITE_NAME },
      // Open Graph
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl(pathname) },
      { property: "og:image", content: `${SITE_URL}${OG_IMAGE}` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE_NAME} - free AI commands, tools and games` },
      // Twitter/X card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
      { name: "twitter:image", content: `${SITE_URL}${OG_IMAGE}` },
      { name: "theme-color", content: "#12161c" },
    ];

    // Google Search Console / webmaster verification: set VITE_GSC_VERIFICATION
    // (the content value of the meta tag, not the whole tag) in the hosting
    // environment and it is emitted on every page. Empty = no tag.
    const gsc = import.meta.env["VITE_GSC_VERIFICATION"] as string | undefined;
    if (gsc) meta.push({ name: "google-site-verification", content: gsc });

    if (seo.noindex) {
      meta.push({ name: "robots", content: "noindex, nofollow" });
    }

    const ld: Array<Record<string, unknown>> = [websiteJsonLd(), organizationJsonLd()];
    const crumb = breadcrumbJsonLd(pathname);
    if (crumb) ld.push(crumb);
    const faq = faqJsonLd(pathname);
    if (faq) ld.push(faq);

    // headContentUtils.js handles "script:ld+json" entries at runtime, but the
    // public head() meta type still lags behind (React meta props only) — cast.
    return {
      meta: [...meta, ...ld.map((json) => ({ "script:ld+json": json }))] as unknown as Array<
        JSX.IntrinsicElements["meta"] | undefined
      >,
      links: [
        // Canonical: https, no query/hash, no trailing slash (except root).
        // Must live in links (not meta) — this TanStack version renders
        // tag/attr-style meta entries as broken <meta> tags, and links from
        // child matches are not key-deduped, so only the root emits it.
        { rel: "canonical", href: canonicalUrl(pathname) },
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon.png" },
        { rel: "manifest", href: "/manifest.webmanifest" },
        // Preconnect + async font CSS: the stylesheet itself stays
        // render-blocking by necessity, but Google Fonts' own stylesheet is
        // made async via the media-swap trick, so first paint never waits
        // on the font CDN.
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          // Optimised font request: Outfit covers every weight the UI uses
          // (400..800); Space Grotesk was previously loaded but is only a
          // fallback name in --font-sans and never renders, so it is removed.
          // display=swap avoids invisible text; preconnects above hide the
          // connection cost.
          href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Module scope: install the stale-bundle recovery listeners before the router
// starts lazy-loading route chunks - the crash can happen during first render.
if (typeof window !== "undefined") {
  installChunkErrorRecovery();
  installBfcacheRecovery();
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* FOUC prevention: apply theme before any paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t='brutal';try{var s=JSON.parse(localStorage.getItem('slashai.settings')||'{}');if(s&&typeof s.theme==='string')t=s.theme}catch(e){}if(t==='light'){document.documentElement.classList.add('light')}else if(t==='amoled'){document.documentElement.classList.add('amoled')}else if(t==='glass'){document.documentElement.classList.add('glass')}else if(t==='brutal'){document.documentElement.classList.add('brutal')}}catch(e){}`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // First-visit welcome tour: renders only after hydration on the client,
  // so SSR HTML (and everything crawlers see) is never affected.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    registerServiceWorker();
    setupServiceWorkerUpdates();
  }, []);

  // Scroll to top on every route change
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      window.scrollTo(0, 0);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <LibraryProvider>
        <KeyboardShortcutsProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes.
              StoreHostGate serves a storefront instead when the host is <slug>.slashai.in. */}
        <StoreHostGate>
          <Outlet />
        </StoreHostGate>
        {mounted ? <WelcomeTour /> : null}
        {mounted ? <CoffeeNudge /> : null}
        <WhatsNewDialog />
        <Toaster position="bottom-right" />
        </KeyboardShortcutsProvider>
      </LibraryProvider>
    </QueryClientProvider>
  );
}
