import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/Header/Header";
import NotFound from "../pages/NotFound/NotFound";
import "../styles/styles.scss";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <main className="content">
      <Header />
      <Outlet />
    </main>
  );
}
