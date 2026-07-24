import { TRACKS } from "../../challenges";
import LearnTrackCard from "./LearnTrackCard";
import "./Learn.css";

/** Track index — the /learn landing page. */
const Learn = () => {
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
        {TRACKS.map((track) => (
          <LearnTrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
};

export default Learn;
