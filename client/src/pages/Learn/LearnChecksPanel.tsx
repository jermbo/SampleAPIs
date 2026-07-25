import { Link } from "@tanstack/react-router";
import type { CheckResult } from "../../challenges/types";
import type { RunState } from "../../hooks/useChallengeRunner";

interface Props {
  results: CheckResult[] | null;
  runState: RunState;
  trackId: string;
  stepNum: number;
  totalSteps: number;
  challengeId: string;
  completed: Set<string>;
}

const checksSummary = (runState: RunState, results: CheckResult[]): string => {
  if (runState === "passed") return "All checks passed";
  const passing = results.filter((r) => r.pass).length;
  return `${passing} of ${results.length} passing`;
};

const checkClassName = (pass: boolean): string => (pass ? "learn-check -pass" : "learn-check -fail");
const checkMark = (pass: boolean): string => (pass ? "✓" : "✗");

const progressSavedNote = (alreadySaved: boolean): string =>
  alreadySaved ? "" : " Progress saved.";

const LearnChecksPanel = ({
  results,
  runState,
  trackId,
  stepNum,
  totalSteps,
  challengeId,
  completed,
}: Props) => {
  const showFailHelp = runState !== "running";
  const hasNext = stepNum < totalSteps;

  return (
    <div className="learn-checks">
      <div className="learn-checks__header">
        <h4 className="learn-checks__title">Checks</h4>
        {results && (
          <span className={`learn-checks__summary -${runState}`}>
            {checksSummary(runState, results)}
          </span>
        )}
      </div>

      {!results && (
        <p className="learn-checks__empty">
          Run your code (▶ Run) and the checks will grade it here.
        </p>
      )}

      {results && (
        <ul className="learn-checks__list">
          {results.map((r, i) => (
            <li key={i} className={checkClassName(r.pass)}>
              <span className="learn-check__mark">{checkMark(r.pass)}</span>
              <span className="learn-check__body">
                {r.spec.label}
                {!r.pass && showFailHelp && (
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
            Challenge complete!{progressSavedNote(completed.has(challengeId))}
          </span>
          {hasNext && (
            <Link
              className="btn -primary"
              to="/learn/$trackId/$step"
              params={{ trackId, step: String(stepNum + 1) }}
            >
              Next challenge →
            </Link>
          )}
          {!hasNext && (
            <Link className="btn -primary" to="/learn">
              Track complete — back to Learn
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnChecksPanel;
