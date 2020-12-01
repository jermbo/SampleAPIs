import React, { createContext, useEffect, useState } from "react";

import { AppStateEnum, iAPIList, iGlobal } from "./utils/interface/global";

export const initialValues: iGlobal = {
  navVisible: false,
  setNavVisible: () => {},
  apiList: [] as iAPIList[],
  setAPIList: () => {},
  appState: AppStateEnum.initial,
  setAppState: () => {},
};

export const GlobalContext = createContext(initialValues);

const BASE_URL = "http://localhost:5555";

const GlobalProvider: React.FC = ({ children }) => {
  const [navVisible, setNavVisible] = useState(initialValues.navVisible);
  const [appState, setAppState] = useState(initialValues.appState);
  const [apiList, setAPIList] = useState(initialValues.apiList);

  const getAPIList = async () => {
    if (appState !== AppStateEnum.initial) {
      return;
    }
    try {
      setAppState(AppStateEnum.loading);
      const resp = await fetch(`${BASE_URL}/frontend`);
      const { data } = await resp.json();
      console.log(data.APIList);
      setAPIList(data.APIList);
      setAppState(AppStateEnum.ready);
    } catch (e) {
      setAppState(AppStateEnum.error);
      throw new Error(e);
    }
  };

  useEffect(() => {
    getAPIList();
  });

  const values = {
    navVisible,
    setNavVisible,
    appState,
    setAppState,
    apiList,
    setAPIList,
  };
  return <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>;
};

export default GlobalProvider;
