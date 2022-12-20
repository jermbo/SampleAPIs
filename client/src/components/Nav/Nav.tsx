import React, { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { GlobalContext } from "../../context/GlobalContext";

const Nav: React.FC = () => {
  const { setNavVisible } = useContext(GlobalContext);

  let location = useLocation();
  useEffect(() => {
    document.body.classList.remove("-nav-visible");
    setNavVisible(false);
  }, [location]);

  const setActive = (navData: { isActive: boolean; isPending: boolean }) => {
    return navData.isActive ? "active" : "";
  };

  return (
    <div className="full-screen-nav">
      <ul>
        <li>
          <NavLink className={setActive} to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className={setActive} to="/about">
            About
          </NavLink>
        </li>
        <li>
          <NavLink className={setActive} to="/api-list">
            API List
          </NavLink>
        </li>
        <li>
          <NavLink className={setActive} to="/docs">
            Docs
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

// export default withRouter(Nav);
export default Nav;
