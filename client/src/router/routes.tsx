// Pages
import Home from "../pages/Home";
import About from "../pages/About";
import APIList from "../pages/APIList";
import APIDetails from "../pages/APIDetails";
import Docs from "../pages/Docs";
import Custom from "../pages/Custom";
import StyleGuide from "../pages/StyleGuide";
import NotFound from "../pages/NotFound";
import LogIn from "../pages/Login";

const Routes = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/style-guide",
    exact: true,
    component: StyleGuide,
  },
  {
    path: "/about",
    exact: true,
    component: About,
  },
  {
    path: "/api-list",
    exact: true,
    component: APIList,
  },
  {
    path: "/api-list/:id",
    exact: true,
    component: APIDetails,
  },
  {
    path: "/docs",
    exact: true,
    component: Docs,
  },
  {
    path: "/custom",
    exact: true,
    component: Custom,
  },
  {
    path: "/login",
    exact: true,
    component: LogIn,
  },
  {
    path: "/",
    exact: false,
    component: NotFound,
  },
];

export default Routes;
