import { createFileRoute } from "@tanstack/react-router";
import Docs from "../pages/Docs/Docs";

export const Route = createFileRoute("/docs")({
  component: Docs,
});
