import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EndPointLink from "../components/EndPointLink";
import { GlobalContext } from "../GlobalContext";
import { APIData } from "../utils/Interfaces";

interface ParamTypes {
  id: string;
}

const APIDetails: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  const { apiList } = useContext(GlobalContext);
  console.log(apiList);
  const [singleAPI, setSingleAPI] = useState({} as APIData);

  useEffect(() => {
    const api = apiList.filter((a) => a.name === id)[0];
    console.log(api);
    setSingleAPI(api);
  }, [apiList]);

  return (
    <section className="home-page">
      {!singleAPI?.metaData && <h1>LOADING....</h1>}
      {singleAPI?.metaData && (
        <>
          <div className="home-page-header">
            <Link to="/api-list" className="home-page-action btn">
              Back to List
            </Link>
            <h2 className="home-page__title">{singleAPI.metaData.title}</h2>
            <p>{singleAPI.metaData.longDesc}</p>
            <div className="home-page-actions">
              {singleAPI.endpoints &&
                singleAPI.endpoints.map((endpoint) => (
                  <EndPointLink key={endpoint} baseAPI={singleAPI.link} endpoint={endpoint} />
                  // <a
                  //   key={endpoint}
                  //   href={`http://localhost:5555/${singleAPI.link}/api/${endpoint}`}
                  //   className="home-page-action btn"
                  //   target="_blank"
                  //   rel="noreferrer"
                  // >
                  //   {endpoint}
                  // </a>
                ))}
            </div>
          </div>
          <div className="home-page-featured">
            <h4>{singleAPI.name}..</h4>
          </div>
        </>
      )}
    </section>
  );
};

export default APIDetails;
