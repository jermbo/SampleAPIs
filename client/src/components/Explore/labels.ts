import type { ShapeNode } from "../../utils/deriveShape";

/** Named display decisions for the Explore panel — no unnamed branches in markup. */

export const exploreCaret = (open: boolean): string => (open ? "▾" : "▸");

export const exploreTabClassName = (active: boolean): string =>
  active ? "explore__tab -active" : "explore__tab";

export const sampleLabel = (count: number, isSingular: boolean): string => {
  if (isSingular) return "Based on this endpoint's single object";
  return count === 1 ? "Based on the only record" : `Based on the first ${count} records`;
};

export const copyButtonLabel = (copied: boolean, label: string): string =>
  copied ? "Copied!" : label;

export const formatTypes = (node: ShapeNode): string => node.types.join(" | ");

const EXAMPLE_MAX_CHARS = 40;

export const formatExample = (example: unknown): string => {
  const text = typeof example === "string" ? `"${example}"` : JSON.stringify(example) ?? "";
  return text.length > EXAMPLE_MAX_CHARS ? `${text.slice(0, EXAMPLE_MAX_CHARS)}…` : text;
};

export const coverageLabel = (node: ShapeNode): string => `${node.count}/${node.total}`;

export const coveragePercent = (node: ShapeNode): number =>
  node.total === 0 ? 0 : Math.round((node.count / node.total) * 100);

const recordCount = (n: number): string => (n === 1 ? "1 record" : `${n} records`);

/** "Showing 10 of 42 records" — the X-Total-Count lesson in one line. */
export const resultSummary = (data: unknown, total: number | null): string => {
  if (!Array.isArray(data)) return "1 object";
  if (total === null || total === data.length) return recordCount(data.length);
  return `Showing ${data.length} of ${total} records`;
};
