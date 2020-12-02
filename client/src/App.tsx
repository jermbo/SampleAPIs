import React, { useContext } from "react";
import Header from "./components/Header";
import OuterNav from "./components/OuterNav";
import { GlobalContext } from "./GlobalContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/styles.scss";

import Routes from "./router/routes";

const App: React.FC = () => {
  const { navVisible } = useContext(GlobalContext);

  return (
    <Router>
      <main className={`${navVisible ? "nav-open" : ""}`}>
        <div className="container">
          <Header />
          <Switch>
            {Routes.map((route: any) => (
              <Route key={route.path} path={route.path} exact={route.exact} children={<route.component />} />
            ))}
          </Switch>
        </div>
        <OuterNav />
      </main>
    </Router>
  );
};

export default App;
