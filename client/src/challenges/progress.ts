/** Track progress persistence — localStorage only, no accounts, mirroring the
 *  Playground's own per-URL persistence. */

interface StoredProgress {
  /** Completed challenge ids with completion timestamps (ms since epoch). */
  completed: Record<string, number>;
}

const progressKey = (trackId: string) => `sampleapis:challenges:${trackId}`;

export function getCompleted(trackId: string): Set<string> {
  try {
    const raw = localStorage.getItem(progressKey(trackId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as StoredProgress;
    return new Set(Object.keys(parsed.completed ?? {}));
  } catch {
    return new Set();
  }
}

export function markCompleted(trackId: string, challengeId: string): void {
  const stored: StoredProgress = { completed: {} };
  try {
    const raw = localStorage.getItem(progressKey(trackId));
    if (raw) stored.completed = (JSON.parse(raw) as StoredProgress).completed ?? {};
  } catch {
    /* corrupted entry — start fresh */
  }
  if (stored.completed[challengeId]) return;
  stored.completed[challengeId] = Date.now();
  localStorage.setItem(progressKey(trackId), JSON.stringify(stored));
}

export function resetProgress(trackId: string): void {
  localStorage.removeItem(progressKey(trackId));
}
