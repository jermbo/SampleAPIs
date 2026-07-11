import { Link, useLocation } from "@tanstack/react-router";
import { faBook, faCodeBranch, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAV_LINKS = [
  { name: "About", path: "/about", icon: faInfoCircle },
  { name: "API List", path: "/api-list", icon: faList },
  { name: "Docs", path: "/docs", icon: faBook },
] as const;

const isCurrentPath = (pathname: string, path: string): boolean => {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
};

const PageHeaderActions = () => {
  const { pathname } = useLocation();

  return (
    <div className="page-header-actions">
      {NAV_LINKS.map((link) => {
        if (isCurrentPath(pathname, link.path)) return null;
        return (
          <Link key={link.name} className="btn" to={link.path}>
            <span>{link.name}</span>
            <FontAwesomeIcon icon={link.icon} />
          </Link>
        );
      })}
      <a
        href="https://github.com/jermbo/SampleAPIs"
        className="btn"
        target="_blank"
        rel="noreferrer"
      >
        <span>GitHub</span>
        <FontAwesomeIcon icon={faCodeBranch} />
      </a>
    </div>
  );
};

export default PageHeaderActions;
