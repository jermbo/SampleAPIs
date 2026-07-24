import React, { createContext, useState } from "react";
import { iGlobal } from "../utils/Interfaces";

export const initialValues: iGlobal = {
  navVisible: false,
  setNavVisible: () => {},
};

export const GlobalContext = createContext(initialValues);

interface Props {
  children?: React.ReactNode;
}

/**
 * Holds UI-only global state. Server state (the API list, categories)
 * now lives in TanStack Query — see `hooks/useApiList`.
 */
const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [navVisible, setNavVisible] = useState(initialValues.navVisible);

  const values = {
    navVisible,
    setNavVisible,
  };

  return <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>;
};

export default GlobalProvider;
