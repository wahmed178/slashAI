/**
 * Shared helpers for the expanded resource catalog parts.
 * Type-only import keeps this free of runtime circular dependencies.
 */
import type { Resource } from "../resources";

export const D = "2026-08-26";

export const r = (
  x: Omit<Resource, "addedDate" | "lastUpdated" | "lastVerified" | "status"> &
    Partial<Pick<Resource, "addedDate" | "lastUpdated" | "lastVerified" | "status">>,
): Resource => ({
  addedDate: D,
  lastUpdated: D,
  lastVerified: D,
  status: "Active",
  ...x,
});
