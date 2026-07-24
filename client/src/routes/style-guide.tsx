import { createFileRoute } from "@tanstack/react-router";
import StyleGuide from "../pages/StyleGuide/StyleGuide";

export const Route = createFileRoute("/style-guide")({
  component: StyleGuide,
});
