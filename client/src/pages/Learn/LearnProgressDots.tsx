import { Link } from "@tanstack/react-router";
import type { Track } from "../../challenges/types";

interface Props {
  track: Track;
  stepNum: number;
  totalSteps: number;
  completed: Set<string>;
}

const dotClassName = (done: boolean, current: boolean): string => {
  const classes = ["learn-progress__dot"];
  if (done) classes.push("-done");
  if (current) classes.push("-current");
  return classes.join(" ");
};

const LearnProgressDots = ({ track, stepNum, totalSteps, completed }: Props) => {
  return (
    <div className="learn-progress" aria-label={`Challenge ${stepNum} of ${totalSteps}`}>
      {track.challenges.map((c, i) => (
        <Link
          key={c.id}
          className={dotClassName(completed.has(c.id), i + 1 === stepNum)}
          to="/learn/$trackId/$step"
          params={{ trackId: track.id, step: String(i + 1) }}
          title={`${i + 1}. ${c.title}`}
        />
      ))}
      <span className="learn-progress-label">
        {stepNum} of {totalSteps}
      </span>
    </div>
  );
};

export default LearnProgressDots;
