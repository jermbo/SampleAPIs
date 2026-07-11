import React from "react";

interface Props {
  page: string;
  limit: string;
  onPageChange: (page: string) => void;
  onLimitChange: (limit: string) => void;
}

/** `_page` / `_limit` inputs; blank means the param stays out of the URL. */
const PaginationControls: React.FC<Props> = ({ page, limit, onPageChange, onLimitChange }) => (
  <div className="qb-row">
    <label className="qb-row__label">
      Page
      <input
        className="qb-row__control -narrow"
        type="number"
        min="1"
        placeholder="—"
        value={page}
        onChange={(e) => onPageChange(e.target.value)}
      />
    </label>
    <label className="qb-row__label">
      Per page
      <input
        className="qb-row__control -narrow"
        type="number"
        min="1"
        placeholder="10"
        value={limit}
        onChange={(e) => onLimitChange(e.target.value)}
      />
    </label>
  </div>
);

export default PaginationControls;
