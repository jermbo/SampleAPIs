import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import APICard from "../../components/APICard/APICard";
import APIFilter from "../../components/APIFilter/APIFilter";
import APISearch from "../../components/APISearch/APISearch";
import { GlobalContext } from "../../context/GlobalContext";

interface Props {}

const APIList: React.FC<Props> = () => {
  const { apiList, apiCategories } = useContext(GlobalContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchWord, setSearchWord] = useState("");
  const [filteredList, setFilteredList] = useState(apiList);

  useEffect(() => {
    const categories = apiList.filter((api) =>
      selectedCategory === "all" ? true : api.metaData.categories.includes(selectedCategory),
    );

    const regex = new RegExp(searchWord, "gi");
    const matches = categories.filter((api) => {
      return api.metaData.title.match(regex);
    });
    setFilteredList(matches);
  }, [apiList, selectedCategory, searchWord]);

  const filterData = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategory(e.target.value);
  };

  const searchAPIName = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchWord(e.target.value);
  };

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
          <div className="actions">
            <APISearch onChangeHandler={searchAPIName} />
            <APIFilter onChangeHandler={filterData} categories={apiCategories} />
          </div>
        </div>
        <div className="cards-grid">
          {filteredList &&
            filteredList.map((api) => (
              <APICard key={api.metaData.title} featured={api.metaData.featured} api={api} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default APIList;
