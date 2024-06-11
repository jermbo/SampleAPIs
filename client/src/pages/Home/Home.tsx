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
  const [coffees, setCoffees] = useState([] as any[]);
  
  useEffect(() => {
    const featured = apiList
      .filter((api) => api.metaData.featured)
      .sort(() => (Math.random() > 0.5 ? 1 : -1));
    setFeatureAPIs(featured);

    fetch("https://api.sampleapis.com/coffee/hot")
      .then((resp) => resp.json())
      .then((data) => setCoffees(data));


  }, [apiList]);

  return (
    <section className="page-home">
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
          <h3 className="section-title">Example</h3>
        </div>
        <div className="section-desc">
          <p>
            Understanding RESTful APIs is hard enough, even without including an
            authentication mechanism. The sole purpose of this repository is to
            play with RESTful endpoints and learn. We have a few endpoints that
            you can start playing around with right away!
          </p>
          <p> Here's an example where I've pulled from: 
            and chosen the "hot" endpoint: https://api.sampleapis.com/coffee/hot<br />
            then we ran the following code:
            <pre>
              fetch("https://api.sampleapis.com/coffee/hot") <br />
              .then(resp =&gt; resp.json()) <br />
              .then(data =&gt; console.log(data[0].title)); <br />
            </pre>
            and randomly selected a coffee and we get the following json back: 
            <pre>
              {JSON.stringify(coffees[0].title, null, 2)}
            </pre>
            Want to learn more? Try watching this video that will explain how to use this api and showcase the results 
            without any front end coding: <a href="https://www.youtube.com/watch?v=lCs9EriXnY8">https://www.youtube.com/watch?v=lCs9EriXnY8</a>
          </p>
          </div>  
      </div>
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
