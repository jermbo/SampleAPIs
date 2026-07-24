import { Dispatch } from "react";

export interface iGlobal {
  navVisible: boolean;
  setNavVisible: Dispatch<boolean>;
}

export interface FetchState<T> {
  status: number;
  data: T | null;
  error?: string;
}

export interface APIListResponse {
  APIListData: APIData[];
}

export interface APIData {
  name: string;
  link: string;
  metaData: MetaData;
  endpoints: string[];
}

export interface MetaData {
  title: string;
  longDesc: string;
  desc: string;
  featured: boolean;
  categories: string[];
  examples?: Example[];
}

export interface Example {
  hash: string;
  title: string;
  endpoint: string;
  user?: string;
  defaultTab?: string;
}
