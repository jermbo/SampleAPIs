import { describe, it, expect } from "vitest";
import { deriveShape, type ShapeNode } from "./deriveShape";

const byPath = (shape: ShapeNode[], path: string): ShapeNode | undefined => {
  for (const node of shape) {
    if (node.path === path) return node;
    const hit = byPath(node.children, path);
    if (hit) return hit;
  }
  return undefined;
};

describe("deriveShape", () => {
  it("reports types, coverage, and examples for flat records", () => {
    const shape = deriveShape([
      { id: 1, name: "aliceblue", hex: "#f0f8ff" },
      { id: 2, name: "coral" },
    ]);
    expect(byPath(shape, "name")).toMatchObject({
      types: ["string"],
      count: 2,
      total: 2,
      example: "aliceblue",
    });
    expect(byPath(shape, "hex")).toMatchObject({ count: 1, total: 2 });
  });

  it("reports a type set when a field's type varies", () => {
    const shape = deriveShape([{ age: 30 }, { age: null }, { age: "unknown" }]);
    expect(byPath(shape, "age")?.types).toEqual(["number", "string", "null"]);
  });

  it("recurses into nested objects with dot paths", () => {
    const shape = deriveShape([
      { name: { first: "Bender", last: "Rodriguez" } },
      { name: { first: "Fry" } },
    ]);
    expect(byPath(shape, "name.first")).toMatchObject({
      key: "first",
      types: ["string"],
      count: 2,
      total: 2,
    });
    expect(byPath(shape, "name.last")).toMatchObject({ count: 1, total: 2 });
  });

  it("labels primitive arrays by element type and leaves them childless", () => {
    const shape = deriveShape([{ sayings: ["Bite my shiny metal ass"] }]);
    expect(byPath(shape, "sayings")).toMatchObject({
      types: ["string[]"],
      children: [],
    });
  });

  it("reports empty arrays as unknown[]", () => {
    const shape = deriveShape([{ tags: [] }]);
    expect(byPath(shape, "tags")?.types).toEqual(["unknown[]"]);
  });

  it("recurses into arrays of objects via a [] path segment", () => {
    const shape = deriveShape([
      { crew: [{ name: "Leela" }, { name: "Amy", rank: 1 }] },
    ]);
    expect(byPath(shape, "crew[].name")).toMatchObject({ types: ["string"], count: 2, total: 2 });
    expect(byPath(shape, "crew[].rank")).toMatchObject({ count: 1, total: 2 });
  });

  it("reports mixed structural types as a union without recursing", () => {
    const node = byPath(deriveShape([{ meta: { a: 1 } }, { meta: "none" }]), "meta");
    expect(node?.types).toEqual(["object", "string"]);
    expect(node?.children).toEqual([]);
  });

  it("stops recursing at the depth cap", () => {
    const deep = { a: { b: { c: { d: { e: { f: 1 } } } } } };
    const shape = deriveShape([deep]);
    expect(byPath(shape, "a.b.c.d")).toBeDefined();
    expect(byPath(shape, "a.b.c.d")?.children).toEqual([]);
    expect(byPath(shape, "a.b.c.d.e")).toBeUndefined();
  });

  it("skips non-object records entirely", () => {
    expect(deriveShape(["just a string", 42, null])).toEqual([]);
  });
});
