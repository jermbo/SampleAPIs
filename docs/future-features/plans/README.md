---
title: Implementation Roadmap
description: Review-ordered index of implementation plans and decision logs for every proposed feature
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md)

# Implementation Roadmap

Every [proposal](../README.md) now has two companion documents: an **implementation plan** (user stories, architecture grounded in the current code, build phases, verification) and a **decision log** (the choices only the maintainer can make, each with options and a recommendation). This page is the review dashboard — work through it one feature at a time, in any order, across separate sessions.

## How to review a feature

1. Skim the **proposal** (you've seen these) for the framing.
2. Read the **implementation plan** — it says how it would actually be built and in what phases.
3. Answer the **decision log**: each decision has a `**Decision:** _Pending_` line. Edit the file, or just state your answers in a session ("For HTTP Inspector: D1 = A, D2 = yes, D3 = A") and have the doc updated. _Accepting all recommendations is a valid one-line answer._
4. When a log has no pending decisions, flip its row below to ✅ **ready to build**.

Statuses: 🟡 awaiting decisions · ✅ ready to build · 🔨 in progress · 🚢 shipped (page moves out of future-features) · ❌ rejected (rationale recorded in [Decisions](../../decisions/README.md)).

## The features

Ordered by the suggested build sequence; dependencies noted. "Key decision" is the one to think hardest about.

| #   | Feature                                                        | Plan                                                   | Decisions                                        | Pending | Key decision                                | Status |
| --- | -------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ | ------- | ------------------------------------------- | ------ |
| 1   | [HTTP Inspector](../http-inspector.md)                         | [plan](./http-inspector-implementation.md)             | [log](./http-inspector-decisions.md)             | 3       | Panel layout (tabs vs. interleaved)         | 🟡     |
| 2   | [Multi-Language Snippets](../multi-language-snippets.md)       | [plan](./multi-language-snippets-implementation.md)    | [log](./multi-language-snippets-decisions.md)    | 3       | Language set (permanent maintenance)        | 🟡     |
| 3   | [Shareable Playground Links](../shareable-playground-links.md) | [plan](./shareable-playground-links-implementation.md) | [log](./shareable-playground-links-decisions.md) | 3       | What a link pins (code vs. code + endpoint) | 🟡     |
| 4   | [Response Shape Viewer](../response-shape-viewer.md)           | [plan](./response-shape-viewer-implementation.md)      | [log](./response-shape-viewer-decisions.md)      | 3       | Sample size (also governs #5)               | 🟡     |
| 5   | [Query Builder](../query-builder.md)                           | [plan](./query-builder-implementation.md)              | [log](./query-builder-decisions.md)              | 3       | Operator scope (what the UI teaches)        | 🟡     |
| 6   | [Error Practice Routes](../error-practice-routes.md)           | [plan](./error-practice-routes-implementation.md)      | [log](./error-practice-routes-decisions.md)      | 4       | Namespace (permanent URL contract)          | 🟡     |
| 7   | [Guided Challenges](../guided-challenges.md)                   | [plan](./guided-challenges-implementation.md)          | [log](./guided-challenges-decisions.md)          | 4       | Check expressiveness (shapes contributions) | 🟡     |
| 8   | [Auth Training Wheels](../auth-training-wheels.md)             | [plan](./auth-training-wheels-implementation.md)       | [log](./auth-training-wheels-decisions.md)       | 5       | **D0 go/no-go** + promise guardrails        | 🟡     |
| 9   | [Scratch Endpoints](../scratch-endpoints.md)                   | [plan](./scratch-endpoints-implementation.md)          | [log](./scratch-endpoints-decisions.md)          | 5       | **D0 build/defer/reject**                   | 🟡     |

## Dependencies and shared machinery

```mermaid
flowchart TD
    HI[1. HTTP Inspector<br/>fetch wrapper + __net events] --> GC[7. Guided Challenges<br/>request-level checks]
    SL[3. Shareable Links] -.enhances.-> GC
    EP[6. Error Practice Routes] -.enables tracks.-> GC
    RS[4. Response Shape Viewer] <-->|shared deriveShape\(\) + sample fetch| QB[5. Query Builder]
    HI -.CORS exposedHeaders.-> QB
    ML[2. Multi-Language Snippets]
    GC -.demand signal.-> SC[9. Scratch Endpoints<br/>gated on D0]
    AU[8. Auth Training Wheels<br/>gated on D0]
```

Hard rules that fall out of the plans:

- **#1 before #7** — challenges assert on the fetch wrapper's events; build the wrapper once, in the inspector.
- **#4 and #5 share `deriveShape()`** and one sample fetch; whichever builds first creates the utility (and the tab shell, per [Shape Viewer D3](./response-shape-viewer-decisions.md#d3--relationship-to-the-query-builder)).
- The **CORS `exposedHeaders` change** (one line, in the [inspector plan](./http-inspector-implementation.md)) unblocks header reading for #1, #5, and #8 — worth doing with whichever lands first.
- **#8 and #9 are decision-gated**: their D0s (go/no-go; build/defer/reject) are maintainer calls that precede any code.
- **#2 and #3 are fully independent** — good candidates whenever a small win is wanted.

## Cross-cutting note: client unit testing

The client has no test runner today (lint + `tsc` only). Three roadmap pieces are pure functions that genuinely deserve unit tests: `deriveShape()`/`toTypeScript()` (#4/#5), `buildQueryString()` (#5), and the challenge check evaluator (#7). The first of those to be built should bring **vitest** with it (it fits the existing Vite setup); the plans each note this rather than deciding it — treat "add vitest" as accepted the first time one of those features is greenlit.

## Related

- [Future Features](../README.md) — the proposals these plans elaborate
- [Decisions](../../decisions/README.md) — where accepted/rejected outcomes get recorded permanently
- [Glossary](../../glossary.md) — shared vocabulary used throughout these plans
