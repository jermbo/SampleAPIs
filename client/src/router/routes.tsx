import About from "../pages/About/About";
import APIDetails from "../pages/APIDetails/APIDetails";
import APIList from "../pages/APIList/APIList";
import Home from "../pages/Home/Home";
import StyleGuide from "../pages/StyleGuide/StyleGuide";
import NotFound from "../pages/NotFound/NotFound";
import Docs from "../pages/Docs/Docs";

const AppRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/style-guide",
    component: StyleGuide,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/docs",
    component: Docs,
  },
  {
    path: "/api-list",
    component: APIList,
  },
  {
    path: "/api-list/:id",
    component: APIDetails,
  },
  {
    path: "/",
    exact: false,
    component: NotFound,
  },
];

export default AppRoutes;
