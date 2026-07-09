import React, { Suspense, lazy, useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import APICategories from "../../components/APICategories/APICategories";
import APIEndpoints from "../../components/Endpoints/Endpoints";
import { useApiList } from "../../hooks/useApiList";
import { URLS } from "../../utils/Config";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./APIDetails.css";

// The Playground pulls in CodeMirror, which is a heavy chunk. Loading it lazily
// keeps it out of the initial bundle for this route until it's actually rendered.
const Playground = lazy(() => import("../../components/Playground/Playground"));

const APIDetails: React.FC = () => {
  const { id } = useParams({ from: "/api-list/$id" });
  const { data: apiList = [], isLoading, isError } = useApiList();
  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  const singleAPI = useMemo(() => apiList.find((a) => a.name === id), [apiList, id]);

  const activeEndpoint = selectedEndpoint || singleAPI?.endpoints[0] || "";
  const endpointUrl = singleAPI?.link
    ? `${URLS.API_LINK}/${singleAPI.link}/${activeEndpoint}`
    : "";

  if (isLoading) {
    return (
      <section className="page -api-details">
        <p role="status">Loading…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="page -api-details">
        <h2 className="page-header__title">Something went wrong</h2>
        <p className="page-header__desc">
          We couldn&rsquo;t load the API list. Please try again in a moment.
        </p>
        <Link className="btn" to="/api-list">
          Back to List
        </Link>
      </section>
    );
  }

  if (!singleAPI?.metaData) {
    return (
      <section className="page -api-details">
        <h2 className="page-header__title">API not found</h2>
        <p className="page-header__desc">
          There is no API matching &ldquo;{id}&rdquo;.
        </p>
        <Link className="btn" to="/api-list">
          Back to List
        </Link>
      </section>
    );
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
          <a className="link" href={endpointUrl} target="_blank" rel="noreferrer">
            <span>{endpointUrl}</span>
            <FontAwesomeIcon icon={faLink} />
          </a>
        </p>
      </header>
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">All other available endpoints</h3>
          <APIEndpoints endpoints={singleAPI.endpoints} onEndpointSelect={setSelectedEndpoint} />
        </div>
        <div className="section-body">
          <Suspense fallback={<p role="status">Loading playground…</p>}>
            <Playground url={endpointUrl} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default APIDetails;
