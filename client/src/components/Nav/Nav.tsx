import { useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useNavVisibility } from "../../hooks/useNavVisibility";

const Nav = () => {
  const { close } = useNavVisibility();
  const location = useLocation();

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  const activeProps = { className: "active" };

  return (
    <nav className="full-screen-nav" aria-label="Primary">
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
          <Link to="/learn" activeProps={activeProps}>
            Learn
          </Link>
        </li>
        <li>
          <Link to="/docs" activeProps={activeProps}>
            Docs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
