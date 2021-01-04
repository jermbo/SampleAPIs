import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
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
        <div className="page-header-actions">
          <a
            href="https://github.com/jermbo/SampleAPIs"
            className="btn"
            target="_blank"
            rel="noreferrer"
          >
            <span>GitHub</span>
            <FontAwesomeIcon icon={faCodeBranch} />
          </a>
          <Link className="btn" to="/docs">
            <span>Docs</span>
            <FontAwesomeIcon icon={faBook} />
          </Link>
        </div>
      </header>
      <section className="section">
        <p>
          Understanding <abbr title="REpresentational State Transfer">RESTful</abbr> or{" "}
          <abbr title="Graph Query Language">GraphQL</abbr>{" "}
          <abbr title="Application Program Interface">API</abbr>s is hard enough, even without
          including an authentication mechanism. The sole purpose of this website is to play with
          <abbr title="REpresentational State Transfer">RESTful</abbr> endpoints and learn. We have
          a few endpoints that you can start playing around with right away! If you are not finding
          anything you are interested in, create your own endpoints and submit a pull request.
        </p>
        <p>
          You can use any <abbr title="Hyper Text Transfer Protocol">HTTP</abbr> verbs (GET, POST,
          PUT, PATCH and DELETE) and access your resources from anywhere using{" "}
          <abbr title="Cross-origin Resource Sharing">CORS</abbr> and{" "}
          <abbr title="JSON with Padding">JSONP</abbr>.
        </p>
      </section>
    </div>
  );
};

export default About;
