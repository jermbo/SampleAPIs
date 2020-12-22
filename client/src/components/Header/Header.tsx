import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Nav from "../Nav/Nav";

interface Props {}

const Header: React.FC<Props> = () => {
  const { navVisible, setNavVisible } = useContext(GlobalContext);

  const toggleNav = () => {
    document.body.classList.toggle("-nav-visible");
    setNavVisible(!navVisible);
  };

  return (
    <header className="main-header">
      <h1 className="logo">
        <Link to="/">Sample APIs</Link>
      </h1>
      <button onClick={toggleNav} className="burger-nav">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <Nav />
    </header>
  );
};

export default Header;
