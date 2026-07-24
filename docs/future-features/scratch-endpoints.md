---
title: Scratch Endpoints
description: User-supplied temporary datasets that become full CRUD endpoints in a scratch namespace
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# Scratch Endpoints

**Status: proposed.** High impact, large effort, and the largest abuse surface of any proposal — evaluate last and most carefully.

## Problem

Learners eventually want to practice against _their own_ data shape — the app they're actually building — not Futurama characters. Today the only path is a pull request to add a permanent dataset ([Adding an Endpoint](../data/adding-an-endpoint.md)), which is the wrong tool for "I just need a fake `/todos` for this afternoon." Services like mockapi.io exist for this, but they require accounts.

## Proposal

POST a JSON array, get back a temporary namespaced endpoint with the full standard behavior — querying, sorting, pagination, CRUD:

```
POST /scratch  { "todos": [ { "id": 1, "title": "…" } ] }
→ 201 { "base": "/scratch/x7k2f9", "expires": "…" }

GET /scratch/x7k2f9/todos?title=…   ← full jsonRouter behavior
```

- **Unguessable namespace ID**, returned once to the creator — possession of the URL is the only "auth", consistent with the no-accounts posture
- **Aggressive expiry** (hours, not days) and eviction on the existing reset cadence — this is a scratchpad, not hosting
- **Hard caps**: payload size, record count, per-IP namespace count, and validation via the same rules as contributed datasets ([verifyData.js](../../server/utils/verifyData.js))

## Fit with current code

- The custom [jsonRouter.js](../../server/utils/jsonRouter.js) already generalizes CRUD + querying over any dataset — the core reuse that makes this feasible. The work is mounting it on dynamically created, expiring, memory-only datasets instead of files from [server/api](../../server/api).
- The reset machinery ([reset.js](../../server/routes/reset.js), [data lifecycle](../data/README.md)) is precedent for "nothing here is permanent."

## Effort & risk

**Large**, dominated by risk rather than mechanics:

- **Abuse**: user-supplied content served from your domain is a phishing/malware-JSON vector. Mitigations: strict JSON-only responses (`Content-Type: application/json; charset=utf-8`, `X-Content-Type-Options: nosniff`), size caps, string-content validation, and possibly a word-filter — but this needs a real threat-model pass, not a checklist.
- **Resources**: memory-only storage with hard global caps; refuse creation when full rather than degrading the main service.
- **Support surface**: expired-namespace confusion ("my endpoint vanished") needs a clear 410 body with an explanation.

Given the risk profile, this warrants a [Decision page](../decisions/README.md) before any code — including seriously considering _not_ building it and instead pointing users to dedicated mock-API services.

## Open questions

- Memory-only or spill to disk? (Memory-only enforces "temporary" structurally and is the safer default.)
- Does the client get UI (a "make your own endpoint" page with the Playground attached), or is v1 API-only and doc-driven?
- Is the maintenance/abuse cost justified when the same learner need is partially served by [Guided Challenges](./guided-challenges.md) + existing datasets?

## Key files

- [server/utils/jsonRouter.js](../../server/utils/jsonRouter.js) — the engine to reuse
- [server/utils/verifyData.js](../../server/utils/verifyData.js) — validation rules to apply to submissions
- [server/routes/reset.js](../../server/routes/reset.js) — expiry/reset precedent

## Related

- **Planning:** [Implementation plan](./plans/scratch-endpoints-implementation.md) · [Decision log](./plans/scratch-endpoints-decisions.md)
- [Adding an Endpoint](../data/adding-an-endpoint.md) — the permanent-dataset path this complements
- [Rate Limiting](../api/rate-limiting.md)
- [Decisions](../decisions/README.md) — where the build/no-build call should be recorded
