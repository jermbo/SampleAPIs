---
title: HTTP Inspector — Decisions
description: Open decisions to resolve before building the Playground network panel
audience: [developer, architect]
status: ready-to-build
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# HTTP Inspector — Decisions

Decisions needed before the [implementation plan](./http-inspector-implementation.md) is buildable. For each: read the options, then fill in the **Decision** line (edit this file, or just answer in a session and have the doc updated). Recommendations are marked — accepting all of them is a fine answer.

## D1 — Panel layout

**Question:** Does network activity get its own tab next to Output, or interleave into the console stream?

**Why it matters:** This is the main UI surface of the feature and hard to reverse once learners build habits around it.

| Option                                                    | Pros                                                                                                                     | Cons                                                                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **A. Tabs: Output / Network (recommended)**               | Mirrors browser DevTools, so the skill transfers; each view stays clean; badge count on the Network tab signals activity | One extra click to see requests; request↔log chronology is lost across tabs          |
| B. Interleaved: request rows inline between console lines | One stream shows cause and effect in order ("fetched → then logged")                                                     | No DevTools analogue; noisy for loops that fetch many times; harder to scan statuses |

**Recommendation:** A — DevTools familiarity is the pedagogical point. Add an unread-count badge so activity in the hidden tab isn't missed.

**Decision:** **A — Output / Network tabs**, with an unread-count badge on the Network tab. _(2026-07-10, accepted recommendation)_

## D2 — Failure explainers

**Question:** When a request fails (network error, CORS) or hits a 429, does the row include a plain-language explanation in v1?

**Why it matters:** `TypeError: Failed to fetch` is the single most confusing error a beginner meets; explaining it is squarely on-mission but is copywriting work that needs maintaining.

| Option                          | Pros                                                                                                                | Cons                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **A. Yes, in v1 (recommended)** | Highest teaching value per line of code in the whole feature; only ~4 cases to write (network error, 404, 429, 5xx) | Copy must be written carefully; wrong guesses about CORS causes would mislead |
| B. Defer to a later pass        | Ships faster; explainers can be informed by real confusion                                                          | v1 shows failures without helping, which is half the point                    |

**Recommendation:** A — keep it to four short, hedged messages ("This usually means…"), each linking to the relevant wiki page.

**Decision:** **A — yes, in v1.** Four hedged messages (network error, 404, 429, 5xx), each linking to the relevant wiki page. _(2026-07-10, accepted recommendation)_

## D3 — Header display

**Question:** In the expanded row, show a curated set of headers or everything the browser exposes?

| Option                                                           | Pros                                                                                                                      | Cons                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **A. Curated list with an "all headers" expander (recommended)** | Teaching headers (`X-Total-Count`, `Link`, `RateLimit-*`, `Content-Type`) surface first; full list remains one click away | Curation list to maintain as headers change                                                                |
| B. All exposed headers, unfiltered                               | Zero curation; nothing hidden                                                                                             | The interesting ones drown among `cache-control` noise; browsers expose few anyway without the CORS change |

**Recommendation:** A. The curated list doubles as the `exposedHeaders` list in the server config — one source of truth, documented in the plan.

**Decision:** **A — curated list with an "all headers" expander.** The curated list and the server's `exposedHeaders` config stay one source of truth. _(2026-07-10, accepted recommendation)_

## Ready-to-build checklist

- [x] D1 answered
- [x] D2 answered
- [x] D3 answered
- [x] Roadmap status updated to _ready to build_ in [Plans](./README.md)

## Related

- [Implementation plan](./http-inspector-implementation.md) · [Proposal](../http-inspector.md) · [Roadmap](./README.md)
