import { faLink, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { APIData } from "../../utils/Interfaces";
import APICategories from "../APICategories/APICategories";

const featuredCardClassName = (featured: boolean): string => {
  if (featured) return "api-card -featured";
  return "api-card";
};

interface Props {
  api: APIData;
}

const APICard = ({ api }: Props) => {
  const featured = api.metaData.featured;

  return (
    <article className={featuredCardClassName(featured)}>
      <div className="api-card__inner">
        <APICategories categories={api.metaData.categories} />
        <header className="api-card__header">
          <Link className="btn noleftmargin" to="/api-list/$id" params={{ id: api.link }}>
            <h2 className="api-card__title">{api.metaData.title}</h2>&nbsp;
            <FontAwesomeIcon icon={faLink} />
          </Link>
          {featured && (
            <span className="featured-icon">
              <FontAwesomeIcon icon={faStar} />
            </span>
          )}
        </header>
        <div className="api-card__desc">
          <p className="api-card__text">{api.metaData.desc}</p>
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
        </div>
      </div>
    </article>
  );
};

export default APICard;
