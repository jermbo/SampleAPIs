import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { APIData } from "../utils/Interfaces";
import APICard from "./APICard";

const FeaturedAPIs: React.FC = () => {
  const { apiList } = useContext(GlobalContext);
  const [featuredList, setFeaturedList] = useState<APIData[]>([]);

  useEffect(() => {
    const featured = apiList.filter((api) => api.metaData.featured);
    const randomized = featured.sort((api) => (Math.random() > 0.5 ? 1 : -1));
    setFeaturedList(randomized);
  }, [apiList]);

  return (
    <div className="home-page-featured">
      <h3 className="home-page-featured__title">Featured APIs</h3>
      <div className="api-cards">
        {featuredList &&
          featuredList.map((api) => (
            <>
              <APICard key={api.metaData.title} featured api={api} />
            </>
          ))}
        {!apiList.length && <p>No APIs found</p>}
      </div>
    </div>
  );
};

export default FeaturedAPIs;
