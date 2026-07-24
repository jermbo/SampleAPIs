---
title: Query Builder
description: A visual panel that builds filter/sort/pagination query strings and shows live results
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# Query Builder

**Status: proposed.** High learning impact, small–medium effort. Recommended second.

## Problem

The server supports a rich query syntax — nested-field filtering, sorting, pagination — documented in [Querying & Filtering](../api/querying-and-filtering.md) and [Sorting & Pagination](../api/sorting-and-pagination.md), but nothing in the UI reveals it. A visitor on the [API Details Page](../features/api-details-page.md) sees a bare endpoint URL and has no reason to suspect `?name.first=Bender` works.

## Proposal

A panel on the API details page where the visitor composes a query by manipulation and learns the syntax by watching the URL change:

- **Field picker** populated from a sample response's actual keys (including nested paths), so choices are real, not typed blind
- **Filter rows** (field + value), **sort** control, and **pagination** controls mapping one-to-one onto the documented query parameters
- A **live URL bar** that updates as controls change — the URL _is_ the lesson
- A **results preview** (fetch on change, debounced) rendered with the existing [JSON Tree Viewer](../features/json-tree-viewer.md)
- A **"Send to Playground"** button that loads a fetch snippet with the composed URL, bridging from clicking to coding

## Fit with current code

- Purely client-side: it builds a URL and fetches it. The server already implements every behavior via [jsonRouter.js](../../server/utils/jsonRouter.js).
- Field discovery needs one sample fetch of the active endpoint — the same data a [Response Shape Viewer](./response-shape-viewer.md) would derive from; if both are built, they should share the derivation.
- "Send to Playground" fits the existing snippet mechanism in [snippets.ts](../../client/src/components/Playground/snippets.ts).

## Effort & risk

**Small–medium.** The fiddly parts are deriving field paths from heterogeneous records (records in a dataset don't all share keys) and keeping the control set honest — the builder must expose exactly what the server supports, or it teaches the wrong lesson. Treat the query-syntax docs as the contract and test the builder against them.

## Open questions

- Where does it live on the page — above the Playground, or as a tab alongside it?
- Do query operators beyond equality (if/when the router grows them) get controls, or does the builder stay minimal on purpose?

## Key files

- [server/utils/jsonRouter.js](../../server/utils/jsonRouter.js) — the query behavior being surfaced
- [client/src/pages/APIDetails/APIDetails.tsx](../../client/src/pages/APIDetails/APIDetails.tsx) — host page

## Related

- **Planning:** [Implementation plan](./plans/query-builder-implementation.md) · [Decision log](./plans/query-builder-decisions.md)
- [Querying & Filtering](../api/querying-and-filtering.md)
- [Sorting & Pagination](../api/sorting-and-pagination.md)
- [Response Shape Viewer](./response-shape-viewer.md) — shares field derivation
