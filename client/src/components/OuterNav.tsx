// import React, { useEffect, useState } from "react";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { RouteComponentProps, withRouter } from "react-router";

import { NavLink } from "react-router-dom";

type SomeComponentProps = RouteComponentProps;

const OuterNav: React.FC<SomeComponentProps> = ({ history }) => {
  const { setNavVisible } = useContext(GlobalContext);
  useEffect(() => {
    setNavVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

  return (
    <div className="outer-nav">
      <NavLink exact activeClassName="active" to="/">
        Home
      </NavLink>
      <NavLink exact activeClassName="active" to="/about">
        About
      </NavLink>
      <NavLink exact activeClassName="active" to="/api-list">
        API List
      </NavLink>
      <NavLink exact activeClassName="active" to="/docs">
        Docs
      </NavLink>
      <NavLink exact activeClassName="active" to="/custom">
        Custom
      </NavLink>
    </div>
  );
};

export default withRouter(OuterNav);
