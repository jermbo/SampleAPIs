import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faSpider } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface Props {}

const About: React.FC<Props> = () => {
  return (
    <div className="page -about">
      <header className="page-header">
        <h2 className="page-header__title">About Sample APIs</h2>
        <p className="page-header__desc">
          An open source project to help you on your journey of learning{" "}
          <abbr title="REpresentational State Transfer">RESTful</abbr> or{" "}
          <abbr title="Graph Query Language">GraphQL</abbr> endpoints.
        </p>
        <div className="home-actions">
          <a href="https://github.com/jermbo/SampleAPIs" className="btn">
            <span>GitHub</span>
            <FontAwesomeIcon icon={faCodeBranch} />
          </a>
          <Link className="btn" to="/docs">
            <span>Docs</span>
            <FontAwesomeIcon icon={faSpider} />
          </Link>
        </div>
      </header>
    </div>
  );
};

export default About;
