/**
 * Challenge track schema. Tracks are DATA, not code: prompts, starter templates,
 * declarative checks, hints. The check vocabulary is the tagged union below —
 * contributions add content against it, never executable check logic
 * (decision D1 in docs/future-features/plans/guided-challenges-decisions.md).
 */

export interface Track {
  id: string;
  title: string;
  description: string;
  /** API the track runs against, as it appears in the endpoint URL (e.g. "futurama"). */
  apiLink: string;
  /** Collection endpoint within the API (e.g. "characters"). */
  endpoint: string;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  title: string;
  /** Short instruction shown above the editor. Plain text. */
  prompt: string;
  /** Extra context under the prompt — why this matters. Optional. */
  note?: string;
  /** Starter code template. Receives the track's endpoint URL. */
  starter: (url: string) => string;
  checks: CheckSpec[];
  /** Revealed one at a time; the solution unlocks after all of them (D4). */
  hints: string[];
  /** A worked example — "one way to do it", not the only accepted answer. */
  solution: (url: string) => string;
}

interface BaseCheck {
  /** What the learner sees next to the pass/fail mark. */
  label: string;
  /** Shown when the check fails — written as guidance, not as an error. */
  failMessage: string;
}

export type CheckSpec =
  | (BaseCheck & {
      kind: "requestMade";
      method?: string;
      /** Substring the request URL must contain (case-insensitive). */
      urlIncludes?: string;
      minCount?: number;
    })
  | (BaseCheck & {
      kind: "responseStatus";
      status: number;
      method?: string;
      urlIncludes?: string;
    })
  | (BaseCheck & {
      kind: "consoleIncludes";
      /** Substring some console line must contain (case-insensitive). */
      pattern: string;
    })
  | (BaseCheck & { kind: "consoleCount"; min: number })
  | (BaseCheck & { kind: "noUncaughtError" });

/** Normalized view of what a run emitted — what the evaluator consumes. */
export type SandboxEvent =
  | { type: "console"; level: string; text: string }
  | {
      type: "request";
      method: string;
      url: string;
    }
  | {
      type: "response";
      method: string;
      url: string;
      status: number;
    }
  | { type: "uncaught" };

export interface CheckResult {
  spec: CheckSpec;
  pass: boolean;
}
