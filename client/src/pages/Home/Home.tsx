import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import { faBook, faCode, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import APICard from "../../components/APICard/APICard";
import { GlobalContext } from "../../context/GlobalContext";
import { APIData } from "../../utils/Interfaces";

interface Props {}

const Home: React.FC<Props> = () => {
  const { apiList } = useContext(GlobalContext);
  const [featuredAPIs, setFeatureAPIs] = useState([] as APIData[]);

  useEffect(() => {
    const featured = apiList
      .filter((api) => api.metaData.featured)
      .sort(() => (Math.random() > 0.5 ? 1 : -1));
    setFeatureAPIs(featured);
  }, [apiList]);

  return (
    <div className="page -home">
      <header className="page-header">
        <h2 className="page-header__title">Sample APIs</h2>
        <p className="page-header__desc">
          A simple, no fuss, no mess, no auth playground for learning{" "}
          <abbr title="REpresentational State Transfer">RESTful</abbr> or{" "}
          <abbr title="Graph Query Language">GraphQL</abbr>{" "}
          <abbr title="Application Programming Interface">API</abbr>s.
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
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">
            Featured <abbr title="Application Program Interface">API</abbr>s
          </h3>
        </div>
        <div className="cards-grid">
          {featuredAPIs &&
            featuredAPIs.map((api) => <APICard key={api.metaData.title} api={api} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;
