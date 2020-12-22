import About from "../pages/About/About";
import APIDetails from "../pages/APIDetails/APIDetails";
import APIList from "../pages/APIList/APIList";
import Home from "../pages/Home/Home";
import StyleGuide from "../pages/StyleGuide/StyleGuide";
import NotFound from "../pages/NotFound/NotFound";

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
    path: "/",
    exact: false,
    component: NotFound,
  },
];

export default Routes;
