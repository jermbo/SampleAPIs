import { describe, it, expect } from "vitest";
import { deriveShape } from "../../utils/deriveShape";
import {
  EMPTY_QUERY,
  buildQueryString,
  hasAnyQuery,
  queryableFields,
  type QueryState,
} from "./queryState";

const query = (overrides: Partial<QueryState>): QueryState => ({
  ...EMPTY_QUERY,
  ...overrides,
});

describe("buildQueryString", () => {
  it("returns an empty string for the empty query", () => {
    expect(buildQueryString(EMPTY_QUERY)).toBe("");
    expect(hasAnyQuery(EMPTY_QUERY)).toBe(false);
  });

  it("renders equality filters as plain field params, including dot paths", () => {
    const state = query({ filters: [{ field: "name.first", op: "eq", value: "Bender" }] });
    expect(buildQueryString(state)).toBe("?name.first=Bender");
  });

  it("renders operator filters with the _op suffix", () => {
    const state = query({
      filters: [
        { field: "age", op: "gte", value: "21" },
        { field: "age", op: "lte", value: "65" },
        { field: "status", op: "ne", value: "retired" },
        { field: "name", op: "like", value: "bend" },
      ],
    });
    expect(buildQueryString(state)).toBe(
      "?age_gte=21&age_lte=65&status_ne=retired&name_like=bend"
    );
  });

  it("keeps repeated equality filters on the same field (OR match)", () => {
    const state = query({
      filters: [
        { field: "species", op: "eq", value: "robot" },
        { field: "species", op: "eq", value: "human" },
      ],
    });
    expect(buildQueryString(state)).toBe("?species=robot&species=human");
  });

  it("skips incomplete filter rows instead of emitting broken params", () => {
    const state = query({
      filters: [
        { field: "", op: "eq", value: "orphan" },
        { field: "name", op: "eq", value: "  " },
      ],
    });
    expect(buildQueryString(state)).toBe("");
  });

  it("renders q, sort with explicit order, and pagination", () => {
    const state = query({
      q: "bender",
      sort: { field: "name.last", dir: "desc" },
      page: "2",
      limit: "5",
    });
    expect(buildQueryString(state)).toBe(
      "?q=bender&_sort=name.last&_order=desc&_page=2&_limit=5"
    );
  });

  it("url-encodes values", () => {
    const state = query({ filters: [{ field: "title", op: "like", value: "a & b" }] });
    expect(buildQueryString(state)).toBe("?title_like=a+%26+b");
  });
});

describe("queryableFields", () => {
  it("lists primitive dot-paths ordered by coverage, excluding array interiors", () => {
    const shape = deriveShape([
      { id: 1, name: { first: "Bender" }, sayings: ["hi"], crew: [{ rank: 1 }] },
      { id: 2, name: { first: "Fry", last: "Philip" } },
    ]);
    const paths = queryableFields(shape).map((f) => f.path);
    expect(paths).toEqual(["id", "name.first", "name.last"]);
  });

  it("flags numeric fields for input affordances", () => {
    const shape = deriveShape([{ id: 7, name: "x" }]);
    const fields = queryableFields(shape);
    expect(fields.find((f) => f.path === "id")?.isNumeric).toBe(true);
    expect(fields.find((f) => f.path === "name")?.isNumeric).toBe(false);
  });
});
