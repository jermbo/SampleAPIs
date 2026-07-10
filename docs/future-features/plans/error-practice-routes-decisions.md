---
title: Error Practice Routes — Decisions
description: Open decisions to resolve before building the delay/status/flaky endpoints
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Error Practice Routes — Decisions

Decisions needed before the [implementation plan](./error-practice-routes-implementation.md) is buildable.

## D1 — Namespace

**Question:** What URL prefix do the practice routes live under?

**Why it matters:** It's a public URL contract — once tutorials link `…/practice/status/500`, it never moves. It also must never collide with a dataset name mounted at `/` (dataset links occupy the root namespace).

| Option                                     | Pros                                                                                                                                                                                                                                                 | Cons                                                                                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A. `/practice/…` (recommended)**         | Self-describing ("this is for practicing"); zero overlap with the informal "service routes" concept (health, reset, create); safe from dataset-name collisions as long as no dataset is ever named `practice` — reserve the name in contributor docs | New top-level prefix to document                                                                                                                       |
| B. `/service/…`                            | Matches the proposal sketch                                                                                                                                                                                                                          | "Service routes" already means health/reset/create in the docs — overloading the word invites confusion between operational routes and teaching routes |
| C. httpbin-style at root (`/status/:code`) | Familiar to httpbin users                                                                                                                                                                                                                            | Permanently poisons the root namespace for future datasets named `status`, `delay`, `flaky`                                                            |

**Recommendation:** A — and add `practice` (plus the other reserved prefixes) to [Adding an Endpoint](../../data/adding-an-endpoint.md)'s naming rules as part of this feature.

**Decision:** _Pending_

## D2 — Flaky determinism

**Question:** Is `/flaky` purely random, or reproducible on demand?

**Why it matters:** [Guided Challenges](./guided-challenges-implementation.md) wants to assert "your retry logic eventually succeeded" — pure randomness makes a challenge that can fail even with correct code.

| Option                                                             | Pros                                                                                                                                                                                                      | Cons                                                                                   |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **A. Random by default, deterministic with `?key=` (recommended)** | `?key=anything` yields a fixed fail/fail/succeed-style sequence per key (hash of key + per-key request counter), so challenges and classrooms get reproducibility; casual users keep realistic randomness | Per-key counters are server-side state — keep them in a small LRU so memory is bounded |
| B. Purely random (`?rate=` only)                                   | Stateless, simplest                                                                                                                                                                                       | Challenges can't reliably assert on it; a correct solution can 500 five times in a row |
| C. Deterministic only (fixed cycle)                                | Fully predictable, stateless if cycle keys off IP+count                                                                                                                                                   | Predictable-after-one-read makes the "handle uncertainty" lesson weaker                |

**Recommendation:** A — randomness is the lesson, the key is the test hook.

**Decision:** _Pending_

## D3 — `/slow-drip` in v1?

**Question:** Ship the streaming endpoint now, or defer it?

| Option                                                                                    | Pros                                                                                                                                                                             | Cons                                                                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **A. Defer (recommended)**                                                                | The other three routes cover the high-value lessons with bounded risk; streaming holds connections longer than `/delay` and teaches a niche skill (`ReadableStream` consumption) | The streaming lesson stays untaught                                            |
| B. Ship it with tight caps (≤10 s total, small chunks, same concurrency pool as `/delay`) | Complete httpbin-style set; progress events are showy in the HTTP Inspector                                                                                                      | The most expensive route for the least-demanded lesson; more cap logic to test |

**Recommendation:** A — revisit after observing real usage of `/delay`.

**Decision:** _Pending_

## D4 — Rate-limit values

**Question:** What limits apply to the practice routes?

**Why it matters:** These routes _invite_ tight request loops (retries); the limiter is part of the curriculum design, not just protection — too strict and the backoff exercise 429s before it teaches, too loose and it's an abuse vector.

| Option                                                                                  | Pros                                                                                                                               | Cons                                                                             |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **A. Dedicated limiter: ~300 req / 15 min per IP + the concurrency caps (recommended)** | Enough for dozens of retry-exercise runs per session; an unbounded retry loop hits the wall in seconds, which is itself the lesson | New limiter config to maintain                                                   |
| B. Reuse `apiLimits` (5000 / 15 min)                                                    | No new config                                                                                                                      | 5000 delayed/flaky requests per IP per window is a lot of held sockets and churn |

**Recommendation:** A, with the 429 body explicitly teaching ("you've sent N requests in M minutes — real APIs will cut you off too; add backoff").

**Decision:** _Pending_

## Ready-to-build checklist

- [ ] D1–D4 answered
- [ ] Reserved-prefix note added to contributor docs (falls out of D1)
- [ ] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./error-practice-routes-implementation.md) · [Proposal](../error-practice-routes.md) · [Roadmap](./README.md)
