import { Link } from "@tanstack/react-router";
import { useNavVisibility } from "../../hooks/useNavVisibility";
import Nav from "../Nav/Nav";

const navToggleLabel = (visible: boolean): string => {
  if (visible) return "Close navigation menu";
  return "Open navigation menu";
};

const Header = () => {
  const { navVisible, toggle } = useNavVisibility();

  return (
    <header className="main-header">
      <h1 className="logo">
        <Link to="/">Sample APIs</Link>
      </h1>
      <button
        onClick={toggle}
        className="burger-nav"
        aria-label={navToggleLabel(navVisible)}
        aria-expanded={navVisible}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <Nav />
    </header>
  );
};

export default Header;
