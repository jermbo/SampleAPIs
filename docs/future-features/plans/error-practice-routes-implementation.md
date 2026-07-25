---
title: Error Practice Routes — Implementation Plan
description: User stories, architecture, and build phases for httpbin-style delay/status/flaky endpoints
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Error Practice Routes — Implementation Plan

Plan for the [Error Practice Routes proposal](../error-practice-routes.md): a small set of deliberately misbehaving endpoints for practicing timeouts, retries, and status-code handling. The handlers are trivial; almost all the engineering care here is abuse resistance. Open choices live in the [decision log](./error-practice-routes-decisions.md).

## User stories

1. **Status-code branching.** As a learner, I can request a specific status (`…/status/404`, `…/status/500`) and get that code with a JSON body in the site's documented error shape, so I can practice `if (!resp.ok)` branches against predictable failures.
2. **Timeouts.** As a learner, I can request a response delayed by N seconds and practice `AbortController`, loading states, and user-facing timeout handling.
3. **Retry with backoff.** As a learner, I can hit an endpoint that fails a controllable fraction of the time and build retry-with-backoff logic that observably works.
4. **Snippets included.** As a learner, each route comes with a Playground starter snippet ("Timeout with AbortController", "Retry with backoff") so the route arrives with its exercise.
5. **Abuse-resistant.** As the operator, no combination of these routes lets a client hold meaningful server resources — delay caps, concurrency caps, and rate limits bound the worst case.

## Architecture

A new Express router, `server/routes/practice.js`, mounted in [sampleapis.js](../../../server/sampleapis.js) **before** the base-apis catch-all (`app.use("/", baseApis)`), under a prefix decided in [D1](./error-practice-routes-decisions.md#d1--namespace). No dataset interaction, no state beyond in-memory counters.

### Routes

| Route                 | Behavior                                                                                                                                                                             | Guard rails                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ALL /status/:code`   | Responds with that status and a JSON body: for ≥400 the documented [error shape](../../api/error-responses.md) plus a `hint` naming the code's meaning; for 2xx a small success body | Codes limited to 200–599; 1xx rejected (protocol weirdness); 204/304 send no body per spec — documented as the lesson it is; 3xx send **no** `Location` header, so nothing can be turned into an open redirect |
| `GET /delay/:seconds` | Waits N seconds, then `{ delayed: N }`                                                                                                                                               | Cap N ≤ 10; per-IP concurrent-delay cap (~2) and a global pending-delay cap (~50), both returning 429 with an explanatory body when hit; timer-based (`setTimeout`), so no event-loop blocking                 |
| `GET /flaky`          | Fails with a 500 body some fraction of the time; success body otherwise                                                                                                              | Failure rate via `?rate=` (0–1, default 0.5); determinism option per [D2](./error-practice-routes-decisions.md#d2--flaky-determinism)                                                                          |
| `GET /slow-drip`      | Streams a JSON array slowly (chunk per interval)                                                                                                                                     | **Deferred by default** — connection-holding cost; see [D3](./error-practice-routes-decisions.md#d3--slow-drip-in-v1)                                                                                          |

All responses are `application/json`, follow the documented error shape for failures, and include CORS as everywhere else. Every route also gets a self-describing index: `GET <prefix>/` returns a JSON directory of the routes and their parameters — the API documents itself to someone poking at it.

### Abuse model (the actual work)

- **Rate limiting:** a dedicated limiter (values per [D4](./error-practice-routes-decisions.md#d4--rate-limit-values)) in [rateLimiterDefaults.js](../../../server/utils/rateLimiterDefaults.js), stricter than the data-API limiter because these routes exist to be hammered by retry loops. The global limiter still backstops everything.
- **`/delay` is the risk concentrator:** each pending request holds a socket. Caps above bound total held sockets to a small constant; when a cap rejects, the 429 body explains _why_ ("too many simultaneous delayed requests from your address — that's the lesson working").
- **`/flaky` retry storms:** a learner's buggy retry loop with no backoff is the expected failure mode — the dedicated limiter converts it into 429s, which is itself the backoff lesson. The snippet's backoff example handles 429 correctly to model good behavior.
- **No amplification:** responses are tiny and fixed-size; `/status` doesn't echo request bodies.

### Client-side companions

- Two or three starter snippets in [snippets.ts](../../../client/src/components/Playground/snippets.ts) (timeout, retry-with-backoff, status branching). These are ordinary runnable JS snippets; note the Playground's 5-second run timeout in [Playground.tsx](../../../client/src/components/Playground/Playground.tsx) bounds what a delay exercise can demonstrate in-sandbox — snippets should use delays ≤ 3 s, and the delay route's own docs mention curl for longer experiments. Raising the run timeout is _not_ in scope.
- Docs: a new page under `docs/api/` and a row in [Service Routes](../../api/service-routes.md).

## Build phases

| Phase                 | Scope                                                                          | Done when                                                                        |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| 1. Router + `/status` | Router, mounting order, index route, `/status/:code` with shape-correct bodies | supertest: representative codes, body shape, 1xx rejection, no `Location` on 3xx |
| 2. `/delay` + caps    | Timer handler, per-IP + global concurrency counters, teaching 429s             | supertest: cap enforcement, cap release after completion, N > 10 rejection       |
| 3. `/flaky`           | Rate param, determinism per D2                                                 | supertest: rate ≈ honored over a run; deterministic mode exactly reproducible    |
| 4. Limits + docs      | Dedicated limiter per D4, `docs/api/` page, service-routes row                 | Limiter verified; docs match behavior                                            |
| 5. Snippets           | Playground starters, tested against local server                               | Each snippet demonstrates its lesson inside the 5 s sandbox window               |

## Testing & verification

- Server: Jest + supertest throughout (the existing [server/tests](../../../server/tests) harness) — these routes are the most unit-testable feature in the roadmap.
- Concurrency caps need a test that opens N parallel delayed requests; keep test delays at 1 s to stay fast.
- Manual: run the retry snippet in the Playground against the local server and watch it in the [HTTP Inspector](./http-inspector-implementation.md) if that has landed — the pairing these two features were designed for.

## Out of scope (v1)

- `/slow-drip` unless D3 says otherwise.
- Simulated auth failures (401/403 beyond bare `/status` codes) — that's [Auth Training Wheels](./auth-training-wheels-implementation.md)' job with real semantics.
- Fault injection on the _data_ endpoints (a "chaos mode" for `/futurama`) — deliberately rejected: data endpoints staying trustworthy is a site invariant.

## Key files

- [server/sampleapis.js](../../../server/sampleapis.js) — mount order
- [server/routes](../../../server/routes) — new `practice.js` beside existing routers
- [server/utils/rateLimiterDefaults.js](../../../server/utils/rateLimiterDefaults.js) — dedicated limiter
- [client/src/components/Playground/snippets.ts](../../../client/src/components/Playground/snippets.ts) — companion starters

## Related

- [Error Practice Routes — Decisions](./error-practice-routes-decisions.md)
- [Proposal](../error-practice-routes.md) · [Roadmap](./README.md)
- [Error Responses](../../api/error-responses.md) · [Rate Limiting](../../api/rate-limiting.md)
- [HTTP Inspector plan](./http-inspector-implementation.md) — makes these failures visible
- [Guided Challenges plan](./guided-challenges-implementation.md) — consumes these routes for error-handling tracks
