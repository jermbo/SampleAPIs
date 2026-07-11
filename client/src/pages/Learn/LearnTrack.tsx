import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { findTrack } from "../../challenges";
import { evaluateChecks, allPass } from "../../challenges/evaluate";
import type { CheckResult, SandboxEvent } from "../../challenges/types";
import { getCompleted, markCompleted } from "../../challenges/progress";
import { URLS } from "../../utils/Config";
import type { PlaygroundRunEvent } from "../../components/Playground/Playground";
import "./Learn.css";

// Same lazy split as APIDetails — CodeMirror stays out of the initial bundle.
const Playground = lazy(() => import("../../components/Playground/Playground"));

const stringifyValue = (v: unknown): string => {
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
};

/** Map a Playground run event to the evaluator's normalized shape. */
const mapEvent = (ev: PlaygroundRunEvent): SandboxEvent | null => {
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

type RunState = "idle" | "running" | "passed" | "failed";

/** Challenge runner — /learn/$trackId/$step (1-based step). */
const LearnTrack: React.FC = () => {
  const { trackId, step } = useParams({ from: "/learn/$trackId/$step" });
  const track = findTrack(trackId);
  const stepNum = Number(step);
  const validStep =
    !!track && Number.isInteger(stepNum) && stepNum >= 1 && stepNum <= track.challenges.length;
  const challenge = validStep ? track!.challenges[stepNum - 1] : undefined;

  const eventsRef = useRef<SandboxEvent[]>([]);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(() =>
    track ? getCompleted(track.id) : new Set()
  );

  // Fresh slate when the learner moves to another challenge (or track).
  useEffect(() => {
    eventsRef.current = [];
    setResults(null);
    setRunState("idle");
    setHintsShown(0);
    setShowSolution(false);
    if (track) setCompleted(getCompleted(track.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, challenge?.id]);

  if (!track || !challenge) {
    return (
      <section className="page -learn">
        <header className="page-header">
          <h2 className="page-header__title">Challenge not found</h2>
          <p className="page-header__desc">
            There is no challenge at &ldquo;/learn/{trackId}/{step}&rdquo;.
          </p>
          <Link className="btn" to="/learn">
            Back to Learn
          </Link>
        </header>
      </section>
    );
  }

  const endpointUrl = `${URLS.API_LINK}/${track.apiLink}/${track.endpoint}`;
  const totalSteps = track.challenges.length;

  const markPassed = () => {
    setRunState("passed");
    markCompleted(track.id, challenge.id);
    setCompleted(getCompleted(track.id));
  };

  const handleRunEvent = (ev: PlaygroundRunEvent) => {
    if (ev.type === "start") {
      eventsRef.current = [];
      setResults(null);
      setRunState("running");
      return;
    }
    if (ev.type === "done" || ev.type === "end") {
      const res = evaluateChecks(challenge.checks, eventsRef.current);
      setResults(res);
      if (allPass(res)) markPassed();
      else if (ev.type === "end")
        setRunState((s) => (s === "passed" || s === "idle" ? s : "failed"));
      return;
    }
    const mapped = mapEvent(ev);
    if (!mapped) return;
    eventsRef.current = [...eventsRef.current, mapped];
    // Re-evaluate as events stream in: a late un-awaited .then() can still flip
    // a check to passing before the run timeout tears the sandbox down.
    const res = evaluateChecks(challenge.checks, eventsRef.current);
    setResults(res);
    if (allPass(res)) markPassed();
  };

  const allHintsShown = hintsShown >= challenge.hints.length;

  return (
    <section className="page -learn-track">
      <header className="page-header -compact">
        <Link className="btn" to="/learn">
          All tracks
        </Link>
        <h2 className="page-header__title">{track.title}</h2>
        <div className="learn-progress" aria-label={`Challenge ${stepNum} of ${totalSteps}`}>
          {track.challenges.map((c, i) => (
            <Link
              key={c.id}
              className={`learn-progress__dot ${completed.has(c.id) ? "-done" : ""} ${
                i + 1 === stepNum ? "-current" : ""
              }`}
              to="/learn/$trackId/$step"
              params={{ trackId: track.id, step: String(i + 1) }}
              title={`${i + 1}. ${c.title}`}
            />
          ))}
          <span className="learn-progress-label">
            {stepNum} of {totalSteps}
          </span>
        </div>
      </header>

      <div className="section">
        <article className="learn-challenge">
          <p className="learn-challenge__step">Challenge {stepNum}</p>
          <h3 className="learn-challenge__title">{challenge.title}</h3>
          <p className="learn-challenge__prompt">{challenge.prompt}</p>
          {challenge.note && <p className="learn-challenge__note">{challenge.note}</p>}
        </article>

        <Suspense fallback={<p role="status">Loading playground…</p>}>
          <Playground
            url={endpointUrl}
            defaultCode={challenge.starter(endpointUrl)}
            storageKey={`sampleapis:challenges:code:${track.id}:${challenge.id}`}
            hideSnippets
            onRunEvent={handleRunEvent}
          />
        </Suspense>

        <div className="learn-checks">
          <div className="learn-checks__header">
            <h4 className="learn-checks__title">Checks</h4>
            {results && (
              <span className={`learn-checks__summary -${runState}`}>
                {runState === "passed"
                  ? "All checks passed"
                  : `${results.filter((r) => r.pass).length} of ${results.length} passing`}
              </span>
            )}
          </div>

          {!results ? (
            <p className="learn-checks__empty">
              Run your code (▶ Run) and the checks will grade it here.
            </p>
          ) : (
            <ul className="learn-checks__list">
              {results.map((r, i) => (
                <li key={i} className={`learn-check ${r.pass ? "-pass" : "-fail"}`}>
                  <span className="learn-check__mark">{r.pass ? "✓" : "✗"}</span>
                  <span className="learn-check__body">
                    {r.spec.label}
                    {!r.pass && runState !== "running" && (
                      <span className="learn-check__help">{r.spec.failMessage}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {runState === "passed" && (
            <div className="learn-passed">
              <span>
                Challenge complete!{completed.has(challenge.id) ? "" : " Progress saved."}
              </span>
              {stepNum < totalSteps ? (
                <Link
                  className="btn -primary"
                  to="/learn/$trackId/$step"
                  params={{ trackId: track.id, step: String(stepNum + 1) }}
                >
                  Next challenge →
                </Link>
              ) : (
                <Link className="btn -primary" to="/learn">
                  Track complete — back to Learn
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="learn-help">
          {challenge.hints.slice(0, hintsShown).map((hint, i) => (
            <p key={i} className="learn-hint">
              <strong>Hint {i + 1}:</strong> {hint}
            </p>
          ))}
          <div className="learn-help__actions">
            {!allHintsShown && (
              <button className="btn" onClick={() => setHintsShown((n) => n + 1)}>
                Show hint ({hintsShown + 1} of {challenge.hints.length})
              </button>
            )}
            <button
              className="btn"
              disabled={!allHintsShown}
              title={
                allHintsShown
                  ? undefined
                  : "The solution unlocks after you've seen every hint"
              }
              onClick={() => setShowSolution((s) => !s)}
            >
              {showSolution ? "Hide solution" : "Show solution"}
            </button>
          </div>
          {showSolution && allHintsShown && (
            <div className="learn-solution">
              <p className="learn-solution__caption">
                One way to do it — the checks accept other correct answers too.
              </p>
              <pre className="learn-solution__code">{challenge.solution(endpointUrl)}</pre>
            </div>
          )}
        </div>

        <nav className="learn-pager">
          {stepNum > 1 ? (
            <Link
              className="btn"
              to="/learn/$trackId/$step"
              params={{ trackId: track.id, step: String(stepNum - 1) }}
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {stepNum < totalSteps && (
            <Link
              className="btn"
              to="/learn/$trackId/$step"
              params={{ trackId: track.id, step: String(stepNum + 1) }}
            >
              Skip ahead →
            </Link>
          )}
        </nav>
      </div>
    </section>
  );
};

export default LearnTrack;
