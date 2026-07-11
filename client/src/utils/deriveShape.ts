/**
 * Derive a field/type shape from a sample of records — the shared core behind
 * the Explore panel's Shape tab and the Query Builder's field picker.
 *
 * Inference rules (chosen so the honest answer is also the teachable one):
 * - Types per path are a set: sometimes-string sometimes-null reports both.
 * - `count / total` is coverage: how many sampled records carry the path at all.
 * - Arrays report element types; arrays of objects recurse into element shapes.
 * - Objects recurse to a depth cap; beyond it they report `object` and stop.
 * - Mixed structural types (sometimes object, sometimes string) report the
 *   union and don't recurse — rare, but real data does it.
 */

export interface ShapeNode {
  /** Dot path from the root; array-element children use `parent[].child`. */
  path: string;
  /** Last path segment, for display. */
  key: string;
  /** Set of type labels seen at this path, sorted for stable output. */
  types: string[];
  /** How many sampled records (or array elements) carry this path. */
  count: number;
  /** Sample size the count is out of. */
  total: number;
  /** First non-null value seen, for the example column. */
  example: unknown;
  children: ShapeNode[];
}

/** Paths are capped at this many segments; deeper values report `object` and stop. */
const MAX_DEPTH = 4;

type PlainObject = Record<string, unknown>;

const isPlainObject = (v: unknown): v is PlainObject =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const elementTypeLabel = (values: unknown[]): string => {
  const labels = new Set(values.map(scalarTypeLabel));
  if (labels.size === 0) return "unknown";
  if (labels.size === 1) return [...labels][0];
  return `(${[...labels].sort().join(" | ")})`;
};

const scalarTypeLabel = (v: unknown): string => {
  if (v === null) return "null";
  if (Array.isArray(v)) return `${elementTypeLabel(v)}[]`;
  if (typeof v === "object") return "object";
  return typeof v;
};

/** Sorted for stable output, with `null` last so unions read naturally. */
const typeSet = (values: unknown[]): string[] =>
  [...new Set(values.map(scalarTypeLabel))].sort(
    (a, b) => Number(a === "null") - Number(b === "null") || a.localeCompare(b)
  );

const firstExample = (values: unknown[]): unknown =>
  values.find((v) => v !== null) ?? null;

/** Present values recurse as an object shape only when every one is a plain object. */
const allPlainObjects = (values: unknown[]): values is PlainObject[] =>
  values.length > 0 && values.every(isPlainObject);

const allObjectArrays = (values: unknown[]): values is PlainObject[][] =>
  values.length > 0 &&
  values.every((v) => Array.isArray(v) && v.every(isPlainObject) && v.length > 0);

const childShapes = (path: string, values: unknown[], depth: number): ShapeNode[] => {
  if (depth >= MAX_DEPTH) return [];
  if (allPlainObjects(values)) return deriveFields(values, path, depth + 1);
  if (allObjectArrays(values)) return deriveFields(values.flat(), `${path}[]`, depth + 1);
  return [];
};

const deriveFields = (records: PlainObject[], parentPath: string, depth: number): ShapeNode[] => {
  const keys = [...new Set(records.flatMap((r) => Object.keys(r)))];
  return keys.map((key) => {
    const path = parentPath ? `${parentPath}.${key}` : key;
    const present = records.filter((r) => key in r).map((r) => r[key]);
    return {
      path,
      key,
      types: typeSet(present),
      count: present.length,
      total: records.length,
      example: firstExample(present),
      children: childShapes(path, present, depth),
    };
  });
};

/**
 * Derive the shape of a collection sample (or a singular resource wrapped in
 * a one-element array). Non-object records produce an empty shape — there are
 * no fields to describe.
 */
export const deriveShape = (records: unknown[]): ShapeNode[] =>
  deriveFields(records.filter(isPlainObject), "", 1);
