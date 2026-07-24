---
title: Shareable Playground Links — Decisions
description: Open decisions to resolve before building URL-encoded playground sharing
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Shareable Playground Links — Decisions

Decisions needed before the [implementation plan](./shareable-playground-links-implementation.md) is buildable.

## D1 — What a link pins

**Question:** Does a shared link carry only the code, or also the selected endpoint (and snippet tab)?

**Why it matters:** The Playground's starter URL depends on which endpoint is selected on the details page. A link that doesn't pin the endpoint can open with code referencing `/futurama/characters` while the page has `/futurama/episodes` selected — confusing for exactly the beginners the feature serves.

| Option                                        | Pros                                                                                 | Cons                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **A. Code + selected endpoint (recommended)** | Recipient sees precisely what the sharer saw; endpoint is a few bytes in the payload | Endpoint selection state currently lives in APIDetails, so the fragment logic reaches one component higher |
| B. Code only                                  | Smallest change, Playground-internal                                                 | Wrong-endpoint confusion; shared POST examples may hit the wrong resource                                  |
| C. Code + endpoint + active snippet tab       | Fully faithful                                                                       | The tab is cosmetic once code is loaded; not worth the bytes or plumbing                                   |

**Recommendation:** A. The snippet tab is irrelevant after load; the endpoint is not.

**Decision:** _Pending_

## D2 — Fragment lifecycle after load

**Question:** Once a shared link has loaded, does the fragment stay in the address bar?

| Option                                                                    | Pros                                                                                                            | Cons                                                                                                       |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **A. Keep until first edit, then strip via `replaceState` (recommended)** | Address bar stays re-shareable while the code is still the shared code; goes stale-proof the moment it diverges | Slightly more logic (strip hook on first edit)                                                             |
| B. Keep always                                                            | Re-shareable forever; zero logic                                                                                | After edits, the URL silently lies about what's in the editor — someone re-copies it and shares stale code |
| C. Strip immediately on load                                              | Clean URL, never stale                                                                                          | Recipient can't re-share what they just received without using the Share button                            |

**Recommendation:** A — the URL should never disagree with the editor.

**Decision:** _Pending_

## D3 — Shared-mode banner

**Question:** Does opening a shared link show an explicit banner ("Viewing shared code — your saved code is untouched · Restore my code"), or is the swap silent?

| Option                                            | Pros                                                                                                                                                        | Cons                                                                                                               |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **A. Banner with a restore action (recommended)** | Makes the no-clobber guarantee visible; gives an escape hatch _before_ first-edit adoption replaces saved code; tells recipients they're in a special state | One more UI element and copy string to maintain                                                                    |
| B. Silent swap                                    | Zero UI work                                                                                                                                                | A visitor with saved work has no way to know it's safe, or to get back to it without clearing the fragment by hand |

**Recommendation:** A — the banner is what makes the adopt-on-edit rule honest.

**Decision:** _Pending_

## Ready-to-build checklist

- [ ] D1–D3 answered
- [ ] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./shareable-playground-links-implementation.md) · [Proposal](../shareable-playground-links.md) · [Roadmap](./README.md)
