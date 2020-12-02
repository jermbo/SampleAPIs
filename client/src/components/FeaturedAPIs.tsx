import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { APIData } from "../utils/Interfaces";
import APIBox from "./APIBox";

const FeaturedAPIs: React.FC = () => {
  const { apiList } = useContext(GlobalContext);
  const [featuredList, setFeaturedList] = useState<APIData[]>([]);

  useEffect(() => {
    const featured = apiList.filter((api) => api.metaData.featured);
    const randomized = featured.sort((api) => (Math.random() > 0.5 ? 1 : -1));
    setFeaturedList(randomized);
  }, [apiList]);

  return (
    <div className="featured">
      <h3>Featured APIs</h3>
      <hr />
      {featuredList &&
        featuredList.map((api) => (
          <>
            <APIBox key={api.name} api={api} />
          </>
        ))}
    </div>
  );
};

export default FeaturedAPIs;
