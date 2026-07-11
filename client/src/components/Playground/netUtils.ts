import type { NetEvent } from "./types";

/** A network panel row: the `request` event creates it, `response`/`error` fill it in. */
export interface NetRow {
  id: number;
  method: string;
  url: string;
  pending: boolean;
  failed: boolean;
  status?: number;
  statusText?: string;
  ms?: number;
  size?: number | null;
  headers?: Record<string, string>;
  message?: string;
}

/** Headers worth surfacing first — mirrors the server's CORS exposedHeaders list. */
export const CURATED_HEADERS = [
  "content-type",
  "x-total-count",
  "link",
  "location",
  "ratelimit-limit",
  "ratelimit-remaining",
  "ratelimit-reset",
  "retry-after",
];

/** Plain-language explainer for the failure cases beginners actually hit. */
export const explainFailure = (row: NetRow): string | null => {
  if (row.failed)
    return "The request never got an HTTP response. This usually means the host doesn't exist, the server is unreachable, or the browser blocked the request (CORS). Check the URL first.";
  if (row.status === 404)
    return "Not found — the API answered, but nothing lives at this path or id. Check the endpoint spelling and the id.";
  if (row.status === 429)
    return "Too many requests — you hit the rate limit. Wait for it to reset (see the RateLimit-* headers below) and try again.";
  if (row.status !== undefined && row.status >= 500)
    return "Server error — the problem is on the API's side, not in your code. Try again in a moment.";
  return null;
};

export const formatSize = (size: number | null | undefined): string => {
  if (size === null || size === undefined) return "—";
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(1)} KB`;
};

export const statusClass = (row: NetRow): string => {
  if (row.failed) return "-err";
  if (row.pending || row.status === undefined) return "-pending";
  return `-s${Math.floor(row.status / 100)}xx`;
};

export const applyNetEvent = (rows: NetRow[], ev: NetEvent): NetRow[] => {
  if (ev.phase === "request") {
    return [
      ...rows,
      { id: ev.id, method: ev.method, url: ev.url, pending: true, failed: false },
    ];
  }
  return rows.map((r) =>
    r.id !== ev.id
      ? r
      : ev.phase === "response"
        ? {
            ...r,
            pending: false,
            url: ev.url || r.url,
            status: ev.status,
            statusText: ev.statusText,
            ms: ev.ms,
            size: ev.size,
            headers: ev.headers,
          }
        : { ...r, pending: false, failed: true, ms: ev.ms, message: ev.message }
  );
};

/** Elide the origin on rows that hit the active endpoint's host. */
export const displayUrl = (rowUrl: string, activeUrl: string): string => {
  try {
    const u = new URL(rowUrl);
    if (u.origin === new URL(activeUrl).origin) return u.pathname + u.search;
  } catch {
    /* relative or malformed — show as-is */
  }
  return rowUrl;
};

export const toggleInSet = (set: Set<number>, id: number): Set<number> => {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

export const netStatusLabel = (row: NetRow): string => {
  if (row.failed) return "failed";
  if (row.pending) return "…";
  return String(row.status ?? "");
};
