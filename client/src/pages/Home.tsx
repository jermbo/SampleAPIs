import React from "react";
import { Link } from "react-router-dom";

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
      <nav className="page-actions">
        <p>
          There is a lot to do with Sample APIs, why not
          <Link className="text-btn" to="/about">
            learn more about the project?
          </Link>
          We've got a huge list of data points
          <Link className="text-btn" to="/api-list">
            API List.
          </Link>
          Be sure to
          <Link className="text-btn" to="/docs">
            check out the docs
          </Link>
          for some guidance. Do you need a quick an simple api? Consider
          <Link className="text-btn" to="/custom">
            creating a custom endpoint.
          </Link>
        </p>
      </nav>
    </section>
  );
};

export default Home;
