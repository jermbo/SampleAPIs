import { Link } from "@tanstack/react-router";

interface Props {
  id: string;
}

const ApiNotFound = ({ id }: Props) => {
  return (
    <section className="page -api-details">
      <h2 className="page-header__title">API not found</h2>
      <p className="page-header__desc">
        There is no API matching &ldquo;{id}&rdquo;.
      </p>
      <Link className="btn" to="/api-list">
        Back to List
      </Link>
    </section>
  );
};

export default ApiNotFound;
