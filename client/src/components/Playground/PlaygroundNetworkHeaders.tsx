import { CURATED_HEADERS, type NetRow } from "./netUtils";

interface Props {
  row: NetRow;
  showAll: boolean;
  onToggleShowAll: () => void;
}

const PlaygroundNetworkHeaders = ({ row, showAll, onToggleShowAll }: Props) => {
  const headers = row.headers ?? {};
  const keys = Object.keys(headers);
  if (keys.length === 0) return null;

  const curated = keys.filter((k) => CURATED_HEADERS.includes(k.toLowerCase()));
  const shown = showAll || curated.length === 0 ? keys : curated;
  const hasMore = !showAll && curated.length > 0 && keys.length > curated.length;

  return (
    <table className="playground__net-headers">
      <tbody>
        {shown.map((k) => (
          <tr key={k}>
            <td className="playground__net-header-key">{k}</td>
            <td>{headers[k]}</td>
          </tr>
        ))}
        {hasMore && (
          <tr>
            <td colSpan={2}>
              <button className="playground__net-more" onClick={onToggleShowAll}>
                Show all {keys.length} headers
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PlaygroundNetworkHeaders;
