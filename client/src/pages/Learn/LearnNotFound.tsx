import { Link } from "@tanstack/react-router";

interface Props {
  trackId: string;
  step: string;
}

const LearnNotFound = ({ trackId, step }: Props) => {
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
};

export default LearnNotFound;
