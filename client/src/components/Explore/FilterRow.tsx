import React from "react";
import { OP_LABELS, type FilterClause, type FilterOp, type QueryField } from "./queryState";

interface Props {
  clause: FilterClause;
  fields: QueryField[];
  onChange: (clause: FilterClause) => void;
  onRemove: () => void;
}

const valueInputType = (clause: FilterClause, fields: QueryField[]): string => {
  const field = fields.find((f) => f.path === clause.field);
  const numericOp = clause.op !== "like";
  return field?.isNumeric && numericOp ? "number" : "text";
};

/** One filter clause: field × operator × value. */
const FilterRow: React.FC<Props> = ({ clause, fields, onChange, onRemove }) => (
  <div className="qb-row">
    <select
      className="qb-row__control"
      aria-label="Filter field"
      value={clause.field}
      onChange={(e) => onChange({ ...clause, field: e.target.value })}
    >
      <option value="">Choose a field…</option>
      {fields.map((f) => (
        <option key={f.path} value={f.path}>
          {f.path}
        </option>
      ))}
    </select>
    <select
      className="qb-row__control"
      aria-label="Filter operator"
      value={clause.op}
      onChange={(e) => onChange({ ...clause, op: e.target.value as FilterOp })}
    >
      {Object.entries(OP_LABELS).map(([op, label]) => (
        <option key={op} value={op}>
          {label}
        </option>
      ))}
    </select>
    <input
      className="qb-row__control -value"
      aria-label="Filter value"
      type={valueInputType(clause, fields)}
      placeholder="Value"
      value={clause.value}
      onChange={(e) => onChange({ ...clause, value: e.target.value })}
    />
    <button className="qb-row__remove" onClick={onRemove} title="Remove filter">
      x
    </button>
  </div>
);

export default FilterRow;
