import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";

const Custom: React.FC = () => {
  const { isLoggedIn } = useContext(GlobalContext);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <h1>Custom Page</h1>
    </>
  );
};

export default Custom;
