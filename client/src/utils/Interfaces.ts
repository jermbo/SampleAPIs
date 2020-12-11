import { Dispatch } from "react";
import { AppStateEnum } from "./Enums";

export interface iGlobal {
  navVisible: boolean;
  setNavVisible: Dispatch<boolean>;
  apiList: APIData[];
  setAPIList: Dispatch<APIData[]>;
  appState: AppStateEnum;
  setAppState: Dispatch<AppStateEnum>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<boolean>;
  apiCategories: string[];
  setApiCategories: Dispatch<string[]>;
}

export interface FetchState<T> {
  status: number,
  data: T | null,
  error?: string,
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
