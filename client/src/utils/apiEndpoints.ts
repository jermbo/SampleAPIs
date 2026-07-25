import { URLS } from "./Config";
import type { APIData } from "./Interfaces";

export const findApiByName = (apiList: APIData[], name: string): APIData | undefined =>
  apiList.find((api) => api.name === name);

export const buildEndpointUrl = (api: APIData, endpoint: string): string =>
  `${URLS.API_LINK}/${api.link}/${endpoint}`;

export const defaultEndpoint = (api: APIData): string => api.endpoints[0] ?? "";
