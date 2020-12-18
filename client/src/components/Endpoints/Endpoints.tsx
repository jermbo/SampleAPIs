import React from "react";
import { URLS } from "../../utils/Config";

interface Props {
  urlBase: string;
  endpoints: string[];
}

const APIEndpoints: React.FC<Props> = ({ urlBase, endpoints }) => {
  return (
    <ul className="api-endpoints">
      <li className="api-endpoint">
        <a
          href={`${URLS.API_LINK}/${urlBase}/graphql`}
          className="btn"
          target="_blank"
          rel="noreferrer"
        >
          GraphQL
        </a>
      </li>
      {endpoints.map((endpoint) => (
        <li key={endpoint} className="api-endpoint">
          <a
            href={`${URLS.API_LINK}/${urlBase}/${endpoint}`}
            className="btn"
            target="_blank"
            rel="noreferrer"
          >
            {endpoint}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default APIEndpoints;
