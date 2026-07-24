---
title: Local Development
description: Running both apps on your machine
audience: developer
---

[Wiki Home](../README.md) › [Operations](./README.md)

# Local Development

**Prerequisite: Node.js ≥ 26** (both apps enforce it via `engines`).

```bash
# install dependencies in all three package roots
npm install
npm install --prefix server
npm install --prefix client

# run both apps
npm run dev
```

`npm run dev` uses `concurrently` to start:

| App | URL | Watcher |
| --- | --- | --- |
| Server | `http://localhost:5555` | nodemon — restarts on file change (including edits to `server/api/*.json`) |
| Client | `http://localhost:4444` | Vite dev server with HMR |

In dev the client targets `http://localhost:5555` directly (see [Data Fetching & State](../features/data-fetching-and-state.md)), so the [Playground](../features/playground.md) exercises your local server and local data.

Each app can also run alone: `npm run server` / `npm run client` from the root. Prefer containers? See [Docker](./docker.md).

## Key files

- [package.json](../../package.json) — the `dev` orchestration
- [server/package.json](../../server/package.json), [client/package.json](../../client/package.json)

## Related

- [Docker](./docker.md)
- [Getting Started](../contributing/getting-started.md)
- [Testing](./testing.md)
