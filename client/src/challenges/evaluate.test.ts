import { describe, it, expect } from "vitest";
import { evaluateChecks, allPass } from "./evaluate";
import type { CheckSpec, SandboxEvent } from "./types";

const base = { label: "x", failMessage: "y" };

const checks: CheckSpec[] = [
  { ...base, kind: "requestMade", method: "GET", urlIncludes: "/futurama/characters" },
  { ...base, kind: "responseStatus", status: 200, urlIncludes: "/futurama/characters" },
  { ...base, kind: "consoleIncludes", pattern: "bender" },
  { ...base, kind: "consoleCount", min: 1 },
  { ...base, kind: "noUncaughtError" },
];

const passingEvents: SandboxEvent[] = [
  { type: "request", method: "GET", url: "http://localhost:5555/futurama/characters" },
  {
    type: "response",
    method: "GET",
    url: "http://localhost:5555/futurama/characters",
    status: 200,
  },
  { type: "console", level: "log", text: '[{"name":{"first":"Bender"}}]' },
];

describe("evaluateChecks", () => {
  it("passes every check on a correct run", () => {
    const results = evaluateChecks(checks, passingEvents);
    expect(results.every((r) => r.pass)).toBe(true);
    expect(allPass(results)).toBe(true);
  });

  it("fails everything on a run with zero events", () => {
    const results = evaluateChecks(checks, []);
    expect(results.filter((r) => r.pass).map((r) => r.spec.kind)).toEqual([
      "noUncaughtError",
    ]);
    expect(allPass(results)).toBe(false);
  });

  it("is order-independent: late async events still flip a check to passing", () => {
    // Simulates an un-awaited .then(): console line arrives, THEN the response.
    const early = passingEvents.slice(0, 1);
    const midRun = evaluateChecks(checks, early);
    expect(midRun.find((r) => r.spec.kind === "responseStatus")?.pass).toBe(false);

    const reordered: SandboxEvent[] = [passingEvents[2], passingEvents[0], passingEvents[1]];
    expect(allPass(evaluateChecks(checks, reordered))).toBe(true);
  });

  it("matches method and status filters exactly", () => {
    const spec: CheckSpec[] = [
      { ...base, kind: "responseStatus", status: 201, method: "POST" },
    ];
    const getOnly: SandboxEvent[] = [
      { type: "response", method: "GET", url: "/futurama/characters", status: 201 },
    ];
    const posted: SandboxEvent[] = [
      { type: "response", method: "POST", url: "/futurama/characters", status: 201 },
    ];
    expect(evaluateChecks(spec, getOnly)[0].pass).toBe(false);
    expect(evaluateChecks(spec, posted)[0].pass).toBe(true);
  });

  it("counts requests for minCount", () => {
    const spec: CheckSpec[] = [{ ...base, kind: "requestMade", minCount: 2 }];
    const one: SandboxEvent[] = [{ type: "request", method: "GET", url: "/a" }];
    const two: SandboxEvent[] = [...one, { type: "request", method: "POST", url: "/b" }];
    expect(evaluateChecks(spec, one)[0].pass).toBe(false);
    expect(evaluateChecks(spec, two)[0].pass).toBe(true);
  });

  it("consoleIncludes is case-insensitive substring match", () => {
    const spec: CheckSpec[] = [{ ...base, kind: "consoleIncludes", pattern: "BENDER" }];
    const events: SandboxEvent[] = [
      { type: "console", level: "log", text: "found bender rodriguez" },
    ];
    expect(evaluateChecks(spec, events)[0].pass).toBe(true);
  });

  it("noUncaughtError fails once an uncaught event appears", () => {
    const spec: CheckSpec[] = [{ ...base, kind: "noUncaughtError" }];
    expect(evaluateChecks(spec, [])[0].pass).toBe(true);
    expect(evaluateChecks(spec, [{ type: "uncaught" }])[0].pass).toBe(false);
  });

  it("allPass is false for an empty check list", () => {
    expect(allPass([])).toBe(false);
  });
});
