import React from "react";
import JsonTree from "../Playground/JsonTree";
import { useQueryPreview } from "../../hooks/useQueryPreview";
import { resultSummary } from "./labels";

interface Props {
  /** The composed URL to preview; fetching is debounced inside the hook. */
  url: string;
}

/** Live results for the composed query, with the X-Total-Count summary line. */
const QueryPreview: React.FC<Props> = ({ url }) => {
  const { data: preview, isPending, isFetching, isError, error } = useQueryPreview(url, true);

  if (isPending) return <p className="explore__status" role="status">Loading results…</p>;
  if (isError) return <p className="explore__status">{error.message}</p>;

  return (
    <div className="qb-preview">
      <p className="qb-preview__summary" role="status">
        {resultSummary(preview.data, preview.total)}
        {isFetching && <span className="qb-preview__spinner"> · updating…</span>}
      </p>
      <div className="qb-preview__tree">
        <JsonTree value={preview.data} />
      </div>
    </div>
  );
};

export default QueryPreview;
