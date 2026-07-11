import type { APIData } from "./Interfaces";

interface FilterOptions {
  category: string;
  search: string;
}

/** Case-insensitive substring match — avoids `new RegExp(userInput)` (ReDoS / throws). */
export const filterApiList = (list: APIData[], { category, search }: FilterOptions): APIData[] => {
  const needle = search.trim().toLowerCase();
  return list.filter((api) => {
    const matchesCategory =
      category === "all" || api.metaData.categories.includes(category);
    const matchesSearch = needle === "" || api.metaData.title.toLowerCase().includes(needle);
    return matchesCategory && matchesSearch;
  });
};
