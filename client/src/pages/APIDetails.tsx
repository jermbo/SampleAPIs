import React from "react";
import { useParams, Link } from "react-router-dom";

interface ParamTypes {
  id: string;
}

const APIDetails: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  return (
    <>
      <Link to="/api-list">Back to List</Link>
      <h1>API details Page: -{id}-</h1>
    </>
  );
};

export default APIDetails;
