import { createFileRoute } from "@tanstack/react-router";
import LearnTrack from "../../pages/Learn/LearnTrack";

export const Route = createFileRoute("/learn/$trackId/$step")({
  component: LearnTrack,
});
