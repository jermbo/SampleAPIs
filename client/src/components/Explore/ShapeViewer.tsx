import React, { useMemo } from "react";
import { deriveShape } from "../../utils/deriveShape";
import { toTypeScript } from "../../utils/toTypeScript";
import { useSampleRecords } from "../../hooks/useSampleRecords";
import ShapeRow from "./ShapeRow";
import { copyButtonLabel, sampleLabel } from "./labels";
import { useCopied } from "./useCopied";

interface Props {
  /** Active endpoint URL — the identity everything here derives from. */
  url: string;
  /** Endpoint name; names the copied TypeScript interface. */
  endpoint: string;
}

/** The Shape tab: what fields this endpoint's records have, honestly sampled. */
const ShapeViewer: React.FC<Props> = ({ url, endpoint }) => {
  const { data: sample, isLoading, isError } = useSampleRecords(url, true);
  const shape = useMemo(() => deriveShape(sample?.records ?? []), [sample]);
  const { copied, copy } = useCopied();

  if (isLoading) return <p className="explore__status" role="status">Sampling endpoint…</p>;
  if (isError || !sample) return <p className="explore__status">Could not sample this endpoint.</p>;
  if (shape.length === 0)
    return <p className="explore__status">No fields to describe — this endpoint returns primitives.</p>;

  const showCoverage = !sample.isSingular;

  return (
    <div className="shape-viewer">
      <div className="shape-viewer__meta">
        <span className="explore__hint">{sampleLabel(sample.records.length, sample.isSingular)}</span>
        <button className="btn" onClick={() => copy(toTypeScript(shape, endpoint))}>
          {copyButtonLabel(copied, "Copy as TypeScript")}
        </button>
      </div>
      <table className="shape-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            {showCoverage && <th>Coverage</th>}
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {shape.map((node) => (
            <ShapeRow key={node.path} node={node} depth={0} showCoverage={showCoverage} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShapeViewer;
