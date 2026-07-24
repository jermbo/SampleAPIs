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
- **Known API, unknown resource or id** — the data router returns an **empty object** `{}` with status `404`, mirroring json-server behavior. Reads and deletes always reach this path; writes only do when the resource exists but the id doesn't — a write to an unknown resource is stopped earlier by validation (see the catch-all `400` below).

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

## 400 — validation catch-all

When validation can't even find a first record to compare against — a write to an unknown resource, to a singular (object) resource, or to an empty collection — it returns a generic `400` instead:

```json
{
  "error": 400,
  "message": "Unexpected data sent in! POST NOT accepted. Please send valid data next time!",
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
