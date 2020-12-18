import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

interface Props {}

const Header: React.FC<Props> = () => {
  const { navVisible, setNavVisible } = useContext(GlobalContext);

  const toggleNav = () => {
    setNavVisible(!navVisible);
  };

  return (
    <header className="main-header">
      <h1 className="logo">Sample APIs</h1>
      <button className="-nav-icon" onClick={toggleNav}>
        Menu
      </button>
    </header>
  );
};

export default Header;
