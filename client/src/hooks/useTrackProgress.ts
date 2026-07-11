import { useCallback, useMemo, useState } from "react";
import type { Track } from "../challenges/types";
import { getCompleted, getTrackStats, markCompleted, resetProgress } from "../challenges/progress";

/** Reads track progress from localStorage and re-reads after reset or completion. */
export const useTrackProgress = (track: Track) => {
  const [tick, setTick] = useState(0);

  const completed = useMemo(
    () => getCompleted(track.id),
    // tick busts the cache after reset/markComplete — not used in the body, but required
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track.id, tick]
  );
  const stats = useMemo(() => getTrackStats(track, completed), [track, completed]);

  const bump = useCallback(() => setTick((n) => n + 1), []);

  const reset = useCallback(() => {
    resetProgress(track.id);
    bump();
  }, [track.id, bump]);

  const markComplete = useCallback(
    (challengeId: string) => {
      markCompleted(track.id, challengeId);
      bump();
    },
    [track.id, bump]
  );

  return {
    completed,
    stats,
    reset,
    markComplete,
    canReset: stats.done > 0,
  };
};
