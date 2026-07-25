import type { Track } from "./types";
import { restBasics } from "./rest-basics";

/** All available tracks, in display order. Adding a track = adding a data file
 *  and listing it here (same spirit as contributing a dataset). */
export const TRACKS: Track[] = [restBasics];

export const findTrack = (id: string): Track | undefined =>
  TRACKS.find((t) => t.id === id);

/** Tracks that run against a given API — drives the details-page banner. */
export const tracksForApi = (apiLink: string): Track[] =>
  TRACKS.filter((t) => t.apiLink === apiLink);
