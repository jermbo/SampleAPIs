import React, { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

const LogIn: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(GlobalContext);

  return (
    <>
      <h1>Login Page</h1>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Login</button>
    </>
  );
};

export default LogIn;
