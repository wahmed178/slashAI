/**
 * Application error reporting module for SlashAI.
 * Captures React error boundary and unhandled runtime exceptions.
 */

export interface ErrorReportContext {
  boundary?: string;
  route?: string;
  [key: string]: unknown;
}

export function reportAppError(error: unknown, context: ErrorReportContext = {}) {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  const errorContext = {
    route: pathname,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Provide clean error diagnostics during development
  if (import.meta.env.DEV) {
    console.error("[SlashAI Error Boundary]", error, errorContext);
  }
}
