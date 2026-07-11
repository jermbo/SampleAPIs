import type { CheckSpec, CheckResult, SandboxEvent } from "./types";

/**
 * Evaluate a challenge's checks against the events a run has emitted so far.
 *
 * Pure function over the event array: the page re-runs it as events stream in
 * (a late un-awaited .then() can still flip a check to passing), so no check may
 * depend on evaluation order or timing — only on event contents.
 */
export function evaluateChecks(
  checks: CheckSpec[],
  events: SandboxEvent[]
): CheckResult[] {
  return checks.map((spec) => ({ spec, pass: evaluateOne(spec, events) }));
}

export function allPass(results: CheckResult[]): boolean {
  return results.length > 0 && results.every((r) => r.pass);
}

function evaluateOne(spec: CheckSpec, events: SandboxEvent[]): boolean {
  switch (spec.kind) {
    case "requestMade": {
      const min = spec.minCount ?? 1;
      const count = events.filter(
        (e) =>
          e.type === "request" &&
          matchesMethod(e.method, spec.method) &&
          matchesUrl(e.url, spec.urlIncludes)
      ).length;
      return count >= min;
    }
    case "responseStatus":
      return events.some(
        (e) =>
          e.type === "response" &&
          e.status === spec.status &&
          matchesMethod(e.method, spec.method) &&
          matchesUrl(e.url, spec.urlIncludes)
      );
    case "consoleIncludes": {
      const needle = spec.pattern.toLowerCase();
      return events.some(
        (e) => e.type === "console" && e.text.toLowerCase().includes(needle)
      );
    }
    case "consoleCount":
      return events.filter((e) => e.type === "console").length >= spec.min;
    case "noUncaughtError":
      return !events.some((e) => e.type === "uncaught");
  }
}

function matchesMethod(method: string, wanted?: string): boolean {
  return !wanted || method.toUpperCase() === wanted.toUpperCase();
}

function matchesUrl(url: string, includes?: string): boolean {
  return !includes || url.toLowerCase().includes(includes.toLowerCase());
}
