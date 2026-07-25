import { useState, useEffect } from "react";
import type { Challenge } from "../../challenges/types";

interface Props {
  challenge: Challenge;
  endpointUrl: string;
}

const solutionToggleLabel = (visible: boolean): string =>
  visible ? "Hide solution" : "Show solution";

const LearnHintsPanel = ({ challenge, endpointUrl }: Props) => {
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const allHintsShown = hintsShown >= challenge.hints.length;
  const canShowSolution = allHintsShown;

  useEffect(() => {
    setHintsShown(0);
    setShowSolution(false);
  }, [challenge.id]);

  return (
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
          disabled={!canShowSolution}
          title={
            canShowSolution ? undefined : "The solution unlocks after you've seen every hint"
          }
          onClick={() => setShowSolution((s) => !s)}
        >
          {solutionToggleLabel(showSolution)}
        </button>
      </div>
      {showSolution && canShowSolution && (
        <div className="learn-solution">
          <p className="learn-solution__caption">
            One way to do it — the checks accept other correct answers too.
          </p>
          <pre className="learn-solution__code">{challenge.solution(endpointUrl)}</pre>
        </div>
      )}
    </div>
  );
};

export default LearnHintsPanel;
