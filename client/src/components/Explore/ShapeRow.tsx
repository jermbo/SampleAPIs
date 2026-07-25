import React, { useState } from "react";
import type { ShapeNode } from "../../utils/deriveShape";
import { coverageLabel, coveragePercent, exploreCaret, formatExample, formatTypes } from "./labels";

interface Props {
  node: ShapeNode;
  depth: number;
  /** Hidden for singular resources, where a 1/1 denominator teaches nothing. */
  showCoverage: boolean;
}

/** One field of the shape table; nested fields render as collapsible child rows. */
const ShapeRow: React.FC<Props> = ({ node, depth, showCoverage }) => {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <>
      <tr className="shape-row">
        <td className="shape-row__field" style={{ paddingLeft: `${depth * 1.25}rem` }}>
          {hasChildren ? (
            <button
              className="shape-row__toggle"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              <span className="shape-row__caret">{exploreCaret(open)}</span>
              {node.key}
            </button>
          ) : (
            <span className="shape-row__name">{node.key}</span>
          )}
        </td>
        <td className="shape-row__types">{formatTypes(node)}</td>
        {showCoverage && (
          <td className="shape-row__coverage">
            <span className="shape-row__coverage-bar">
              <span
                className="shape-row__coverage-fill"
                style={{ width: `${coveragePercent(node)}%` }}
              />
            </span>
            {coverageLabel(node)}
          </td>
        )}
        <td className="shape-row__example">{formatExample(node.example)}</td>
      </tr>
      {open &&
        node.children.map((child) => (
          <ShapeRow key={child.path} node={child} depth={depth + 1} showCoverage={showCoverage} />
        ))}
    </>
  );
};

export default ShapeRow;
