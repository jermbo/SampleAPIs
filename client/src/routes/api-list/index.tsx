import { createFileRoute } from "@tanstack/react-router";
import APIList from "../../pages/APIList/APIList";

export const Route = createFileRoute("/api-list/")({
  component: APIList,
});
