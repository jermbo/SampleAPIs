import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import APICategories from "../../components/APICategories/APICategories";
import APIEndpoints from "../../components/Endpoints/Endpoints";
import CodeDisplay from "../../components/CodeDisplay/CodeDisplay";
import { GlobalContext } from "../../context/GlobalContext";
import { APIData } from "../../utils/Interfaces";

interface ParamTypes {
  id: string;
}

interface Props {}

const APIDetails: React.FC<Props> = () => {
  const { id } = useParams<ParamTypes>();
  const { apiList } = useContext(GlobalContext);
  const [singleAPI, setSingleAPI] = useState({} as APIData);
  const [singleEndpoint, setSingleEndpoint] = useState("");

  useEffect(() => {
    const api = apiList.filter((a) => a.name === id)[0];
    setSingleEndpoint(api?.endpoints[0]);
    setSingleAPI(api);
  }, [id, apiList]);

  if (!singleAPI?.metaData) {
    return <h1>Loading</h1>;
  }

  return (
    <section className="page -api-details">
      <header className="page-header">
        <Link className="btn" to="/api-list">
          Back to List
        </Link>
        <h2 className="page-header__title">{singleAPI.metaData.title}</h2>
        <APICategories categories={singleAPI.metaData.categories} />
        <p className="page-header__desc">{singleAPI.metaData.longDesc}</p>
      </header>
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Available Endpoints</h3>
          <APIEndpoints
            urlBase={singleAPI.link}
            endpoints={singleAPI.endpoints}
            onEndpointSelect={setSingleEndpoint}
          />
        </div>
        <div className="section-body">
          <CodeDisplay urlBase={singleAPI.link} endpoint={singleEndpoint} />
        </div>
      </div>
    </section>
  );
};

export default APIDetails;
