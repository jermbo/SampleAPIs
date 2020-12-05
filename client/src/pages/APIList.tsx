import React from "react";
import AllAPIs from "../components/AllAPIs";

const APIList: React.FC = () => {
  return (
    <section className="home-page">
      <div className="home-page-header">
        <h2 className="home-page__title">API List</h2>
        <p className="home-page__sub-title">
          Sample APIs has a growing list of endpoints. Perfect for any learning project
        </p>
      </div>
      <AllAPIs />
    </section>
  );
};

export default APIList;
