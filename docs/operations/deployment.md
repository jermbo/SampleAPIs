---
title: Deployment
description: How production differs from development
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Operations](./README.md)

# Deployment

The service is **self-hosted** (it moved off Vercel because static hosting couldn't support persistent CRUD writes). Production API: `https://api.sampleapis.com`.

## What switches in production

| Concern | Development | Production |
| --- | --- | --- |
| Client API base URL | `http://localhost:5555` | `https://api.sampleapis.com` — decided at build time by `import.meta.env.PROD` in `utils/Config.ts` |
| Server logging | morgan `dev` (colored, terse) | morgan `combined` (Apache-style) via `NODE_ENV=production` |
| Server process | nodemon watcher | plain `node`, production deps only (see [Docker](./docker.md)) |
| Client serving | Vite dev server + HMR | static build served by `vite preview` |

## Behind a reverse proxy

The server sets `trust proxy = 1`, so when it sits behind Docker/nginx the [rate limiter](../api/rate-limiting.md) keys on the real client IP from `X-Forwarded-For` rather than the proxy address. `PORT` is configurable via environment (default `5555`).

In production the data is also [reset on a regular cadence](../data/data-reset.md).

## Key files

- [client/src/utils/Config.ts](../../client/src/utils/Config.ts)
- [server/sampleapis.js](../../server/sampleapis.js)

## Related

- [Docker](./docker.md)
- [Rate Limiting](../api/rate-limiting.md)
