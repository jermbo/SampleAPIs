import React from "react";
import { Route, Routes } from "react-router-dom";
import "./styles/styles.scss";

import AppRoutes from "./router/routes";
import Header from "./components/Header/Header";
const App: React.FC = () => {
  return (
    <>
      <main className="content">
        <Header />
        <Routes>
          {AppRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </main>
    </>
  );
};

export default App;
