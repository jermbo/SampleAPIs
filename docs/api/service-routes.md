---
title: Service Routes
description: The non-data routes — health, frontend list, reset, create, test, and the legacy site
audience: [developer, architect]
---

[Wiki Home](../README.md) › [API Surface](./README.md)

# Service Routes

Besides the [data endpoints](./rest-conventions.md), the server exposes a handful of service routes. None require authentication; the [global rate limiter](./rate-limiting.md) is their only guard.

| Route | Purpose |
| --- | --- |
| `GET /health` | Liveness probe — `{ status: "ok", uptime }`; used by the Docker healthcheck |
| `GET /frontend` | The full [API registry](../data/api-registry.md) as JSON; this is what the React client fetches |
| `GET /frontend/:name` | Registry entry for one API, or a JSON 404 |
| `GET /resetit/all` | [Restore every API](../data/data-reset.md) from its `.json.backup` twin |
| `GET /resetit/:api` | Restore a single API |
| `GET /create` (page) / `POST /create` | Create a [custom endpoint file](../data/custom-endpoints.md) |
| `GET /generate` | Rebuild [GeneratedAPIList.js](../data/api-registry.md) from the files in `server/api/` |
| `GET /test` | Live smoke test — fetches every endpoint and streams an HTML pass/fail report (see [Testing](../operations/testing.md)) |
| `GET /` | The **legacy Pug site** — the old static design, driven by the deprecated `server/apiList.js`, kept until fully retired |

## Key files

- [server/sampleapis.js](../../server/sampleapis.js) — route mounting
- [server/routes/frontend.js](../../server/routes/frontend.js), [reset.js](../../server/routes/reset.js), [create-apis.js](../../server/routes/create-apis.js), [testApis.js](../../server/routes/testApis.js)

## Related

- [Data Reset](../data/data-reset.md)
- [API Registry](../data/api-registry.md)
- [Custom Endpoints](../data/custom-endpoints.md)
