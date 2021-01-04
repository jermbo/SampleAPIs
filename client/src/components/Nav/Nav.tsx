import React, { useContext, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { NavLink } from "react-router-dom";

import { GlobalContext } from "../../context/GlobalContext";

const Nav: React.FC<RouteComponentProps> = ({ history }) => {
  const { setNavVisible } = useContext(GlobalContext);

  useEffect(() => {
    document.body.classList.remove("-nav-visible");
    setNavVisible(false);
  }, [history?.location.pathname, setNavVisible]);

  return (
    <div className="full-screen-nav">
      <ul>
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName="active" to="/about">
            About
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName="active" to="/api-list">
            API List
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName="active" to="/docs">
            Docs
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(Nav);
