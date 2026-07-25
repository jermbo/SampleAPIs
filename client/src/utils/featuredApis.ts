import type { APIData } from "./Interfaces";

/** Featured APIs in random display order — reshuffles when the source list changes. */
export const shuffleFeaturedApis = (apiList: APIData[]): APIData[] => {
  const featured = apiList.filter((api) => api.metaData.featured);
  return [...featured].sort(() => (Math.random() > 0.5 ? 1 : -1));
};
