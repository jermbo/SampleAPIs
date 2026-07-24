import React, { Dispatch, SetStateAction, useState } from "react";

interface Props {
  endpoints: string[];
  onEndpointSelect: Dispatch<SetStateAction<string>>;
}

const APIEndpoints: React.FC<Props> = ({ endpoints, onEndpointSelect }) => {
  // Default to the first endpoint so the initial selection matches what the
  // parent (APIDetails) pre-selects for the Playground.
  const [selected, setSelected] = useState(endpoints[0] ?? "");

  const selectEndpoint = (endpoint: string) => {
    setSelected(endpoint);
    onEndpointSelect(endpoint);
  };

  return (
    <ul className="api-endpoints">
      {endpoints.map((endpoint) => (
        <li key={endpoint} className={`api-endpoint ${selected === endpoint ? "-selected" : ""}`}>
          <button onClick={() => selectEndpoint(endpoint)} className="btn">
            {endpoint}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default APIEndpoints;
