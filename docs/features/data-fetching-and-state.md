---
title: Data Fetching & State
description: TanStack Query for server state, a minimal context for UI state
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Client Features](./README.md)

# Data Fetching & State

State is split by kind, not by feature:

- **Server state** → TanStack Query
- **UI state** → a minimal React context

## Server state

The whole site runs on one query: the API list from [`GET /frontend`](../api/service-routes.md).

- `useApiList()` — fetches and caches the list under the `["apiList"]` key
- `useApiCategories()` — **shares the same cache entry** and derives the unique category set with `select`, so no second request is made

Query defaults (set in `main.tsx`): `staleTime` 5 minutes, one retry, no refetch on window focus. The base URL comes from `utils/Config.ts`, which targets `http://localhost:5555` in dev and `https://api.sampleapis.com` in production builds.

## UI state

`GlobalContext` holds only `navVisible` — whether the mobile nav is open. Everything server-related was deliberately moved out of context and into TanStack Query.

## Key files

- [client/src/hooks/useApiList.ts](../../client/src/hooks/useApiList.ts)
- [client/src/context/GlobalContext.tsx](../../client/src/context/GlobalContext.tsx)
- [client/src/utils/Config.ts](../../client/src/utils/Config.ts)

## Related

- [Pages & Routing](./pages-and-routing.md)
- [Service Routes](../api/service-routes.md)
