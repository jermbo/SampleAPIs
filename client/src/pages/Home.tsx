import React from "react";
import { Link } from "react-router-dom";
import { faBook, faCode, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FeaturedAPIs from "../components/FeaturedAPIs";

const Home: React.FC = () => {
  return (
    <section className="page">
      <div className="page-header">
        <h2 className="page__title">Sample APIs</h2>
        <p className="page__sub-title">
          A simple, no fuss, no mess, no auth, playground for learning <span>RESTful</span> or <span>GraphQL</span>{" "}
          APIs.
        </p>
      </div>
      <div className="page-actions">
        <Link className="page-action btn" to="/">
          <span>About</span>
          <FontAwesomeIcon icon={faInfoCircle} />
        </Link>
        <Link className="page-action btn" to="/">
          <span>API List</span>
          <FontAwesomeIcon icon={faList} />
        </Link>
        <Link className="page-action btn" to="/">
          <span>Docs</span>
          <FontAwesomeIcon icon={faBook} />
        </Link>
        <Link className="page-action btn" to="/">
          <span>Create Custom API</span>
          <FontAwesomeIcon icon={faCode} />
        </Link>
      </div>
      <FeaturedAPIs />
    </section>
  );
};

export default Home;
