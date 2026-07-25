import { useQuery } from "@tanstack/react-query";
import { URLS } from "../utils/Config";
import { APIData, APIListResponse, FetchState } from "../utils/Interfaces";

const fetchApiList = async (): Promise<APIData[]> => {
  const resp = await fetch(`${URLS.API_LINK}/frontend`);
  if (!resp.ok) {
    throw new Error(`Failed to load API list (${resp.status})`);
  }
  const json: FetchState<APIListResponse> = await resp.json();
  return json.data?.APIListData ?? [];
};

/**
 * Server state for the full list of available sample APIs.
 * Backed by TanStack Query, so callers get caching, dedup, and
 * loading/error state without any provider wiring.
 */
export const useApiList = () =>
  useQuery({
    queryKey: ["apiList"],
    queryFn: fetchApiList,
  });

/**
 * Derived list of unique categories across every API.
 * Shares the cached `apiList` query and only re-derives when it changes.
 */
export const useApiCategories = () =>
  useQuery({
    queryKey: ["apiList"],
    queryFn: fetchApiList,
    select: (list) => {
      const all = list.flatMap((item) => item.metaData.categories);
      return Array.from(new Set(all));
    },
  });

/** One API from the cached list, matched by its endpoint link slug. */
export const useApiForLink = (apiLink: string) => {
  const { data: apiList = [] } = useApiList();
  return apiList.find((api) => api.link === apiLink);
};
