---
title: Query Builder — Decisions
description: Open decisions to resolve before building the visual query panel
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Query Builder — Decisions

Decisions needed before the [implementation plan](./query-builder-implementation.md) is buildable. Fill in each **Decision** line, or answer in a session and have the doc updated. Note: sample-size for field discovery is decided once, in [Response Shape Viewer D1](./response-shape-viewer-decisions.md#d1--sample-size), since both features share the fetch.

## D1 — Placement on the API details page

**Question:** Where does the builder live relative to the Playground?

**Why it matters:** The details page is already dense (header, endpoint list, Playground); this sets its information hierarchy for every feature that follows.

| Option                                                                                | Pros                                                                                                          | Cons                                                                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **A. Collapsible section between the endpoint list and the Playground (recommended)** | Natural reading order: pick endpoint → explore queries → write code; collapsed by default keeps the page calm | Page gets taller; two fetch-y widgets stacked                                                         |
| B. A tab alongside the Playground (one visible at a time)                             | Compact; no scroll growth                                                                                     | Hides the Playground while querying — breaks the "click, then code" bridge the Send button depends on |
| C. Below the Playground                                                               | Playground stays primary                                                                                      | Discovery suffers — the feature exists to be stumbled into                                            |

**Recommendation:** A, collapsed by default with a one-line teaser ("Filter, sort, and paginate this endpoint — no code required").

**Decision:** _Pending_

## D2 — Operator scope

**Question:** Which of the server's query operators get controls in v1?

**Why it matters:** The builder is a teaching surface: whatever it shows is what learners believe the API can do — and each control is UI + testing surface.

| Option                                                                                                                       | Pros                                                                                              | Cons                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **A. Full documented surface (recommended)**: equality, `_gte`/`_lte`/`_ne`/`_like`, `q`, multi-field sort, `_page`/`_limit` | The point is discoverability of what already exists; all of it is documented and stable           | More controls to design; multi-sort UI is fiddly                              |
| B. Minimal: equality + single sort + `_page`/`_limit`                                                                        | Small, clean v1; covers 80% of usage                                                              | Learners never find `_like`/`_gte` — the least discoverable, most useful part |
| C. Full filters, but single-field sort and `_page`-only pagination                                                           | Nearly full teaching value; skips the two fiddliest controls (`_start`/`_end` ranges, multi-sort) | Slice syntax (`_start`/`_end`) stays undiscovered — arguably fine, it's niche |

**Recommendation:** C — all filter operators and `q` (the high-value lesson), single sort field, `_page`/`_limit` pagination. Ranges and multi-sort stay documented-but-unclicked.

**Decision:** _Pending_

## D3 — Preview fetch behavior

**Question:** Does the results preview fetch automatically as controls change, or only on an explicit button?

| Option                                                          | Pros                                                                                                            | Cons                                                      |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **A. Auto-fetch, debounced ~400 ms (recommended)**              | Instant cause-and-effect is the core teaching loop; limits are generous (5000 req/15 min per IP on data routes) | Burns requests while typing; a buggy debounce hits 429s   |
| B. Explicit "Run query" button                                  | Rate-limit-friendly; deliberate                                                                                 | Kills the live feel; one more concept before any feedback |
| C. Auto for control clicks, explicit for free-text value typing | Balanced traffic                                                                                                | Two behaviors to explain and maintain                     |

**Recommendation:** A, plus: pause when the browser tab is hidden, and cancel in-flight requests on change (TanStack Query handles both cheaply).

**Decision:** _Pending_

## Ready-to-build checklist

- [ ] D1–D3 answered
- [ ] [Response Shape Viewer D1 (sample size)](./response-shape-viewer-decisions.md#d1--sample-size) answered — shared dependency
- [ ] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./query-builder-implementation.md) · [Proposal](../query-builder.md) · [Roadmap](./README.md)
