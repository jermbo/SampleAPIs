import React from "react";
import PageHeaderActions from "../../components/PageHeaderActions/PageHeaderActions";

interface Props {}

const Docs: React.FC<Props> = () => {
  return (
    <div className="page -docs">
      <header className="page-header">
        <h2 className="page-header__title">Docs</h2>
        <p className="page-header__desc">Coming Soon...</p>
        <PageHeaderActions currentPage="docs" />
      </header>
    </div>
  );
};

export default Docs;
