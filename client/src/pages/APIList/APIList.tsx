import React, { ChangeEvent, useMemo, useState } from "react";
import APICard from "../../components/APICard/APICard";
import APIFilter from "../../components/APIFilter/APIFilter";
import APISearch from "../../components/APISearch/APISearch";
import PageHeaderActions from "../../components/PageHeaderActions/PageHeaderActions";
import { useApiCategories, useApiList } from "../../hooks/useApiList";

interface Props {}

const APIList: React.FC<Props> = () => {
  const { data: apiList = [] } = useApiList();
  const { data: apiCategories = [] } = useApiCategories();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchWord, setSearchWord] = useState("");

  // Derived, not stored in state, to avoid an extra render pass. The search is a
  // plain case-insensitive substring match rather than `new RegExp(userInput)`,
  // which would let a pathological pattern hang the browser tab (ReDoS) or throw.
  const filteredList = useMemo(() => {
    const needle = searchWord.trim().toLowerCase();
    return apiList.filter((api) => {
      const matchesCategory =
        selectedCategory === "all" || api.metaData.categories.includes(selectedCategory);
      const matchesSearch =
        needle === "" || api.metaData.title.toLowerCase().includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [apiList, selectedCategory, searchWord]);

  const filterData = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategory(e.target.value);
  };

  const searchAPIName = (e: ChangeEvent<HTMLInputElement>): void => {
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
        <PageHeaderActions currentPage="api-list" />
      </div>
      <section className="section">
        <div className="section-header">
          <h3 className="section-title">
            {filteredList.length} <abbr title="Application Program Interface">API</abbr>s
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
    </section>
  );
};

export default APIList;
