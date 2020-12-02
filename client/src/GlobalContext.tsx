import React, { createContext, useState } from "react";
import useFetch from "./hooks/useFetch";

import { APIListResponse, AppStateEnum, FetchState, iGlobal } from "./utils/interface/global";

export const initialValues: iGlobal = {
  navVisible: false,
  setNavVisible: () => {},
  appState: AppStateEnum.initial,
  setAppState: () => {},
};

export const GlobalContext = createContext(initialValues);

const BASE_URL = "http://localhost:5555/frontend";
// const inventory = "http://localhost:5555/futurama/api/inventory";

// interface InventoryItem {
//   title: string;
//   category: string;
//   description: string;
//   slogan: string;
//   price: number;
//   stock: number;
//   id: number;
// }

const GlobalProvider: React.FC = ({ children }) => {
  const [navVisible, setNavVisible] = useState(initialValues.navVisible);
  const [appState, setAppState] = useState(initialValues.appState);
  // const [apiList, setAPIList] = useState(initialValues.apiList);

  const data = useFetch<FetchState<APIListResponse>>(BASE_URL);
  console.log(data?.data?.APIList);

  // const items = useFetch<InventoryItem[]>(inventory);
  // console.log(items[2].title);

  // const { data, error, isLoading } = useFetch<iAPIList>(`${BASE_URL}/frontend`);
  // console.log({ data, error, isLoading });
  // const data = useFetch<Response>(`${BASE_URL}/frontend`);
  // console.log(data);
  // const getAPIList = async () => {
  //   if (appState !== AppStateEnum.initial) {
  //     return;
  //   }
  //   try {
  //     setAppState(AppStateEnum.loading);
  //     const resp = await fetch(`${BASE_URL}/frontend`);
  //     const { data } = await resp.json();
  //     console.log(data.APIList);
  //     setAPIList(data.APIList);
  //     setAppState(AppStateEnum.ready);
  //   } catch (e) {
  //     setAppState(AppStateEnum.error);
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   getAPIList();
  // });

  const values = {
    navVisible,
    setNavVisible,
    appState,
    setAppState,
  };
  return <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>;
};

export default GlobalProvider;
