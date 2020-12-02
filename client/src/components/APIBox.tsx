import React from "react";
import { Link } from "react-router-dom";
import { APIData } from "../utils/Interfaces";

type Props = {
  api: APIData;
  featured?: boolean;
};

const APIBox: React.FC<Props> = ({ api, featured = false }) => {
  return (
    <article className={`api ${featured ? "-featured" : ""}`}>
      <h2>{api.name}</h2>
      <p>{api.metaData.desc}</p>
      <Link className="btn" to={`api-list/${api.link}`}>
        Details {api.link}
      </Link>
    </article>
  );
};

export default APIBox;
