import React from "react";
import { Link } from "react-router-dom";
import { APIData } from "../utils/Interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

type Props = {
  api: APIData;
  featured?: boolean;
};

const APICard: React.FC<Props> = ({ api, featured = false }) => {
  return (
    <article className={`api-card ${featured ? "-featured" : ""}`}>
      <div className="api-card__desc">
        <ul className="api-card__categories">
          {api.metaData.categories.map((category) => (
            <li key={category} className="api-card__category">
              {category}
            </li>
          ))}
        </ul>
        <div className="api-card__header">
          <h2 className="h4 api-card__title">{api.metaData.title}</h2>
          <Link
            className="btn -link"
            type="button"
            title={`View ${api.metaData.title} Details Page`}
            to={`api-list/${api.link}`}
          >
            <FontAwesomeIcon icon={faLink} />
          </Link>
        </div>
        <p className="api-card__desc">{api.metaData.desc}</p>
      </div>
      <details className="api-card__endpoints">
        <summary>See available endpoints</summary>
        <ul>
          {api.endpoints.map((endpoint) => (
            <li key={endpoint} className="api-card__endpoint">
              {endpoint}
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
};

export default APICard;
