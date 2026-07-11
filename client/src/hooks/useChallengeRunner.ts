import { useCallback, useEffect, useRef, useState } from "react";
import { allPass, evaluateChecks } from "../challenges/evaluate";
import { mapPlaygroundEvent } from "../challenges/playgroundBridge";
import type { CheckResult, Challenge, SandboxEvent } from "../challenges/types";
import type { PlaygroundRunEvent } from "../components/Playground/types";

export type RunState = "idle" | "running" | "passed" | "failed";

interface Options {
  challenge: Challenge;
  onPass: () => void;
}

/** Restricted bridge between Playground run events and challenge check evaluation. */
export const useChallengeRunner = ({ challenge, onPass }: Options) => {
  const eventsRef = useRef<SandboxEvent[]>([]);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");

  useEffect(() => {
    eventsRef.current = [];
    setResults(null);
    setRunState("idle");
  }, [challenge.id]);

  const evaluate = useCallback(() => {
    const res = evaluateChecks(challenge.checks, eventsRef.current);
    setResults(res);
    if (allPass(res)) {
      setRunState("passed");
      onPass();
    }
    return res;
  }, [challenge.checks, onPass]);

  const handleRunEvent = useCallback(
    (ev: PlaygroundRunEvent) => {
      if (ev.type === "start") {
        eventsRef.current = [];
        setResults(null);
        setRunState("running");
        return;
      }
      if (ev.type === "done" || ev.type === "end") {
        const res = evaluate();
        if (!allPass(res) && ev.type === "end") {
          setRunState((s) => (s === "passed" || s === "idle" ? s : "failed"));
        }
        return;
      }
      const mapped = mapPlaygroundEvent(ev);
      if (!mapped) return;
      eventsRef.current = [...eventsRef.current, mapped];
      evaluate();
    },
    [evaluate]
  );

  return { results, runState, handleRunEvent };
};
