import React from "react";
import EndPoint from "./Endpoint";

const Endpoints = ({ endpoints }: any) => {
  return (
    <section className="apis">
      {endpoints.map((endpoint: any) => (
        <EndPoint key={endpoint.name} data={endpoint} />
      ))}
    </section>
  );
};

export default Endpoints;
