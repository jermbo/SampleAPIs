import React, { useContext, useEffect, useState } from "react";
import "./Home.scss";

import APICard from "../../components/APICard/APICard";
import { GlobalContext } from "../../context/GlobalContext";
import { APIData } from "../../utils/Interfaces";
import PageHeaderActions from "../../components/PageHeaderActions/PageHeaderActions";

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
    <section className="page -home">
      <header className="page-header">
        <h2 className="page-header__title">Sample APIs</h2>
        <p className="page-header__desc">
          A simple, no fuss, no mess, no auth playground for learning{" "}
          <abbr title="REpresentational State Transfer">RESTful</abbr> or{" "}
          <abbr title="Graph Query Language">GraphQL</abbr>{" "}
          <abbr title="Application Programming Interface">API</abbr>s.
        </p>
        <PageHeaderActions />
      </header>
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">
            Featured <abbr title="Application Program Interface">API</abbr>s
          </h3>
        </div>
        <div className="cards-grid">
          {featuredAPIs &&
            featuredAPIs.map((api) => (
              <APICard key={api.metaData.title} featured={api.metaData.featured} api={api} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
