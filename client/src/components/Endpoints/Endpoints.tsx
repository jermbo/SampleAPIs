import { endpointClassName } from "./endpointClassName";

interface Props {
  endpoints: string[];
  selected: string;
  onSelect: (endpoint: string) => void;
}

const APIEndpoints = ({ endpoints, selected, onSelect }: Props) => {
  return (
    <ul className="api-endpoints">
      {endpoints.map((endpoint) => (
        <li key={endpoint} className={endpointClassName(selected === endpoint)}>
          <button onClick={() => onSelect(endpoint)} className="btn">
            {endpoint}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default APIEndpoints;
