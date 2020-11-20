import React from 'react';
import EndPoint from './Endpoint';

const Endpoints = ({ endpoints }) => {

  return (
    <section className="apis">
      {endpoints.map(endpoint => <EndPoint data={endpoint} />)}
    </section>
  )
}

export default Endpoints;
