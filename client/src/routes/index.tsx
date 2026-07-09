import { createFileRoute } from "@tanstack/react-router";
import Home from "../pages/Home/Home";

export const Route = createFileRoute("/")({
  component: Home,
});
