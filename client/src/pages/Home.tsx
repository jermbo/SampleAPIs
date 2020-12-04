import React from "react";
import { Link } from "react-router-dom";
import { faBook, faCode, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FeaturedAPIs from "../components/FeaturedAPIs";

const Home: React.FC = () => {
  return (
    <section className="home-page">
      <div className="home-page-header">
        <h2 className="home-page__title">Sample APIs</h2>
        <p className="home-page__sub-title">
          A simple, no fuss, no mess, no auth, playground for learning <span>RESTful</span> or <span>GraphQL</span>{" "}
          APIs.
        </p>
        <div className="home-page-actions">
          <Link className="home-page-action btn" to="/about">
            <span>About</span>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Link>
          <Link className="home-page-action btn" to="/api-list">
            <span>API List</span>
            <FontAwesomeIcon icon={faList} />
          </Link>
          <Link className="home-page-action btn" to="/docs">
            <span>Docs</span>
            <FontAwesomeIcon icon={faBook} />
          </Link>
          <Link className="home-page-action btn" to="/custom">
            <span>Create Custom API</span>
            <FontAwesomeIcon icon={faCode} />
          </Link>
        </div>
      </div>
      <FeaturedAPIs />
    </section>
  );
};

export default Home;
