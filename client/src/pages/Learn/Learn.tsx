import React from "react";
import { Link } from "@tanstack/react-router";
import { TRACKS } from "../../challenges";
import { getCompleted, resetProgress } from "../../challenges/progress";
import { useApiList } from "../../hooks/useApiList";
import "./Learn.css";

/** Track index — the /learn landing page. */
const Learn: React.FC = () => {
  const { data: apiList = [] } = useApiList();
  // Progress is read fresh on every render tick we care about; a state bump
  // after "reset" is all the invalidation this needs.
  const [, setRefresh] = React.useState(0);

  return (
    <section className="page -learn">
      <header className="page-header">
        <h2 className="page-header__title">Learn</h2>
        <p className="page-header__desc">
          Guided challenges that run in the Playground — with checks that tell you
          when you got it right.
        </p>
      </header>

      <div className="section">
        {TRACKS.map((track) => {
          const completed = getCompleted(track.id);
          const total = track.challenges.length;
          const done = track.challenges.filter((c) => completed.has(c.id)).length;
          const firstIncomplete =
            track.challenges.findIndex((c) => !completed.has(c.id)) + 1 || 1;
          const api = apiList.find((a) => a.link === track.apiLink);
          return (
            <article key={track.id} className="learn-track-card">
              <div className="learn-track-card__head">
                <h3 className="learn-track-card__title">{track.title}</h3>
                {api ? (
                  <Link
                    className="learn-chip"
                    to="/api-list/$id"
                    params={{ id: api.name }}
                  >
                    runs on {api.metaData.title}
                  </Link>
                ) : (
                  <span className="learn-chip">runs on {track.apiLink}</span>
                )}
              </div>
              <p className="learn-track-card__desc">{track.description}</p>
              <div className="learn-track-card__foot">
                <span className="learn-progress-label">
                  {done} of {total} completed
                </span>
                <div className="learn-track-card__actions">
                  {done > 0 && (
                    <button
                      className="btn"
                      onClick={() => {
                        resetProgress(track.id);
                        setRefresh((n) => n + 1);
                      }}
                    >
                      Reset progress
                    </button>
                  )}
                  <Link
                    className="btn -primary"
                    to="/learn/$trackId/$step"
                    params={{
                      trackId: track.id,
                      step: String(done === total ? 1 : firstIncomplete),
                    }}
                  >
                    {done === 0 ? "Start" : done === total ? "Start over" : "Continue"}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Learn;
