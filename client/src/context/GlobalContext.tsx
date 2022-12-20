import React, { createContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

import { AppStateEnum } from "../utils/Enums";
import { APIData, APIListResponse, FetchState, iGlobal } from "../utils/Interfaces";

export const initialValues: iGlobal = {
  navVisible: false,
  setNavVisible: () => {},
  apiList: [] as APIData[],
  setAPIList: () => [],
  appState: AppStateEnum.initial,
  setAppState: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  apiCategories: [],
  setApiCategories: () => {},
};

export const GlobalContext = createContext(initialValues);

interface Props {
  children?: React.ReactNode;
}

const BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api.sampleapis.com" : "http://localhost:5555";

const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [navVisible, setNavVisible] = useState(initialValues.navVisible);
  const [appState, setAppState] = useState(initialValues.appState);
  const [apiList, setAPIList] = useState(initialValues.apiList);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiCategories, setApiCategories] = useState(initialValues.apiCategories);

  const { state: APIState, data } = useFetch<FetchState<APIListResponse>>(`${BASE_URL}/frontend`);

  const generateCategories = (list: APIData[]) => {
    const allCategories = list.reduce((acc: string[], item) => {
      return [...acc, ...item.metaData.categories];
    }, []);
    setApiCategories(Array.from(new Set(allCategories)));
  };

  useEffect(() => {
    if (APIState === AppStateEnum.ready) {
      const list = data?.data?.APIListData || ([] as APIData[]);
      setAPIList(list);
      generateCategories(list);
      return;
    }
  }, [APIState, data?.data?.APIListData]);

  const values = {
    navVisible,
    setNavVisible,
    apiList,
    setAPIList,
    appState,
    setAppState,
    isLoggedIn,
    setIsLoggedIn,
    apiCategories,
    setApiCategories,
  };
  return (
    <GlobalContext.Provider value={values}>
      <>{children}</>
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
