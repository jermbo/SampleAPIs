import { createFileRoute } from "@tanstack/react-router";
import APIDetails from "../../pages/APIDetails/APIDetails";

export const Route = createFileRoute("/api-list/$id")({
  component: APIDetails,
});
