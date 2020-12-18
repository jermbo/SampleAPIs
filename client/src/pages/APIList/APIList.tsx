import React, { useContext } from "react";
import APICard from "../../components/APICard/APICard";
import { GlobalContext } from "../../context/GlobalContext";

interface Props {}

const APIList: React.FC<Props> = () => {
  const { apiList } = useContext(GlobalContext);
  console.log(apiList);

  return (
    <div className="page -api-list">
      <div className="page-header">
        <h2 className="page-header__title">API List</h2>
        <p className="page-header__desc">
          Sample APIs has a growing list of endpoints. Perfect for any learning project.
        </p>
      </div>
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">
            All <abbr title="Application Program Interface">API</abbr>s
          </h3>
        </div>
        <div className="cards-grid">
          {apiList &&
            apiList.map((api) => (
              <APICard key={api.metaData.title} featured={api.metaData.featured} api={api} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default APIList;
