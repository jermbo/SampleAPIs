import React, { createContext, useState } from 'react';

import { iGlobal } from './utils/interface/global'

export const initialValues: iGlobal = {
  navVisible: false,
  setNavVisible: () => { },
}

export const GlobalContext = createContext(initialValues);

const GlobalProvider: React.FC = ({ children }) => {
  const [navVisible, setNavVisible] = useState(initialValues.navVisible);

  const values = {
    navVisible,
    setNavVisible
  }
  return (
    <GlobalContext.Provider value={values}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider;
