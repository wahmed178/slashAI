import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
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
import { KeyboardShortcutsProvider } from "@/lib/keyboard-shortcuts.tsx";
import { Toaster } from "@/components/ui/sonner";
import { WhatsNewDialog } from "@/components/library/WhatsNewDialog";


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
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Search and copy 5,635 free AI slash commands, run 150+ browser tools in SlashKits, and browse 319 curated free resources, roadmaps and a daily quiz. Free forever, no account.",
      },
      { name: "author", content: "SlashAI" },
      { title: "SlashAI - 5,635 Free AI Slash Commands, Tools & Resources" },
      { property: "og:title", content: "SlashAI - 5,635 Free AI Slash Commands, Tools & Resources" },
      {
        property: "og:description",
        content:
          "Search and copy 5,635 free AI slash commands, run 150+ browser tools in SlashKits, and browse 319 curated free resources. Free forever, no account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
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
            __html: `try{var t=localStorage.getItem('slashai-theme');try{var s=JSON.parse(localStorage.getItem('slashai.settings')||'{}');if(s&&typeof s.theme==='string')t=s.theme}catch(e){}if(t==='light'){document.documentElement.classList.add('light')}else if(t==='amoled'){document.documentElement.classList.add('amoled')}else if(t==='glass'){document.documentElement.classList.add('glass')}}catch(e){}`,
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
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <WhatsNewDialog />
        <Toaster position="bottom-right" />
        </KeyboardShortcutsProvider>
      </LibraryProvider>
    </QueryClientProvider>
  );
}
