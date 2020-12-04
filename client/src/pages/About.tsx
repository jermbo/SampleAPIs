import React from "react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <section className="page">
      <div className="page-header">
        <h2 className="page__title">About Sample APIs</h2>
      </div>
      <div className="page-body">
        <p>
          Learning <abbr title="REpresentational State Transfer">RESTful</abbr> or GraphQL{" "}
          <abbr title="Application Program Interface">API</abbr> endpoints can be hard enough for beginners. Not to
          mention the headaches required for authentication before you can even look at the data.
        </p>
        <p>Whelp Sample APIs aims to solve that problem.</p>
        <p>
          Every endpoint provided in our <Link to="/api-list">API List</Link> gives you full{" "}
          <abbr title="Create. Read. Update. Delete.">CRUD</abbr> capabilities, without the hassle of authentication.
        </p>
        <p>
          API authentication and security are very important aspects of any system, but can be a barrier to learning how
        </p>
      </div>
    </section>
  );
};

export default About;
