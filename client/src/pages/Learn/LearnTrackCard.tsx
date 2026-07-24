import { Link } from "@tanstack/react-router";
import type { Track } from "../../challenges/types";
import { getCtaLabel, getResumeStep } from "../../challenges/progress";
import { useTrackProgress } from "../../hooks/useTrackProgress";
import TrackApiChip from "./TrackApiChip";

interface Props {
  track: Track;
}

const LearnTrackCard = ({ track }: Props) => {
  const { stats, reset, canReset } = useTrackProgress(track);

  return (
    <article className="learn-track-card">
      <div className="learn-track-card__head">
        <h3 className="learn-track-card__title">{track.title}</h3>
        <TrackApiChip apiLink={track.apiLink} />
      </div>
      <p className="learn-track-card__desc">{track.description}</p>
      <div className="learn-track-card__foot">
        <span className="learn-progress-label">
          {stats.done} of {stats.total} completed
        </span>
        <div className="learn-track-card__actions">
          {canReset && (
            <button className="btn" onClick={reset}>
              Reset progress
            </button>
          )}
          <Link
            className="btn -primary"
            to="/learn/$trackId/$step"
            params={{
              trackId: track.id,
              step: String(getResumeStep(stats)),
            }}
          >
            {getCtaLabel(stats)}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default LearnTrackCard;
