import { useCallback, useMemo, useState } from "react";
import type { Track } from "../challenges/types";
import { getCompleted, getTrackStats, resetProgress } from "../challenges/progress";

/** Reads track progress from localStorage and re-reads after reset. */
export const useTrackProgress = (track: Track) => {
  const [tick, setTick] = useState(0);

  const completed = useMemo(() => getCompleted(track.id), [track.id, tick]);
  const stats = useMemo(() => getTrackStats(track, completed), [track, completed]);

  const reset = useCallback(() => {
    resetProgress(track.id);
    setTick((n) => n + 1);
  }, [track.id]);

  return {
    stats,
    reset,
    canReset: stats.done > 0,
  };
};
