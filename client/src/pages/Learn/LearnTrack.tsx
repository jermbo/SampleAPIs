import { Suspense, lazy, useCallback } from "react";
import { Link, useParams } from "@tanstack/react-router";
import type { ResolvedChallenge } from "../../challenges/resolveChallenge";
import { resolveChallenge } from "../../challenges/resolveChallenge";
import { URLS } from "../../utils/Config";
import { useChallengeRunner } from "../../hooks/useChallengeRunner";
import { useTrackProgress } from "../../hooks/useTrackProgress";
import LearnProgressDots from "./LearnProgressDots";
import LearnChecksPanel from "./LearnChecksPanel";
import LearnHintsPanel from "./LearnHintsPanel";
import LearnPager from "./LearnPager";
import LearnNotFound from "./LearnNotFound";
import "./Learn.css";

const Playground = lazy(() => import("../../components/Playground/Playground"));

interface RunnerProps {
  resolved: ResolvedChallenge;
}

const LearnTrackRunner = ({ resolved }: RunnerProps) => {
  const { track, challenge, stepNum, totalSteps } = resolved;
  const endpointUrl = `${URLS.API_LINK}/${track.apiLink}/${track.endpoint}`;
  const { completed, markComplete } = useTrackProgress(track);

  const onPass = useCallback(() => markComplete(challenge.id), [markComplete, challenge.id]);
  const { results, runState, handleRunEvent } = useChallengeRunner({ challenge, onPass });

  return (
    <section className="page -learn-track">
      <header className="page-header -compact">
        <Link className="btn" to="/learn">
          All tracks
        </Link>
        <h2 className="page-header__title">{track.title}</h2>
        <LearnProgressDots
          track={track}
          stepNum={stepNum}
          totalSteps={totalSteps}
          completed={completed}
        />
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

        <LearnChecksPanel
          results={results}
          runState={runState}
          trackId={track.id}
          stepNum={stepNum}
          totalSteps={totalSteps}
          challengeId={challenge.id}
          completed={completed}
        />

        <LearnHintsPanel challenge={challenge} endpointUrl={endpointUrl} />

        <LearnPager trackId={track.id} stepNum={stepNum} totalSteps={totalSteps} />
      </div>
    </section>
  );
};

/** Challenge runner — /learn/$trackId/$step (1-based step). */
const LearnTrack = () => {
  const { trackId, step } = useParams({ from: "/learn/$trackId/$step" });
  const resolved = resolveChallenge(trackId, step);

  if (!resolved) {
    return <LearnNotFound trackId={trackId} step={step} />;
  }

  return <LearnTrackRunner resolved={resolved} />;
};

export default LearnTrack;
