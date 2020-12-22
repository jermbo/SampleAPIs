import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/styles.scss";

import Routes from "./router/routes";
import Header from "./components/Header/Header";

const App: React.FC = () => {
  return (
    <Router>
      <main className="content">
        <Header />
        <Switch>
          {Routes.map((route: any) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              children={<route.component />}
            />
          ))}
        </Switch>
      </main>
    </Router>
  );
};

export default App;
