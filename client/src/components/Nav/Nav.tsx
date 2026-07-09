import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";

import { GlobalContext } from "../../context/GlobalContext";

const Nav: React.FC = () => {
  const { setNavVisible } = useContext(GlobalContext);

  const location = useLocation();
  useEffect(() => {
    document.body.classList.remove("-nav-visible");
    setNavVisible(false);
  }, [location.pathname]);

  const activeProps = { className: "active" };

  return (
    <div className="full-screen-nav">
      <ul>
        <li>
          <Link to="/" activeOptions={{ exact: true }} activeProps={activeProps}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" activeProps={activeProps}>
            About
          </Link>
        </li>
        <li>
          <Link to="/api-list" activeProps={activeProps}>
            API List
          </Link>
        </li>
        <li>
          <Link to="/docs" activeProps={activeProps}>
            Docs
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
