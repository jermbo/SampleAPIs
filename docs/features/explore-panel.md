---
title: Explore Panel
description: Shape and Query tabs on the API details page — derived field/type view and a visual query builder
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Client Features](./README.md)

# Explore Panel

The collapsible **"Explore this endpoint"** section on the [API details page](./api-details-page.md), between the endpoint list and the Playground. It ships the [Response Shape Viewer](../future-features/plans/response-shape-viewer-implementation.md) and [Query Builder](../future-features/plans/query-builder-implementation.md) as two tabs over one shared sample, per [Shape Viewer D3](../future-features/plans/response-shape-viewer-decisions.md#d3--relationship-to-the-query-builder). Nothing is fetched until the panel is opened, and it remounts collapsed when the endpoint changes.

## How it fits together

```mermaid
flowchart LR
    E[Active endpoint URL] --> S[useSampleRecords<br/>?_limit=50, shared cache]
    S --> D[deriveShape\(\)]
    D --> ST[Shape tab<br/>fields table]
    D --> TS[toTypeScript\(\)] --> CP[Copy as TypeScript]
    D --> QF[queryableFields\(\)] --> QB[Query tab controls]
    QB --> QS[buildQueryString\(\)] --> U[Live URL bar]
    U --> P[useQueryPreview<br/>debounced fetch + X-Total-Count]
    U --> SP[Send to Playground]
```

## Shape tab

- One sample fetch (`?_limit=50`, [D1](../future-features/plans/response-shape-viewer-decisions.md#d1--sample-size)) feeds [deriveShape()](../../client/src/utils/deriveShape.ts): per dot-path, a **type set**, **coverage** (`12/50` — how many sampled records carry the path), and an example value. Arrays of objects recurse via a `[]` path segment; depth caps at 4 segments.
- The table is honest about its basis ("Based on the first N records") and hides coverage for singular resources.
- **Copy as TypeScript** runs [toTypeScript()](../../client/src/utils/toTypeScript.ts): one interface per object node, optional members where coverage is partial, unions for mixed types. TypeScript is the only emitter ([D2](../future-features/plans/response-shape-viewer-decisions.md#d2--output-formats)).

## Query tab

- Controls cover the [documented query surface](../api/querying-and-filtering.md) at the scope set by [Query Builder D2](../future-features/plans/query-builder-decisions.md#d2--operator-scope): all filter operators (`eq`, `_gte`, `_lte`, `_ne`, `_like`) plus `q`, single-field sort (`_sort` + `_order`), and `_page`/`_limit` pagination. Ranges (`_start`/`_end`) and multi-sort stay documented-but-unclicked.
- The field picker lists primitive dot-paths from the shared shape, ordered by coverage; paths inside arrays are excluded because the server's dot-path lookup cannot address array elements. Numeric fields get numeric inputs.
- State lives in one plain object; [buildQueryString()](../../client/src/components/Explore/queryState.ts) is the pure, unit-tested heart that turns it into the URL shown in the live bar.
- The preview auto-fetches ~400 ms after the last change ([D3](../future-features/plans/query-builder-decisions.md#d3--preview-fetch-behavior)), pauses while the tab is hidden, cancels in-flight requests, and renders through the shared [JSON tree viewer](./json-tree-viewer.md) with a "Showing X of Y records" line read from `X-Total-Count`.
- **Send to Playground** builds the async/await starter snippet around the composed URL and pushes it into the editor through the `injectedCode` prop on [Playground](./playground.md) — the nonce makes repeat sends re-trigger.

## Key files

| File | Role |
| --- | --- |
| [Explore.tsx](../../client/src/components/Explore/Explore.tsx) | Panel shell: collapse state + tab switch |
| [ShapeViewer.tsx](../../client/src/components/Explore/ShapeViewer.tsx) / [ShapeRow.tsx](../../client/src/components/Explore/ShapeRow.tsx) | Fields table |
| [QueryBuilder.tsx](../../client/src/components/Explore/QueryBuilder.tsx) | Query tab orchestration |
| [queryState.ts](../../client/src/components/Explore/queryState.ts) | State model, `buildQueryString()`, `queryableFields()` |
| [deriveShape.ts](../../client/src/utils/deriveShape.ts) / [toTypeScript.ts](../../client/src/utils/toTypeScript.ts) | Shared pure core (unit-tested) |
| [useSampleRecords.ts](../../client/src/hooks/useSampleRecords.ts) / [useQueryPreview.ts](../../client/src/hooks/useQueryPreview.ts) | TanStack Query bridges |

Unit tests (vitest) cover `deriveShape`, `toTypeScript`, and `buildQueryString`; emitted interfaces are compile-checked under `tsc --strict` against real datasets.

## Related

- [API Details Page](./api-details-page.md) — the host page
- [Playground](./playground.md) — receives "Send to Playground" code
- [Querying & Filtering](../api/querying-and-filtering.md) · [Sorting & Pagination](../api/sorting-and-pagination.md) — the server contract the Query tab surfaces
- [Data Fetching & State](./data-fetching-and-state.md) — the TanStack Query pattern both hooks follow
