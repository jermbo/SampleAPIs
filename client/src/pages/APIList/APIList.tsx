import { ChangeEvent, useMemo, useState } from "react";
import APICard from "../../components/APICard/APICard";
import APIFilter from "../../components/APIFilter/APIFilter";
import APISearch from "../../components/APISearch/APISearch";
import PageHeaderActions from "../../components/PageHeaderActions/PageHeaderActions";
import { useApiCategories, useApiList } from "../../hooks/useApiList";
import { filterApiList } from "../../utils/filterApiList";

const APIList = () => {
  const { data: apiList = [] } = useApiList();
  const { data: apiCategories = [] } = useApiCategories();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchWord, setSearchWord] = useState("");

  const filteredList = useMemo(
    () => filterApiList(apiList, { category: selectedCategory, search: searchWord }),
    [apiList, selectedCategory, searchWord]
  );

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategory(e.target.value);
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchWord(e.target.value);
  };

  return (
    <section className="page -api-list">
      <div className="page-header">
        <h2 className="page-header__title">API List</h2>
        <p className="page-header__desc">
          Sample APIs has a growing list of{" "}
          <abbr title="The point of entry to an API">endpoints</abbr>. Perfect for any learning
          project.
        </p>
        <PageHeaderActions />
      </div>
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">
            {filteredList.length} <abbr title="Application Program Interface">API</abbr>s
          </h3>
          <div className="actions">
            <APISearch onChangeHandler={onSearchChange} />
            <APIFilter onChangeHandler={onCategoryChange} categories={apiCategories} />
          </div>
        </div>
        <div className="cards-grid">
          {filteredList.map((api) => (
            <APICard key={api.metaData.title} api={api} />
          ))}
        </div>
      </section>
    </section>
  );
};

export default APIList;
