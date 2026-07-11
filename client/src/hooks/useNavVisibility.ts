import { useCallback, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const NAV_CLASS = "-nav-visible";

/** Owns nav open state and the matching body class — single source of truth. */
export const useNavVisibility = () => {
  const { navVisible, setNavVisible } = useContext(GlobalContext);

  const setVisible = useCallback(
    (visible: boolean) => {
      document.body.classList.toggle(NAV_CLASS, visible);
      setNavVisible(visible);
    },
    [setNavVisible]
  );

  const toggle = useCallback(() => setVisible(!navVisible), [navVisible, setVisible]);
  const close = useCallback(() => setVisible(false), [setVisible]);

  return { navVisible, toggle, close };
};
