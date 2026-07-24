---
title: Query Builder — Implementation Plan
description: User stories, architecture, and build phases for the visual query panel on the API details page
audience: [developer, architect]
status: in-progress
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Query Builder — Implementation Plan

Plan for the [Query Builder proposal](../query-builder.md): a panel on the API details page that composes filter/sort/pagination query strings visually, shows the URL changing live, and previews results. Open choices live in the [decision log](./query-builder-decisions.md).

## User stories

1. **Discover filtering.** As a learner viewing an API, I can pick a real field (including nested paths like `name.first`) from a dropdown, type a value, and see matching records — learning that `?name.first=Bender` exists at all.
2. **The URL is the lesson.** As a learner, every control change updates a visible URL bar, so I can connect "what I clicked" to "what I'd type", and copy that URL.
3. **Sort and paginate.** As a learner, I can choose a sort field + direction and page/limit controls that map one-to-one onto `_sort`, `_order`, `_page`, `_limit`.
4. **See the totals.** As a learner using pagination, I can see "showing 10 of 42" driven by the `X-Total-Count` header, learning that the header exists.
5. **Graduate to code.** As a learner, one click sends the composed URL into the Playground as a fetch snippet so I move from clicking to coding.

## Architecture

Purely client-side: the panel builds a URL and fetches it. The server already implements every behavior in [jsonRouter.js](../../../server/utils/jsonRouter.js).

```mermaid
flowchart LR
    S[Sample fetch<br/>?_limit=N] --> D[deriveShape\(\)<br/>field paths]
    D --> F[Field picker]
    F --> Q[Query state<br/>filters, sort, pagination]
    Q --> U[Live URL bar]
    U --> P[Debounced preview fetch<br/>JsonTree + total count]
    U --> G[Send to Playground]
```

### The server contract (what the controls must expose — exactly, and nothing more)

From [jsonRouter.js](../../../server/utils/jsonRouter.js), the full query surface is:

- **Equality filter** on any dot-path; repeated params on the same field mean OR.
- **Operator suffixes**: `field_gte`, `field_lte`, `field_ne`, `field_like` (case-insensitive substring).
- **Full-text** `q` across the whole record.
- **Sort**: `_sort` (comma-separated fields) + `_order` (`asc`/`desc` per field).
- **Pagination**: `_page` (+ `_limit`, default 10) with `Link` header, or ranges via `_start`/`_end`/`_limit`; `X-Total-Count` always set.

The builder must not invent controls beyond this list — if it renders it, the server must honor it. Treat [Querying & Filtering](../../api/querying-and-filtering.md) and [Sorting & Pagination](../../api/sorting-and-pagination.md) as the contract and test URL generation against them. How much of this surface v1 exposes is [decision D2](./query-builder-decisions.md#d2--operator-scope).

### Field discovery — shared `deriveShape()`

Fetch one sample of the active endpoint (`?_limit=N`, N per [Response Shape Viewer D1](./response-shape-viewer-decisions.md#d1--sample-size)) through TanStack Query, keyed on the endpoint URL so the [Response Shape Viewer](./response-shape-viewer-implementation.md) shares both the request and the derivation. `deriveShape()` lives in `client/src/utils/` and returns, per dot-path: inferred types, coverage count, and an example value. The builder consumes just the paths + types (types drive input affordances — number fields get numeric inputs, `_gte/_lte` make sense; string fields highlight `_like`).

Heterogeneous records are expected: the picker lists the union of paths across the sample, ordered by coverage.

### Component & state

`QueryBuilder` component (new folder under `client/src/components/`), hosted by [APIDetails.tsx](../../../client/src/pages/APIDetails/APIDetails.tsx) with the active endpoint URL as its prop — the same prop the Playground gets, so endpoint switching resets it naturally.

State is a single plain object — `{ filters: [{field, op, value}], q, sort: [{field, dir}], pagination }` — with one pure function `buildQueryString(state)` producing the URL. That function is the unit-testable heart of the feature.

Preview fetches are debounced (~400 ms) and rendered with the existing [JsonTree](../../../client/src/components/Playground/JsonTree.tsx); read `X-Total-Count` for the "showing X of Y" line (requires the CORS `exposedHeaders` change from the [HTTP Inspector plan](./http-inspector-implementation.md) — tiny, and worth doing regardless of which feature lands first). Preview behavior (auto vs. explicit run) is [D3](./query-builder-decisions.md#d3--preview-fetch-behavior).

### Send to Playground

The Playground currently sources code from localStorage or a starter snippet. Add a narrow bridge: APIDetails holds an `injectedCode` value (with a nonce so repeat sends re-trigger); Playground accepts it as an optional prop and loads it into the editor exactly as `loadSnippet` does today. The snippet is the existing async/await starter body with the composed URL — reusing the template style in [snippets.ts](../../../client/src/components/Playground/snippets.ts).

## Build phases

| Phase                             | Scope                                                                          | Done when                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| 1. `deriveShape()` + sample fetch | Shared utility, TanStack Query hook, unit-style tests of derivation edge cases | Paths/types derived correctly from `futurama` (nested) and a flat dataset        |
| 2. Query state + URL builder      | State model, `buildQueryString`, live URL bar with copy                        | Generated URLs verified against every documented query-doc example               |
| 3. Controls                       | Field picker, filter rows, sort, pagination controls (scope per D2)            | Each control round-trips: control → URL → server result matches expectation      |
| 4. Preview + total count          | Debounced fetch, JsonTree render, X-Total-Count line, loading/error states     | Preview tracks control changes without request storms                            |
| 5. Send to Playground + placement | Injection bridge, placement per D1, CSS, empty states                          | Full walkthrough of user stories passes; feature doc written in `docs/features/` |

## Testing & verification

- The client has no test runner; `buildQueryString` and `deriveShape` are the two pieces worth adding one for (vitest fits the Vite setup) — decide when phase 1 starts. Otherwise: documented manual checklist per phase table.
- Contract check: for each example in [Querying & Filtering](../../api/querying-and-filtering.md), reproduce it with the builder and confirm identical results.
- Watch rate limits during development of the debounced preview — a broken debounce shows up as a 429 quickly.

## Out of scope (v1)

- Query operators the server doesn't have (no `_gt`, no ranges beyond `_gte`/`_lte`, no negated `_like`). If the router grows operators later, the builder follows — never leads.
- Saving/naming composed queries.
- Editing the URL bar by hand (copy-only; the Playground is the place to type).

## Key files

- [server/utils/jsonRouter.js](../../../server/utils/jsonRouter.js) — the contract being surfaced
- [client/src/pages/APIDetails/APIDetails.tsx](../../../client/src/pages/APIDetails/APIDetails.tsx) — host page and injection bridge
- [client/src/components/Playground/snippets.ts](../../../client/src/components/Playground/snippets.ts) — snippet template reused by "Send to Playground"
- [client/src/components/Playground/JsonTree.tsx](../../../client/src/components/Playground/JsonTree.tsx) — preview rendering

## Related

- [Query Builder — Decisions](./query-builder-decisions.md)
- [Proposal](../query-builder.md) · [Roadmap](./README.md)
- [Response Shape Viewer plan](./response-shape-viewer-implementation.md) — shares `deriveShape()` and the sample fetch
- [Querying & Filtering](../../api/querying-and-filtering.md) · [Sorting & Pagination](../../api/sorting-and-pagination.md)
