import { useQuery } from "@tanstack/react-query";

/** Sample size for shape derivation and field discovery (Shape Viewer D1). */
export const SAMPLE_LIMIT = 50;

export interface EndpointSample {
  records: Record<string, unknown>[];
  /** Object endpoints (singular resources) sample as one record; coverage is meaningless. */
  isSingular: boolean;
}

const fetchSample = async (url: string, signal: AbortSignal): Promise<EndpointSample> => {
  const resp = await fetch(`${url}?_limit=${SAMPLE_LIMIT}`, { signal });
  if (!resp.ok) {
    throw new Error(`Failed to sample endpoint (${resp.status})`);
  }
  const data: unknown = await resp.json();
  if (Array.isArray(data)) return { records: data, isSingular: false };
  return { records: [data as Record<string, unknown>], isSingular: true };
};

/**
 * The first records of an endpoint, shared by the Shape tab and the Query
 * Builder's field picker — one cache entry per endpoint URL, so opening
 * both tabs costs one request.
 */
export const useSampleRecords = (url: string, enabled: boolean) =>
  useQuery({
    queryKey: ["endpointSample", url],
    queryFn: ({ signal }) => fetchSample(url, signal),
    enabled,
    staleTime: 60_000,
  });
