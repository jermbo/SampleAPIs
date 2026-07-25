import React, { useMemo, useState } from "react";
import { deriveShape } from "../../utils/deriveShape";
import { useSampleRecords } from "../../hooks/useSampleRecords";
import FilterRow from "./FilterRow";
import SortControl from "./SortControl";
import PaginationControls from "./PaginationControls";
import UrlBar from "./UrlBar";
import QueryPreview from "./QueryPreview";
import {
  EMPTY_QUERY,
  buildQueryString,
  queryableFields,
  type FilterClause,
  type QueryState,
} from "./queryState";

interface Props {
  /** Active endpoint URL. The host remounts this component per endpoint (key). */
  url: string;
  /** Loads a fetch snippet for the composed URL into the Playground. */
  onSendToPlayground: (fullUrl: string) => void;
}

const NEW_FILTER: FilterClause = { field: "", op: "eq", value: "" };

/** The Query tab: compose filter/sort/pagination visually, watch the URL follow. */
const QueryBuilder: React.FC<Props> = ({ url, onSendToPlayground }) => {
  const { data: sample, isLoading, isError } = useSampleRecords(url, true);
  const fields = useMemo(() => queryableFields(deriveShape(sample?.records ?? [])), [sample]);
  const [state, setState] = useState<QueryState>(EMPTY_QUERY);

  if (isLoading) return <p className="explore__status" role="status">Sampling endpoint…</p>;
  if (isError || !sample) return <p className="explore__status">Could not sample this endpoint.</p>;
  if (sample.isSingular)
    return (
      <p className="explore__status">
        This endpoint returns a single object — filtering, sorting, and pagination apply to
        collections.
      </p>
    );

  const fullUrl = url + buildQueryString(state);

  const updateFilter = (index: number, clause: FilterClause) =>
    setState((s) => ({ ...s, filters: s.filters.map((f, i) => (i === index ? clause : f)) }));
  const addFilter = () => setState((s) => ({ ...s, filters: [...s.filters, NEW_FILTER] }));
  const removeFilter = (index: number) =>
    setState((s) => ({ ...s, filters: s.filters.filter((_, i) => i !== index) }));

  return (
    <div className="qb">
      <div className="qb__controls">
        <fieldset className="qb__group">
          <legend>Filter</legend>
          {state.filters.map((clause, i) => (
            <FilterRow
              key={i}
              clause={clause}
              fields={fields}
              onChange={(next) => updateFilter(i, next)}
              onRemove={() => removeFilter(i)}
            />
          ))}
          <button className="btn" onClick={addFilter}>
            + Add filter
          </button>
          <label className="qb-row__label -grow">
            Search all fields (q)
            <input
              className="qb-row__control"
              type="text"
              placeholder="e.g. bender"
              value={state.q}
              onChange={(e) => setState((s) => ({ ...s, q: e.target.value }))}
            />
          </label>
        </fieldset>
        <fieldset className="qb__group">
          <legend>Sort</legend>
          <SortControl
            sort={state.sort}
            fields={fields}
            onChange={(sort) => setState((s) => ({ ...s, sort }))}
          />
        </fieldset>
        <fieldset className="qb__group">
          <legend>Paginate</legend>
          <PaginationControls
            page={state.page}
            limit={state.limit}
            onPageChange={(page) => setState((s) => ({ ...s, page }))}
            onLimitChange={(limit) => setState((s) => ({ ...s, limit }))}
          />
        </fieldset>
      </div>

      <UrlBar fullUrl={fullUrl} />
      <div className="qb__actions">
        <button className="btn" onClick={() => onSendToPlayground(fullUrl)}>
          Send to Playground
        </button>
      </div>
      <QueryPreview url={fullUrl} />
    </div>
  );
};

export default QueryBuilder;
