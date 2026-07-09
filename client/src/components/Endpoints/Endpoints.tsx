import React, { Dispatch, SetStateAction, useState } from "react";

interface Props {
  endpoints: string[];
  onEndpointSelect: Dispatch<SetStateAction<string>>;
}

const APIEndpoints: React.FC<Props> = ({ endpoints, onEndpointSelect }) => {
  const [selected, setSelected] = useState("initialState");

  const showCode = (endpoint: string) => {
    console.log(endpoint, selected);
    if (endpoint === selected) {
      console.log("open now window");
    } else {
      setSelected(endpoint);
      onEndpointSelect(endpoint);
    }
  };

  return (
    <ul className="api-endpoints">
      {endpoints.map((endpoint) => (
        <li key={endpoint} className={`api-endpoint ${selected === endpoint ? "-selected" : ""}`}>
          <button
            // href={`${URLS.API_LINK}/${urlBase}/${endpoint}`}
            onClick={() => showCode(endpoint)}
            className="btn"
          >
            {endpoint}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default APIEndpoints;
