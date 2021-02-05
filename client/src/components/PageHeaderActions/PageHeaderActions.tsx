import React from "react";
import { Link } from "react-router-dom";
import { faBook, faCodeBranch, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  currentPage?: string;
}

const PageHeaderActions: React.FC<Props> = ({ currentPage }) => {
  const links = [
    {
      name: "About",
      path: "/about",
      icon: faInfoCircle,
      show: currentPage === "about",
    },
    {
      name: "API List",
      path: "/api-list",
      icon: faList,
      show: currentPage === "api-list",
    },
    {
      name: "Docs",
      path: "/docs",
      icon: faBook,
      show: currentPage === "docs",
    },
  ];
  return (
    <div className="page-header-actions">
      {links.map((link) => {
        if (link.show) return null;
        return (
          <Link className="btn" to={link.path}>
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
