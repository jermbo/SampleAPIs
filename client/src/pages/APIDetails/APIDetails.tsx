import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import APICategories from "../../components/APICategories/APICategories";
import APIEndpoints from "../../components/Endpoints/Endpoints";
import { GlobalContext } from "../../context/GlobalContext";
import { APIData, Example } from "../../utils/Interfaces";
import { URLS } from "../../utils/Config";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./APIDetails.scss";
import { Sandpack } from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";

interface Props {}

const APIDetails: React.FC<Props> = () => {
  const { id } = useParams();
  const { apiList } = useContext(GlobalContext);
  const [singleAPI, setSingleAPI] = useState({} as APIData);
  const [singleEndpoint, setSingleEndpoint] = useState("");
  const [thisApiEndpoint, setThisApiEndpoint] = useState("");
  const [exampleList, setExampleList] = useState<Example[]>([]);

  const [codeSample, setCodeSample] = useState("");

  useEffect(() => {
    if (!singleAPI) return;

    const newExampleList =
      singleAPI.metaData?.examples?.filter((e) => e.endpoint === singleEndpoint) || [];
    setExampleList(newExampleList);
  }, [singleAPI, singleEndpoint]);

  useEffect(() => {
    const api = apiList.filter((a) => a.name === id)[0];
    setSingleEndpoint(api?.endpoints[0]);
    setSingleAPI(api);
  }, [id, apiList]);

  useEffect(() => {
    if (singleAPI?.link) {
      setThisApiEndpoint(`${URLS.API_LINK}/${singleAPI.link}/${singleEndpoint}`);
      const sample = `import {useEffect, useState} from 'react';

export default function App() {
  const [data, setData] = useState("");
  const getData = async () => {
    const resp = await fetch('${URLS.API_LINK}/${singleAPI.link}/${singleEndpoint}');
    const json = await resp.json();
    setData(json);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}`;
      setCodeSample(sample);
    }
  }, [singleAPI, singleEndpoint]);

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
        <p>
          Endpoint:
          <a className="link" href={thisApiEndpoint} target="_blank" rel="noreferrer">
            <span>{thisApiEndpoint}</span>
            <FontAwesomeIcon icon={faLink} />
          </a>
        </p>
      </header>
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">All other available endpoints</h3>
          <APIEndpoints
            urlBase={singleAPI.link}
            endpoints={singleAPI.endpoints}
            onEndpointSelect={setSingleEndpoint}
          />
        </div>
        <div className="section-body">
          <Sandpack
            template="react"
            theme={nightOwl}
            options={{
              // autorun: false,
            }}
            files={{
              "/App.js": codeSample,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default APIDetails;
