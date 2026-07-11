/** One network event posted by the sandbox's fetch wrapper. */
export interface NetEvent {
  id: number;
  phase: "request" | "response" | "error";
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  ms?: number;
  size?: number | null;
  headers?: Record<string, string>;
  message?: string;
}

/** Run lifecycle stream for hosts that need to observe a run (challenge checks). */
export type PlaygroundRunEvent =
  | { type: "start" }
  | { type: "console"; level: string; values: unknown[] }
  | { type: "net"; event: NetEvent }
  | { type: "uncaught" }
  | { type: "done" }
  | { type: "end" };

export interface OutputEntry {
  level: string;
  values: unknown[];
}
