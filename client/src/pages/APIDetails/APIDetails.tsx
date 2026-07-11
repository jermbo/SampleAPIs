import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import APICategories from "../../components/APICategories/APICategories";
import APIEndpoints from "../../components/Endpoints/Endpoints";
import { useApiList } from "../../hooks/useApiList";
import { buildEndpointUrl, defaultEndpoint, findApiByName } from "../../utils/apiEndpoints";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApiDetailsLoading from "./ApiDetailsLoading";
import ApiDetailsError from "./ApiDetailsError";
import ApiNotFound from "./ApiNotFound";
import ApiLearnBanners from "./ApiLearnBanners";
import "./APIDetails.css";

const Playground = lazy(() => import("../../components/Playground/Playground"));

const APIDetails = () => {
  const { id } = useParams({ from: "/api-list/$id" });
  const { data: apiList = [], isLoading, isError } = useApiList();
  const api = useMemo(() => findApiByName(apiList, id), [apiList, id]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  useEffect(() => {
    if (api) setSelectedEndpoint(defaultEndpoint(api));
  }, [api]);

  if (isLoading) return <ApiDetailsLoading />;
  if (isError) return <ApiDetailsError />;
  if (!api?.metaData) return <ApiNotFound id={id} />;

  const endpointUrl = buildEndpointUrl(api, selectedEndpoint);

  return (
    <section className="page -api-details">
      <header className="page-header">
        <Link className="btn" to="/api-list">
          Back to List
        </Link>
        <h2 className="page-header__title">{api.metaData.title}</h2>
        <APICategories categories={api.metaData.categories} />
        <p className="page-header__desc">{api.metaData.longDesc}</p>
        <p>
          Endpoint:
          <a className="link" href={endpointUrl} target="_blank" rel="noreferrer">
            <span>{endpointUrl}</span>
            <FontAwesomeIcon icon={faLink} />
          </a>
        </p>
        <ApiLearnBanners api={api} />
      </header>
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">All other available endpoints</h3>
          <APIEndpoints
            endpoints={api.endpoints}
            selected={selectedEndpoint}
            onSelect={setSelectedEndpoint}
          />
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
