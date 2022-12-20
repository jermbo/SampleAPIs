import { lazy } from "react";

const AppRoutes = [
  {
    path: "/",
    component: lazy(() => import("../pages/Home/Home")),
  },
  {
    path: "/style-guide",
    component: lazy(() => import("../pages/StyleGuide/StyleGuide")),
  },
  {
    path: "/about",
    component: lazy(() => import("../pages/About/About")),
  },
  {
    path: "/docs",
    component: lazy(() => import("../pages/Docs/Docs")),
  },
  {
    path: "/api-list",
    component: lazy(() => import("../pages/APIList/APIList")),
  },
  {
    path: "/api-list/:id",
    component: lazy(() => import("../pages/APIDetails/APIDetails")),
  },
  {
    path: "/",
    exact: false,
    component: lazy(() => import("../pages/NotFound/NotFound")),
  },
];

export default AppRoutes;
