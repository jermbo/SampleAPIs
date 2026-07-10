---
title: Custom Endpoints
description: The /create route that scaffolds user-defined endpoint files
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Endpoint Data](./README.md)

# Custom Endpoints

`POST /create` lets visitors scaffold their own endpoint file without cloning the repo. A small Pug form lives at `GET /create`.

## Request

```json
{ "endpointName": "my-api", "endpoints": ["things", "stuff"] }
```

Each named collection is stubbed as `[{ "id": 0, "name": "test" }]` and written to `server/custom/<endpointName>.json`.

## Validation

- Names must match `^[a-z0-9_-]{1,50}$` (case-insensitive) — the primary guard against **path traversal**, since the name ends up in a file path; `path.basename()` is applied as defence-in-depth
- `endpoints` must be a non-empty array of valid names
- An existing file returns `409` rather than being overwritten

## Current limitation

Files land in `server/custom/`, but the [router only mounts APIs from the registry](./api-registry.md), which scans `server/api/`. **Created files are not served by the data API today** — the feature scaffolds the file without wiring it into routing.

## Key files

- [server/routes/create-apis.js](../../server/routes/create-apis.js)

## Related

- [Adding an Endpoint](./adding-an-endpoint.md) — the supported path to a live endpoint
- [API Registry](./api-registry.md)
