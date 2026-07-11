import type { SandboxEvent } from "./types";
import type { PlaygroundRunEvent } from "../components/Playground/types";

const stringifyValue = (v: unknown): string => {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
};

/** Map a Playground run event to the evaluator's normalized shape. */
export const mapPlaygroundEvent = (ev: PlaygroundRunEvent): SandboxEvent | null => {
  switch (ev.type) {
    case "console":
      return {
        type: "console",
        level: ev.level,
        text: ev.values.map(stringifyValue).join(" "),
      };
    case "net":
      if (ev.event.phase === "request")
        return { type: "request", method: ev.event.method, url: ev.event.url };
      if (ev.event.phase === "response")
        return {
          type: "response",
          method: ev.event.method,
          url: ev.event.url,
          status: ev.event.status ?? 0,
        };
      return null;
    case "uncaught":
      return { type: "uncaught" };
    default:
      return null;
  }
};
