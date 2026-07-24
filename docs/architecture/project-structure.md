---
title: Project Structure
description: Monorepo layout and where each kind of code lives
audience: developer
---

[Wiki Home](../README.md) › [Architecture](./README.md)

# Project Structure

The repo is a two-app monorepo glued together by a thin root `package.json` whose only real job is `npm run dev` — starting both apps with `concurrently`.

| Path                              | What it is                                                                                                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/`                         | Express 5 API server (CommonJS JavaScript)                                                                                                                                         |
| `server/api/`                     | The datastore: one `<name>.json` per API plus a `.json.backup` twin each                                                                                                           |
| `server/routes/`                  | Express routers — data APIs, frontend list, reset, create, test                                                                                                                    |
| `server/utils/`                   | The [JSON router](../api/rest-conventions.md), [validation](../api/crud-and-validation.md), [rate limits](../api/rate-limiting.md), [registry generation](../data/api-registry.md) |
| `server/views/`, `server/public/` | Legacy Pug site served at `/` (deprecated)                                                                                                                                         |
| `client/`                         | Vite + React 19 + TypeScript front end                                                                                                                                             |
| `client/src/routes/`              | File-based route definitions ([TanStack Router](../features/pages-and-routing.md))                                                                                                 |
| `client/src/pages/`               | Page components rendered by the routes                                                                                                                                             |
| `client/src/components/`          | Shared components — Header, APICard, [Playground](../features/playground.md), …                                                                                                    |
| `client/src/styles/`              | Plain-CSS design system (see [Styling](../features/styling.md))                                                                                                                    |
| `docs/`                           | This wiki                                                                                                                                                                          |
| `endpoint-test/`                  | Bruno/OpenCollection request collection for [manual endpoint testing](../operations/testing.md)                                                                                    |

## Related

- [System Overview](./system-overview.md)
- [Local Development](../operations/local-development.md)
