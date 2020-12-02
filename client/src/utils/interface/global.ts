import { Dispatch } from "react";

export interface iGlobal {
  navVisible: boolean;
  setNavVisible: Dispatch<boolean>;
  appState: AppStateEnum;
  setAppState: Dispatch<AppStateEnum>;
}

export enum AppStateEnum {
  initial = "INITIAL",
  loading = "LOADING",
  ready = "READY",
  error = "ERROR",
}

export interface FetchState<T> {
  status: number,
  data: T | null
}

export interface APIListResponse {
  APIList: APIData[];
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
}
