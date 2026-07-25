import {
  displayUrl,
  explainFailure,
  formatSize,
  netStatusLabel,
  statusClass,
  type NetRow,
} from "./netUtils";
import PlaygroundNetworkHeaders from "./PlaygroundNetworkHeaders";

interface Props {
  row: NetRow;
  activeUrl: string;
  expanded: boolean;
  showAllHeaders: boolean;
  onToggleExpanded: () => void;
  onToggleShowAllHeaders: () => void;
}

const PlaygroundNetworkRow = ({
  row,
  activeUrl,
  expanded,
  showAllHeaders,
  onToggleExpanded,
  onToggleShowAllHeaders,
}: Props) => {
  const explainer = explainFailure(row);

  return (
    <div className="playground__net-row-wrap">
      <button className="playground__net-row" onClick={onToggleExpanded}>
        <span className="playground__net-method">{row.method}</span>
        <span className="playground__net-url">{displayUrl(row.url, activeUrl)}</span>
        <span className={`playground__net-status ${statusClass(row)}`}>
          {netStatusLabel(row)}
        </span>
        <span className="playground__net-meta">
          {row.ms !== undefined ? `${row.ms} ms` : ""}
        </span>
        <span className="playground__net-meta">{formatSize(row.size)}</span>
      </button>
      {expanded && (
        <div className="playground__net-detail">
          <div className="playground__net-full-url">{row.url}</div>
          {row.message && <div className="playground__net-error">{row.message}</div>}
          {explainer && <div className="playground__net-explainer">{explainer}</div>}
          <PlaygroundNetworkHeaders
            row={row}
            showAll={showAllHeaders}
            onToggleShowAll={onToggleShowAllHeaders}
          />
        </div>
      )}
    </div>
  );
};

export default PlaygroundNetworkRow;
