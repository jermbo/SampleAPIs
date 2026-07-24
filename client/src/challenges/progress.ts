/** Track progress persistence — localStorage only, no accounts, mirroring the
 *  Playground's own per-URL persistence. */

import type { Track } from "./types";

interface StoredProgress {
  /** Completed challenge ids with completion timestamps (ms since epoch). */
  completed: Record<string, number>;
}

const progressKey = (trackId: string) => `sampleapis:challenges:${trackId}`;
const codeKeyPrefix = (trackId: string) => `sampleapis:challenges:code:${trackId}:`;

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
  const prefix = codeKeyPrefix(trackId);
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) localStorage.removeItem(key);
  }
}

export interface TrackStats {
  done: number;
  total: number;
  firstIncomplete: number;
}

export function getTrackStats(track: Track, completed: Set<string>): TrackStats {
  const total = track.challenges.length;
  const done = track.challenges.filter((c) => completed.has(c.id)).length;
  const idx = track.challenges.findIndex((c) => !completed.has(c.id));
  const firstIncomplete = idx === -1 ? 1 : idx + 1;
  return { done, total, firstIncomplete };
}

export function getCtaLabel(stats: TrackStats): string {
  if (stats.done === 0) return "Start";
  if (stats.done === stats.total) return "Start over";
  return "Continue";
}

export function getResumeStep(stats: TrackStats): number {
  if (stats.done === stats.total) return 1;
  return stats.firstIncomplete;
}
