import type { ShapeNode } from "../../utils/deriveShape";

/**
 * The Query Builder's state model and its one pure output: the query string.
 * Mirrors the server contract in server/utils/jsonRouter.js — the builder
 * must never render a control the server doesn't honor.
 */

export type FilterOp = "eq" | "gte" | "lte" | "ne" | "like";

export interface FilterClause {
  field: string;
  op: FilterOp;
  value: string;
}

export type SortDir = "asc" | "desc";

export interface QueryState {
  filters: FilterClause[];
  /** Full-text search across the whole record (`q`). */
  q: string;
  sort: { field: string; dir: SortDir } | null;
  /** Blank inputs mean "no pagination params". */
  page: string;
  limit: string;
}

export const EMPTY_QUERY: QueryState = {
  filters: [],
  q: "",
  sort: null,
  page: "",
  limit: "",
};

export const OP_LABELS: Record<FilterOp, string> = {
  eq: "equals",
  gte: "≥ (gte)",
  lte: "≤ (lte)",
  ne: "≠ (ne)",
  like: "contains (like)",
};

const paramName = (clause: FilterClause): string =>
  clause.op === "eq" ? clause.field : `${clause.field}_${clause.op}`;

const isComplete = (clause: FilterClause): boolean =>
  clause.field !== "" && clause.value.trim() !== "";

/** `?name.first=Bender&_sort=…` — empty string when nothing is set. */
export const buildQueryString = (state: QueryState): string => {
  const params = new URLSearchParams();
  for (const clause of state.filters.filter(isComplete)) {
    params.append(paramName(clause), clause.value.trim());
  }
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.sort) {
    params.set("_sort", state.sort.field);
    params.set("_order", state.sort.dir);
  }
  if (state.page.trim()) params.set("_page", state.page.trim());
  if (state.limit.trim()) params.set("_limit", state.limit.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const hasAnyQuery = (state: QueryState): boolean => buildQueryString(state) !== "";

/**
 * Fields the builder can filter and sort on: primitive-typed paths reachable
 * by dot-path from the record root. Paths inside arrays (`crew[].name`) are
 * excluded — the server's dot-path lookup cannot address array elements.
 */
export interface QueryField {
  path: string;
  /** Drives input affordances: number fields get numeric inputs. */
  isNumeric: boolean;
  coverage: number;
}

const PRIMITIVE_TYPES = new Set(["string", "number", "boolean"]);

const isQueryable = (node: ShapeNode): boolean =>
  !node.path.includes("[]") && node.types.some((t) => PRIMITIVE_TYPES.has(t));

const toQueryField = (node: ShapeNode): QueryField => ({
  path: node.path,
  isNumeric: node.types.includes("number"),
  coverage: node.total > 0 ? node.count / node.total : 0,
});

export const queryableFields = (shape: ShapeNode[]): QueryField[] => {
  const collect = (nodes: ShapeNode[]): QueryField[] =>
    nodes.flatMap((node) => [
      ...(isQueryable(node) ? [toQueryField(node)] : []),
      ...collect(node.children),
    ]);
  return collect(shape).sort((a, b) => b.coverage - a.coverage || a.path.localeCompare(b.path));
};
