import { Link } from "@tanstack/react-router";

const ApiDetailsError = () => {
  return (
    <section className="page -api-details">
      <h2 className="page-header__title">Something went wrong</h2>
      <p className="page-header__desc">
        We couldn't load the API list. Please try again in a moment.
      </p>
      <Link className="btn" to="/api-list">
        Back to List
      </Link>
    </section>
  );
};

export default ApiDetailsError;
