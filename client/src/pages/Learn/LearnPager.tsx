import { Link } from "@tanstack/react-router";

interface Props {
  trackId: string;
  stepNum: number;
  totalSteps: number;
}

const LearnPager = ({ trackId, stepNum, totalSteps }: Props) => {
  const hasPrevious = stepNum > 1;
  const hasNext = stepNum < totalSteps;

  return (
    <nav className="learn-pager">
      {hasPrevious && (
        <Link
          className="btn"
          to="/learn/$trackId/$step"
          params={{ trackId, step: String(stepNum - 1) }}
        >
          ← Previous
        </Link>
      )}
      {!hasPrevious && <span />}
      {hasNext && (
        <Link
          className="btn"
          to="/learn/$trackId/$step"
          params={{ trackId, step: String(stepNum + 1) }}
        >
          Skip ahead →
        </Link>
      )}
    </nav>
  );
};

export default LearnPager;
