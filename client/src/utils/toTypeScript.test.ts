import { describe, it, expect } from "vitest";
import { deriveShape } from "./deriveShape";
import { interfaceName, toTypeScript } from "./toTypeScript";

describe("interfaceName", () => {
  it("singularizes and PascalCases resource names", () => {
    expect(interfaceName("characters")).toBe("Character");
    expect(interfaceName("categories")).toBe("Category");
    expect(interfaceName("glass")).toBe("Glass");
    expect(interfaceName("wine-pairings")).toBe("WinePairing");
  });
});

describe("toTypeScript", () => {
  it("emits a flat interface with optional members where coverage is partial", () => {
    const shape = deriveShape([
      { id: 1, name: "aliceblue" },
      { id: 2, name: "coral", hex: "#ff7f50" },
    ]);
    expect(toTypeScript(shape, "colors")).toBe(
      [
        "export interface Color {",
        "  id: number;",
        "  name: string;",
        "  hex?: string;",
        "}",
      ].join("\n")
    );
  });

  it("emits nested interfaces for object fields", () => {
    const shape = deriveShape([{ name: { first: "Bender", last: "Rodriguez" } }]);
    expect(toTypeScript(shape, "characters")).toBe(
      [
        "export interface Character {",
        "  name: Name;",
        "}",
        "",
        "export interface Name {",
        "  first: string;",
        "  last: string;",
        "}",
      ].join("\n")
    );
  });

  it("emits unions, typed arrays, and object-array references", () => {
    const shape = deriveShape([
      { age: 30, sayings: ["hi"], crew: [{ name: "Leela" }] },
      { age: null, sayings: ["yo"], crew: [{ name: "Amy" }] },
    ]);
    const ts = toTypeScript(shape, "characters");
    expect(ts).toContain("age: number | null;");
    expect(ts).toContain("sayings: string[];");
    expect(ts).toContain("crew: Crew[];");
    expect(ts).toContain("export interface Crew {\n  name: string;\n}");
  });

  it("quotes keys that are not valid identifiers", () => {
    const shape = deriveShape([{ "content-type": "json" }]);
    expect(toTypeScript(shape, "items")).toContain('"content-type": string;');
  });

  it("suffixes colliding interface names instead of clobbering", () => {
    const shape = deriveShape([{ item: { id: 1 }, items: [{ id: 2 }] }]);
    const ts = toTypeScript(shape, "things");
    expect(ts).toContain("export interface Item {");
    expect(ts).toContain("export interface Item2 {");
  });
});
