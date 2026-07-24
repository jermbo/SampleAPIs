---
title: Guided Challenges — Decisions
description: Open decisions to resolve before building the challenge system
audience: [developer, architect]
status: ready-to-build
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Guided Challenges — Decisions

Decisions needed before the [implementation plan](./guided-challenges-implementation.md) is buildable. These are the highest-stakes decisions in the roadmap — D1 and D3 shape the contribution model and curriculum for years.

## D1 — Check expressiveness

**Question:** Are challenge checks a declarative spec (fixed vocabulary of check kinds) or arbitrary JavaScript predicates?

**Why it matters:** This decides who can safely author tracks, what PR review of content looks like, and whether the harness stays testable.

| Option                                                                                                                 | Pros                                                                                                                                                             | Cons                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Declarative spec (recommended)**                                                                                  | Contributor content is data — reviewable at a glance, no code execution concerns in review; evaluator is one unit-tested function; check kinds grow deliberately | Some exercises are inexpressible ("output is sorted descending") until a kind exists for them                                                        |
| B. Arbitrary JS check functions                                                                                        | Anything is checkable from day one                                                                                                                               | Every community track PR is a code review of test logic; subtle-wrong checks are the #1 way to frustrate learners; harness surface becomes unbounded |
| C. Declarative + a named-predicate escape hatch (predicates live in reviewed core code, tracks reference them by name) | Extensible without giving tracks code; core team controls the vocabulary                                                                                         | Slightly more machinery; escape hatch can become a dumping ground without discipline                                                                 |

**Recommendation:** C — start with the declarative catalog from the plan, add named predicates only when a pilot-track exercise genuinely needs one.

**Decision:** **C — declarative spec + named-predicate escape hatch.** Start with only the declarative catalog from the plan; a named predicate is added (in reviewed core code) only when a pilot-track exercise genuinely can't be expressed without one. Tracks never contain executable check logic. _(2026-07-10, accepted recommendation)_

## D2 — Placement and routing

**Question:** Do challenges live on the API details page, or on a dedicated `/learn` route with a track index?

| Option                                                                   | Pros                                                                                                                                                                             | Cons                                                                                                                                                     |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Dedicated `/learn` route hosting its own Playground (recommended)** | Room for a track index, progress overview, and future concept tracks that hop across APIs; details page stays a reference surface; clean shareable URLs (`/learn/rest-basics/3`) | A second place that embeds the Playground; learners must find `/learn` (mitigate: banner on details pages that have a track)                             |
| B. Challenge drawer on the API details page                              | Zero new routes; challenges discovered exactly where learners already are                                                                                                        | Page becomes very dense (endpoints + query builder + shape viewer + playground + challenges); cross-API tracks have no home; hard to reverse once linked |
| C. Both: `/learn` is canonical, details page deep-links into it          | Best discovery and best structure                                                                                                                                                | Slightly more nav plumbing                                                                                                                               |

**Recommendation:** C — build A, add the details-page banner ("This API has a practice track →") as a final phase-4 touch.

**Decision:** **C — `/learn` is canonical, details pages deep-link into it.** Build the dedicated `/learn` route (option A) first; the details-page banner ("This API has a practice track →") lands as a phase-4 touch. _(2026-07-10, accepted recommendation)_

## D3 — Curriculum shape

**Question:** Are tracks organized per-API ("the Futurama track") or per-concept ("REST basics", using whichever API fits)?

| Option                                                                      | Pros                                                                                                                                                                               | Cons                                                                                                                                      |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Concept tracks (recommended)**                                         | Matches how learning actually progresses (GET → query → POST → errors); one great "REST basics" track serves every visitor; error-handling and auth tracks slot in naturally later | Contributors with a dataset can't trivially add "the track for my API"; needs editorial judgment about which API illustrates each concept |
| B. Per-API tracks                                                           | Perfectly parallel to the dataset contribution model; "adopt an API, write its track"                                                                                              | Every track re-teaches GET/POST from scratch or assumes knowledge it can't check; N mediocre parallel tracks instead of one good sequence |
| C. Concept tracks as the spine, per-API tracks allowed as community content | Both doors open                                                                                                                                                                    | Two content models to document and review                                                                                                 |

**Recommendation:** A for the pilot (a "REST basics" concept track that happens to live on Futurama), explicitly deferring C until community demand shows up.

**Decision:** **A — concept tracks.** The pilot is a "REST basics" concept track that happens to run on Futurama. Per-API community tracks (option C) are explicitly deferred until demand shows up. _(2026-07-10, accepted recommendation)_

## D4 — Hint and solution policy

**Question:** When do learners see hints, and do challenges ship visible solutions?

| Option                                                                                                 | Pros                                                                                                                                                                     | Cons                                                                                             |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **A. Hints reveal one-per-click anytime; solution unlocks after all hints are revealed (recommended)** | Respects learner autonomy (no artificial gating on failed attempts); solution is always reachable so nobody is permanently stuck — matters with no human support channel | Impatient learners can click straight through to the solution                                    |
| B. Hints unlock only after N failed runs; no visible solutions                                         | Maximizes struggle-time, which correlates with retention                                                                                                                 | Failing-run counting punishes experimenters; stuck learners with no path to an answer just leave |
| C. Everything visible immediately (prompt, hints, solution)                                            | Simplest; treats material as a worked-examples book                                                                                                                      | Removes the self-test value of validation entirely                                               |

**Recommendation:** A — with the solution view worded as a worked example ("one way to do it"), reinforcing that checks accept other correct answers.

**Decision:** **A — hints reveal one-per-click anytime; the solution unlocks after all hints are revealed.** Solution view is worded as a worked example ("one way to do it"). _(2026-07-10, accepted recommendation)_

## Ready-to-build checklist

- [x] D1–D4 answered
- [ ] [HTTP Inspector](./http-inspector-decisions.md) decided and its wrapper shipped (hard prerequisite) — _decisions ✅ 2026-07-10; wrapper not yet built, so the inspector builds first_
- [x] Pilot-track subject confirmed (plan assumes Futurama) — confirmed: Futurama
- [x] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./guided-challenges-implementation.md) · [Proposal](../guided-challenges.md) · [Roadmap](./README.md)
