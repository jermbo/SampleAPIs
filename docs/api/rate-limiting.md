---
title: Rate Limiting
description: The two request limiters that protect the public API
audience: [developer, architect]
---

[Wiki Home](../README.md) › [API Surface](./README.md)

# Rate Limiting

Because the API is public and unauthenticated, abuse is contained by two `express-rate-limit` limiters, both on a **15-minute window** and keyed by client IP:

| Limiter | Limit | Applies to |
| --- | --- | --- |
| Global | 10,000 requests | Every route — a safety net so the unauthenticated `/resetit`, `/create`, and `/generate` routes can't be hammered without limit |
| Per-API | 5,000 requests | The data endpoints (`/:api/...`), the surface students actually hit |

The global limit is intentionally higher than the per-API one, so for normal data usage the per-API limiter always trips first.

## Behavior

- Exceeding a limit returns `429` with a JSON message (see [Error Responses](./error-responses.md))
- Standard `RateLimit-*` headers are sent; legacy `X-RateLimit-*` headers are off
- A small hard-coded IP **allowlist** bypasses both limiters
- `trust proxy` is set to `1` in the [request lifecycle](../architecture/request-lifecycle.md), so the limiter sees the real client IP behind Docker/nginx instead of the proxy address

## Key files

- [server/utils/rateLimiterDefaults.js](../../server/utils/rateLimiterDefaults.js) — both limiters and the allowlist
- [server/sampleapis.js](../../server/sampleapis.js) — global limiter mounting

## Related

- [Request Lifecycle](../architecture/request-lifecycle.md)
- [Error Responses](./error-responses.md)
