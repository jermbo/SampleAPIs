import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { APIData } from "../utils/Interfaces";
import APICard from "./APICard";

const AllAPIs: React.FC = () => {
  const { apiList } = useContext(GlobalContext);
  const [filteredAPI, setFilteredAPI] = useState([] as APIData[]);

  useEffect(() => {
    setFilteredAPI(apiList);
  }, [apiList]);

  const filterData = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "all") {
      setFilteredAPI(apiList);
    } else {
      setFilteredAPI(apiList.filter((api) => api.metaData.categories.includes(val)));
    }
  };

  const searchAPIName = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = new RegExp(e.target.value, "gi");
    const matches = apiList.filter((api) => {
      return api.metaData.title.match(regex);
    });
    setFilteredAPI(matches);
  };

  return (
    <div className="home-page-featured">
      <h2 className="home-page-featured__title">All APIs</h2>
      <select onChange={filterData}>
        <option value="all">All</option>
        <option value="cartoon">Cartoon</option>
      </select>
      <input type="text" onChange={searchAPIName} />
      <div className="api-cards">
        {filteredAPI &&
          filteredAPI.map((api) => (
            <>
              <APICard key={api.metaData.title} api={api} />
            </>
          ))}
        {!filteredAPI.length && <h3>Sorry, no matches found.</h3>}
      </div>
    </div>
  );
};

export default AllAPIs;
