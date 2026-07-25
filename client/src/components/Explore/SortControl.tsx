import React from "react";
import type { QueryField, QueryState, SortDir } from "./queryState";

interface Props {
  sort: QueryState["sort"];
  fields: QueryField[];
  onChange: (sort: QueryState["sort"]) => void;
}

/** Single-field sort: `_sort` + `_order` (Query Builder D2 keeps multi-sort out). */
const SortControl: React.FC<Props> = ({ sort, fields, onChange }) => {
  const selectField = (field: string) =>
    onChange(field === "" ? null : { field, dir: sort?.dir ?? "asc" });

  const selectDir = (dir: SortDir) => {
    if (sort) onChange({ ...sort, dir });
  };

  return (
    <div className="qb-row">
      <select
        className="qb-row__control"
        aria-label="Sort field"
        value={sort?.field ?? ""}
        onChange={(e) => selectField(e.target.value)}
      >
        <option value="">No sorting</option>
        {fields.map((f) => (
          <option key={f.path} value={f.path}>
            {f.path}
          </option>
        ))}
      </select>
      <select
        className="qb-row__control"
        aria-label="Sort direction"
        value={sort?.dir ?? "asc"}
        disabled={!sort}
        onChange={(e) => selectDir(e.target.value as SortDir)}
      >
        <option value="asc">ascending</option>
        <option value="desc">descending</option>
      </select>
    </div>
  );
};

export default SortControl;
