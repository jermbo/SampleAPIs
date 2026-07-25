import { useEffect, useState, useSyncExternalStore } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/** Query Builder D3: auto-fetch, debounced, paused while the tab is hidden. */
const DEBOUNCE_MS = 400;

export interface QueryPreviewResult {
  data: unknown;
  /** From X-Total-Count: matches before pagination. Null when the header is absent. */
  total: number | null;
}

const useDebouncedValue = <T>(value: T, ms: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return debounced;
};

const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

const useDocumentVisible = (): boolean =>
  useSyncExternalStore(subscribeToVisibility, () => document.visibilityState === "visible");

const fetchPreview = async (url: string, signal: AbortSignal): Promise<QueryPreviewResult> => {
  const resp = await fetch(url, { signal });
  if (!resp.ok) {
    throw new Error(`Request failed (${resp.status})`);
  }
  const totalHeader = resp.headers.get("X-Total-Count");
  return {
    data: await resp.json(),
    total: totalHeader === null ? null : Number(totalHeader),
  };
};

/**
 * Live results for the Query Builder's composed URL. Control changes settle
 * for DEBOUNCE_MS before fetching; TanStack Query cancels the in-flight
 * request when the URL moves on, and previous results stay on screen while
 * the next ones load (no flicker).
 */
export const useQueryPreview = (url: string, enabled: boolean) => {
  const debouncedUrl = useDebouncedValue(url, DEBOUNCE_MS);
  const visible = useDocumentVisible();
  return useQuery({
    queryKey: ["queryPreview", debouncedUrl],
    queryFn: ({ signal }) => fetchPreview(debouncedUrl, signal),
    enabled: enabled && visible,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
