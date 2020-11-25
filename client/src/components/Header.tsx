import React, { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

const Header = () => {
  const { navVisible, setNavVisible } = useContext(GlobalContext);

  const toggleNav = (e: any) => {
    setNavVisible(!navVisible);
  };

  return (
    <>
      <header>
        <h1 className="logo">Sample APIs</h1>
        <button onClick={toggleNav}>NAV</button>
      </header>
    </>
  );
};

export default Header;
