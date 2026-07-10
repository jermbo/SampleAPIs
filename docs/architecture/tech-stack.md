---
title: Tech Stack
description: Runtime, frameworks, and libraries used by the server and client
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Architecture](./README.md)

# Tech Stack

Both apps require **Node.js ≥ 26** (`engines` field in each `package.json`).

## Server

| Library            | Role                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Express 5          | Routing and middleware; rejected async handlers flow to the central error handler natively |
| helmet             | Security headers (CSP disabled for the legacy Pug pages)                                   |
| cors               | Permissive CORS — this is a public API                                                     |
| express-rate-limit | Request throttling — see [Rate Limiting](../api/rate-limiting.md)                          |
| morgan             | Request logging (`dev` locally, `combined` in production)                                  |
| pug                | Templates for the legacy site and the reset/create pages                                   |
| jest, nodemon      | Dev-only: tests and file-watching restarts                                                 |

There is intentionally no database and no ORM — see [Why Flat JSON Files](../decisions/why-flat-json-files.md).

## Client

| Library               | Role                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| React 19 + TypeScript | UI, built with Vite 8 (SWC plugin)                                              |
| TanStack Router       | [File-based routing](../features/pages-and-routing.md) with auto code-splitting |
| TanStack Query        | [Server state and caching](../features/data-fetching-and-state.md)              |
| CodeMirror 6          | The [Playground](../features/playground.md) editor                              |
| Fontsource            | Self-hosted Roboto and Montserrat Alternates                                    |
| oxlint                | Linting (replaced ESLint)                                                       |

## Key files

- [server/package.json](../../server/package.json)
- [client/package.json](../../client/package.json)

## Related

- [System Overview](./system-overview.md)
- [Why a Custom JSON Router](../decisions/why-custom-json-router.md)
