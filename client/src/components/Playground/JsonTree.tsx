import React, { useState } from "react";

interface Props {
  value: unknown;
  /** Key/index label shown before the value, if any. */
  label?: string;
  /** Depth from the root; nodes deeper than AUTO_OPEN_DEPTH start collapsed. */
  depth?: number;
}

const AUTO_OPEN_DEPTH = 1;

const isContainer = (v: unknown): v is Record<string, unknown> | unknown[] =>
  v !== null && typeof v === "object";

const primitiveClass = (v: unknown) => {
  if (v === null) return "-null";
  switch (typeof v) {
    case "number":
      return "-number";
    case "boolean":
      return "-boolean";
    case "string":
      return "-string";
    default:
      return "-other";
  }
};

const renderPrimitive = (v: unknown) => {
  if (typeof v === "string") return `"${v}"`;
  return String(v);
};

/** Recursive, collapsible view of a JSON-safe value posted back from the sandbox. */
const JsonTree: React.FC<Props> = ({ value, label, depth = 0 }) => {
  const [open, setOpen] = useState(depth < AUTO_OPEN_DEPTH);

  if (!isContainer(value)) {
    return (
      <div className="jsontree__row" style={{ paddingLeft: depth * 14 }}>
        {label !== undefined && <span className="jsontree__key">{label}:</span>}
        <span className={`jsontree__val ${primitiveClass(value)}`}>{renderPrimitive(value)}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const brackets = isArray ? ["[", "]"] : ["{", "}"];
  const summary = isArray ? `${entries.length} items` : `${entries.length} keys`;

  return (
    <div className="jsontree__node">
      <div
        className="jsontree__row -toggle"
        style={{ paddingLeft: depth * 14 }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="jsontree__caret">{open ? "▾" : "▸"}</span>
        {label !== undefined && <span className="jsontree__key">{label}:</span>}
        <span className="jsontree__bracket">{brackets[0]}</span>
        {!open && <span className="jsontree__summary"> {summary} </span>}
        {!open && <span className="jsontree__bracket">{brackets[1]}</span>}
      </div>
      {open && (
        <>
          {entries.map(([k, v]) => (
            <JsonTree key={k} label={k} value={v} depth={depth + 1} />
          ))}
          <div className="jsontree__row" style={{ paddingLeft: depth * 14 }}>
            <span className="jsontree__bracket">{brackets[1]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default JsonTree;
