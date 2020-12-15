import React, { useContext } from "react";
import { GlobalContext } from "./context/GlobalContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/styles.scss";

import Routes from "./router/routes";

const App: React.FC = () => {
  const { navVisible } = useContext(GlobalContext);

  return (
    <Router>
      <main className="content" data-nav-visible={navVisible}>
        <div className="page-wrapper">
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
        </div>
      </main>
    </Router>
  );
};

export default App;
