import React from "react";
import { Link } from "react-router-dom";

const APIList: React.FC<any> = ({ routes }) => {
  return (
    <>
      <h1>APIList Page</h1>
      <Link to="/api-list/futurama">Futurama</Link>
      <br />
      <Link to="/api-list/asd">asd</Link>
      <br />
      <Link to="/api-list/dsa">dsa</Link>
      <br />
      <Link to="/api-list/www">www</Link>
      <br />
      <Link to="/api-list/aaa">aaa</Link>
      <br />
      <Link to="/api-list/aaaccc">aaaccc</Link>
    </>
  );
};

export default APIList;
