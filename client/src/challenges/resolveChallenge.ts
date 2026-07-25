import { findTrack } from "./index";
import type { Challenge, Track } from "./types";

export interface ResolvedChallenge {
  track: Track;
  challenge: Challenge;
  stepNum: number;
  totalSteps: number;
}

export const resolveChallenge = (
  trackId: string,
  step: string
): ResolvedChallenge | undefined => {
  const track = findTrack(trackId);
  const stepNum = Number(step);
  const validStep =
    !!track &&
    Number.isInteger(stepNum) &&
    stepNum >= 1 &&
    stepNum <= track.challenges.length;
  if (!track || !validStep) return undefined;
  return {
    track,
    challenge: track.challenges[stepNum - 1],
    stepNum,
    totalSteps: track.challenges.length,
  };
};
