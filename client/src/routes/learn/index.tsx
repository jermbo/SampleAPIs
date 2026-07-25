import { createFileRoute } from "@tanstack/react-router";
import Learn from "../../pages/Learn/Learn";

export const Route = createFileRoute("/learn/")({
  component: Learn,
});
