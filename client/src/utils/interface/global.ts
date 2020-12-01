import { Dispatch } from "react";

export interface iGlobal {
  navVisible: boolean;
  setNavVisible: Dispatch<boolean>;
  apiList: iAPIList[];
  setAPIList: Dispatch<iAPIList[]>;
  appState: AppStateEnum;
  setAppState: Dispatch<AppStateEnum>;
}

export enum AppStateEnum {
  initial = "INITIAL",
  loading = "LOADING",
  ready = "READY",
  error = "ERROR",
}

export interface iAPIList {
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
