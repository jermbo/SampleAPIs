import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/Header/Header";
import NotFound from "../pages/NotFound/NotFound";
import "../styles/styles.css";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <>
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </>
  );
}
