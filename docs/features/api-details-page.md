---
title: API Details Page
description: The per-API page — metadata, endpoint switcher, and embedded Playground
audience: developer
---

[Wiki Home](../README.md) › [Client Features](./README.md)

# API Details Page

Route: `/api-list/$id` (e.g. `/api-list/coffee`). The page for one API: its metadata, a resource switcher, and a live [Playground](./playground.md) pointed at the selected endpoint.

## How it resolves

1. `useParams` grabs the API name from the URL
2. The API is looked up in the [cached API list](./data-fetching-and-state.md) — no per-page request
3. The active endpoint defaults to the API's first resource; picking another one rebuilds the endpoint URL passed to the Playground

Distinct renders cover loading, fetch failure, and unknown API name (each with a way back to the list).

## Performance

The Playground drags in CodeMirror, a heavy chunk. It is `React.lazy()`-loaded with a `Suspense` fallback, so the details page renders immediately and the editor arrives when ready — on top of the router's own [code-splitting](./pages-and-routing.md).

## Key files

- [client/src/pages/APIDetails/APIDetails.tsx](../../client/src/pages/APIDetails/APIDetails.tsx)
- [client/src/routes/api-list/$id.tsx](../../client/src/routes/api-list/$id.tsx)

## Related

- [Playground](./playground.md)
- [Data Fetching & State](./data-fetching-and-state.md)
