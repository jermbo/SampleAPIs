import { faBook, faCode, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

interface Props {}

const Home: React.FC<Props> = () => {
  return (
    <div className="page -home">
      <header>
        <h2 className="display-1">Sample APIs</h2>
        <p className="text-1">
          A simple, no fuss, no mess, no auth, playground for learning <span>RESTful</span> or{" "}
          <span>GraphQL</span> APIs.
        </p>
        <div className="home-actions">
          <Link className="btn" to="/about">
            <span>About</span>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Link>
          <Link className="btn" to="/api-list">
            <span>API List</span>
            <FontAwesomeIcon icon={faList} />
          </Link>
          <Link className="btn" to="/docs">
            <span>Docs</span>
            <FontAwesomeIcon icon={faBook} />
          </Link>
          <Link className="btn" to="/custom">
            <span>Create Custom API</span>
            <FontAwesomeIcon icon={faCode} />
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Home;
