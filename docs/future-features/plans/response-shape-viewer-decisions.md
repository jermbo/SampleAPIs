---
title: Response Shape Viewer — Decisions
description: Open decisions to resolve before building the fields-and-types view
audience: [developer, architect]
status: ready-to-build
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Response Shape Viewer — Decisions

Decisions needed before the [implementation plan](./response-shape-viewer-implementation.md) is buildable. D1 also governs the [Query Builder](./query-builder-decisions.md), which shares the sample fetch.

## D1 — Sample size

**Question:** How many records does the shared sample fetch pull for shape derivation and the field picker?

**Why it matters:** Too few records under-reports rare fields (a field on record #60 never appears); too many wastes bandwidth on large datasets and slows first paint of the panel.

| Option                                       | Pros                                                                                                    | Cons                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **A. First 50 (`?_limit=50`) (recommended)** | One request, bounded size, catches most raggedness; coverage denominator ("12/50") stays comprehensible | Fields that first appear deep in a large dataset are missed                    |
| B. First page only (server default 10)       | Cheapest possible                                                                                       | Coverage numbers on 10 records are noise; misses too much                      |
| C. Whole collection (no `_limit`)            | Exact coverage                                                                                          | Datasets can be large; punishes every details-page visit for marginal accuracy |

**Recommendation:** A, with the UI honest about it: label the panel "based on the first 50 records".

**Decision:** **A** — first 50 (`?_limit=50`), labeled honestly in the UI. (2026-07-11, accepted recommendation; revisit after seeing it in action.)

## D2 — Output formats

**Question:** Is TypeScript the only copyable format, or also JSON Schema?

| Option                               | Pros                                                                               | Cons                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A. TypeScript only (recommended)** | One emitter to keep correct; TS is where the site's JS-learner audience is heading | Non-TS users (Python learners) get nothing copyable                                              |
| B. TypeScript + JSON Schema          | JSON Schema serves validation tutorials and non-JS users                           | Second emitter to maintain and test; JSON Schema's optionality/union rules are fussier than TS's |

**Recommendation:** A. Revisit if [Multi-Language Snippets](./multi-language-snippets-implementation.md) proves out non-JS demand.

**Decision:** **A** — TypeScript only. (2026-07-11, accepted recommendation.)

## D3 — Relationship to the Query Builder

**Question:** If both this and the [Query Builder](./query-builder-implementation.md) are accepted, do they present as one combined "Explore" panel or two independent sections?

**Why it matters:** They share data and audience moment ("I just picked an endpoint — what's in it?"), but combining couples their delivery schedules.

| Option                                                                       | Pros                                                                                                               | Cons                                                          |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **A. One panel, two tabs: Shape / Query (recommended if both are greenlit)** | One collapsible section, one sample fetch, one mental unit; field names seen in Shape are the ones picked in Query | Whichever ships second must slot into the first's shell       |
| B. Two independent sections                                                  | Each ships fully standalone                                                                                        | Two panels doing a sample fetch side by side reads as clutter |

**Recommendation:** A — build whichever comes first with a tab-shell from day one (a one-tab tab bar is fine).

**Decision:** **A** — one combined panel with Shape / Query tabs; both features greenlit together, so the shell is built once. (2026-07-11, accepted recommendation.)

## Ready-to-build checklist

- [x] D1–D3 answered (D1's answer copied into the Query Builder's plan context)
- [x] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./response-shape-viewer-implementation.md) · [Proposal](../response-shape-viewer.md) · [Roadmap](./README.md)
- [Query Builder — Decisions](./query-builder-decisions.md)
