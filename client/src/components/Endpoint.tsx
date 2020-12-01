import React from "react";

const Endpoint = ({ data }: any) => {
  return (
    <article className="api">
      <div className="api__inner">
        <h2 className="api__title">{data.metaData.title}</h2>
        <p className="api__desc">{data.metaData.desc}</p>
        <a className="api__link" href={data.link}>
          API List
        </a>
        <a className="api__link" href={`${data.link}/graphql`}>
          GraphQL
        </a>
      </div>
    </article>
  );
};

export default Endpoint;
