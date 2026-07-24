---
title: Error Practice Routes
description: httpbin-style service endpoints — delays, forced statuses, flakiness — for practicing error handling
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# Error Practice Routes

**Status: proposed.** High learning impact, medium effort. Server-side counterpart to the [HTTP Inspector](./http-inspector.md).

## Problem

Real-world API work is mostly about what goes wrong — timeouts, 500s, flaky networks, rate limits — but SampleAPIs endpoints are deliberately well-behaved. Learners can't practice retry logic, `AbortController` timeouts, or graceful degradation against endpoints that never misbehave. A no-auth sandbox is exactly the safe place to practice failure.

## Proposal

A small set of service routes (httpbin is the precedent), documented alongside the existing [Service Routes](../api/service-routes.md):

| Route                     | Behavior                                      | Teaches                                     |
| ------------------------- | --------------------------------------------- | ------------------------------------------- |
| `/service/delay/:seconds` | Responds after N seconds (capped, e.g. ≤ 10)  | Timeouts, `AbortController`, loading states |
| `/service/status/:code`   | Returns that status with a matching JSON body | Status-code handling, error branching       |
| `/service/flaky`          | Fails ~50% of requests with a 500             | Retry with backoff                          |
| `/service/slow-drip`      | Streams the body slowly                       | Progress, streaming reads                   |

Paired with **starter snippets** in the Playground ("retry with exponential backoff", "timeout with AbortController") so each route arrives with the exercise it exists for, and with [Guided Challenges](./guided-challenges.md) content once that ships.

## Fit with current code

- The server already has a routes layer ([server/routes](../../server/routes)) separate from dataset CRUD; these are ordinary Express 5 handlers with no dataset interaction.
- Error bodies should follow the documented [error response shape](../api/error-responses.md) so lessons transfer to the real endpoints.
- Rate limiting must cover these routes; `/delay` holds connections open, so cap concurrency and duration (see risk below).

## Effort & risk

**Medium.** The handlers are trivial; the care goes into abuse resistance — delay endpoints are a classic slow-loris-ish resource sink, so enforce low caps, per-IP concurrency limits, and inclusion in the existing [rate limiting](../api/rate-limiting.md). `/service/flaky` should be deterministic-ish per session if challenges will assert on it (an open question below).

## Open questions

- Namespace: under `/service/…` alongside existing service routes, or a dedicated `/practice/…` prefix that's clearly a playground?
- Should `/flaky` accept a seed or failure-rate param so exercises can be reproducible?
- Is `/slow-drip` worth the connection-holding cost, or defer it and ship the safe three first?

## Key files

- [server/routes](../../server/routes) — where handlers would live
- [server/utils/rateLimiterDefaults.js](../../server/utils/rateLimiterDefaults.js) — limits these routes must opt into

## Related

- **Planning:** [Implementation plan](./plans/error-practice-routes-implementation.md) · [Decision log](./plans/error-practice-routes-decisions.md)
- [Service Routes](../api/service-routes.md)
- [Error Responses](../api/error-responses.md)
- [HTTP Inspector](./http-inspector.md) — makes the deliberate failures visible
- [Guided Challenges](./guided-challenges.md) — consumes these routes for error-handling exercises
