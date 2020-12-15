// Pages
// import Home from "../pages/_old/Home";
// import About from "../pages/_old/About";
// import APIList from "../pages/_old/APIList";
// import APIDetails from "../pages/_old/APIDetails";
// import Docs from "../pages/_old/Docs";
// import Custom from "../pages/_old/Custom";
// import StyleGuide from "../pages/_old/StyleGuide";
// import NotFound from "../pages/_old/NotFound";
// import LogIn from "../pages/_old/Login";

import Home from "../pages/Home/Home";

const Routes = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  // {
  //   path: "/",
  //   exact: true,
  //   component: Home,
  // },
  // {
  //   path: "/style-guide",
  //   exact: true,
  //   component: StyleGuide,
  // },
  // {
  //   path: "/about",
  //   exact: true,
  //   component: About,
  // },
  // {
  //   path: "/api-list",
  //   exact: true,
  //   component: APIList,
  // },
  // {
  //   path: "/api-list/:id",
  //   exact: true,
  //   component: APIDetails,
  // },
  // {
  //   path: "/docs",
  //   exact: true,
  //   component: Docs,
  // },
  // {
  //   path: "/custom",
  //   exact: true,
  //   component: Custom,
  // },
  // {
  //   path: "/login",
  //   exact: true,
  //   component: LogIn,
  // },
  // {
  //   path: "/",
  //   exact: false,
  //   component: NotFound,
  // },
];

export default Routes;
