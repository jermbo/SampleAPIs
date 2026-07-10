---
title: Error Responses
description: Every error shape the API can return and what triggers it
audience: developer
---

[Wiki Home](../README.md) › [API Surface](./README.md)

# Error Responses

All errors are JSON. The shape depends on where in the [request lifecycle](../architecture/request-lifecycle.md) the failure happens.

## 404 — not found

Two distinct flavors:

- **Unknown route** (no API named that, or bad path) — from the app-level 404 handler:
  ```json
  { "error": 404, "message": "Cannot GET /nope" }
  ```
- **Known API, unknown resource or id** — the data router returns an **empty object** `{}` with status `404`, mirroring json-server behavior.

## 400 — validation failure

[Shape validation](./crud-and-validation.md) rejects mutations that don't match the collection's first record, echoing back the expected shape:

```json
{
  "error": 400,
  "message": "The data you are sending does not match the existing data object. ...",
  "expected": { "title": "string", "ingredients": "array", "id": "number" },
  "received": { "name": "oops" }
}
```

## 429 — rate limited

From either [limiter](./rate-limiting.md):

```json
{ "error": 429, "message": "Too many requests, please try again after fifteen minutes." }
```

## 500 — unhandled failure

The central error handler catches anything thrown or rejected (Express 5 forwards rejected async handlers automatically), logs it, and returns:

```json
{ "error": 500, "message": "Something went wrong handling that request." }
```

## Key files

- [server/sampleapis.js](../../server/sampleapis.js) — 404 and error handlers
- [server/utils/verifyData.js](../../server/utils/verifyData.js) — 400 responses

## Related

- [CRUD & Validation](./crud-and-validation.md)
- [Rate Limiting](./rate-limiting.md)
