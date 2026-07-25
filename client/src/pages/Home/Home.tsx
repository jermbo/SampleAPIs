import { useMemo } from "react";
import "./Home.css";

import APICard from "../../components/APICard/APICard";
import { useApiList } from "../../hooks/useApiList";
import { shuffleFeaturedApis } from "../../utils/featuredApis";
import PageHeaderActions from "../../components/PageHeaderActions/PageHeaderActions";

const Home = () => {
  const { data: apiList = [] } = useApiList();
  const featuredAPIs = useMemo(() => shuffleFeaturedApis(apiList), [apiList]);

  return (
    <section className="page-home">
      <header className="page-header">
        <h2 className="page-header__title">Sample APIs</h2>
        <p className="page-header__desc">
          A simple, no fuss, no mess, no auth playground for learning{" "}
          <abbr title="REpresentational State Transfer">RESTful</abbr>{" "}
          <abbr title="Application Programming Interface">API</abbr>s.
        </p>
        <PageHeaderActions />
      </header>
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">Example</h3>
        </div>
        <div className="section-desc">
          <p>
            Understanding RESTful APIs is hard enough, even without including an authentication
            mechanism. The sole purpose of this repository is to play with RESTful endpoints and
            learn. We have a few endpoints that you can start playing around with right away!
          </p>
          <p>
            Here's an example where I've pulled from: and chosen the "hot" endpoint:
            https://api.sampleapis.com/coffee/hot
            <br />
            then we ran the following code:
          </p>
          <pre>
            fetch("https://api.sampleapis.com/coffee/hot") <br />
            .then(resp =&gt; resp.json()) <br />
            .then(data =&gt; console.log(data[0].title)); <br />
          </pre>
          <p>and randomly selected a coffee and we get the following json back:</p>
          <pre>"Black Coffee"</pre>
          <p>Don't believe me? Try it yourself....</p>
          <p>
            or....Want to learn more? Try watching this video that will explain how to use this api
            and showcase the results without any front end coding:{" "}
            <a
              href="https://www.youtube.com/watch?v=7MZ6yTzesgg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hackathon Secrets - Presenting without a front end
            </a>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">
            Featured <abbr title="Application Program Interface">API</abbr>s
          </h3>
        </div>

        <div className="cards-grid">
          {featuredAPIs.map((api) => (
            <APICard key={api.metaData.title} api={api} />
          ))}
        </div>
      </section>
    </section>
  );
};

export default Home;
