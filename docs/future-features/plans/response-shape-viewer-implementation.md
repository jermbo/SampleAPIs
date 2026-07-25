---
title: Response Shape Viewer — Implementation Plan
description: User stories, architecture, and build phases for the derived fields-and-types view
audience: [developer, architect]
status: in-progress
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Response Shape Viewer — Implementation Plan

Plan for the [Response Shape Viewer proposal](../response-shape-viewer.md): derive an endpoint's field/type shape client-side from a sample and show it as a table, with copy-as-TypeScript. Open choices live in the [decision log](./response-shape-viewer-decisions.md). Built on the same `deriveShape()` utility and sample fetch as the [Query Builder](./query-builder-implementation.md) — whichever ships first creates the utility.

## User stories

1. **Know before you fetch.** As a learner opening an API's details page, I can see what fields its records have and their types before writing a line of code.
2. **Honest optionality.** As a learner, I can see that only 12 of 50 sampled records have `deathdate` — learning that real data is ragged and my code needs to handle missing fields.
3. **Nested paths revealed.** As a learner, I can see `name.first` as a path with type `string`, which is exactly the string I'd use in a query filter.
4. **Bridge to typed code.** As a learner moving to TypeScript, I can copy a ready-made `interface` with optional members where coverage is partial.
5. **Never stale.** As a maintainer, I never update a schema by hand — the view derives from live data, so dataset edits are reflected automatically.

## Architecture

A pure derivation over a fetched sample; no server changes, no stored schemas.

```mermaid
flowchart LR
    E[Active endpoint] --> F[Sample fetch ?_limit=N<br/>TanStack Query, shared key]
    F --> D[deriveShape\(\)]
    D --> T[Fields table]
    D --> TS[toTypeScript\(\)] --> C[Copy as TypeScript]
```

### `deriveShape(records, options)` — the shared core

Lives in `client/src/utils/` (with the [Query Builder](./query-builder-implementation.md) as its second consumer). Input: an array of records (or a single object for singular resources). Output: a tree of nodes — `{ path, types: string[], count, total, example, children }`.

Inference rules, chosen so the honest answer is also the teachable one:

- Types per path are a **set**: a field that's sometimes a string and sometimes null reports `string | null`.
- `count / total` is coverage: how many sampled records carry the path at all.
- Arrays recurse into element shapes; **empty arrays** report `unknown[]`.
- Objects recurse to a **depth cap** (4); beyond it, report `object` and stop.
- Numbers aren't split into int/float; JSON has one number type and that's the lesson.
- Mixed structural types (sometimes object, sometimes string) report the union and don't recurse — rare, but real data does it.

### `toTypeScript(shape, name)`

A deliberately simple emitter, separate from derivation:

- One `interface` per object node; the root name derived from the resource (PascalCase, naive singularization — `characters` → `Character`; imperfect is fine, it's editable text).
- Coverage < 100% → optional member (`deathdate?: string`).
- Type sets → unions; `unknown` where inference gave up.
- No generics, no `Record<>`, no cleverness — a teaching aid, not codegen. Output format scope is [decision D2](./response-shape-viewer-decisions.md#d2--output-formats).

### UI

A fields table on the [API details page](../../../client/src/pages/APIDetails/APIDetails.tsx): columns _field path_ (indented by depth, collapsible), _type_, _coverage_ (as `12/50` with a subtle bar), _example_ (truncated). A "Copy as TypeScript" button on the header row. Placement relative to the Query Builder is [D3](./response-shape-viewer-decisions.md#d3--relationship-to-the-query-builder). Loading and error states follow the existing [data-fetching pattern](../../features/data-fetching-and-state.md).

Singular (object) resources render the same table from one record with coverage hidden.

## Build phases

| Phase                 | Scope                                                                      | Done when                                                                                            |
| --------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1. `deriveShape()`    | Utility + edge-case handling (nulls, mixed types, empty arrays, depth cap) | Correct output for `futurama` (nested), `csscolornames` (flat), and a hand-built pathological sample |
| 2. Fields table       | Table component, collapse/expand, coverage display, loading/error states   | Renders every existing dataset without blowing up                                                    |
| 3. TypeScript emitter | `toTypeScript()` + copy button + toast                                     | Emitted interfaces compile under `tsc --strict` for 3 representative datasets                        |
| 4. Placement + polish | Placement per D3, empty states, CSS                                        | User-story walkthrough passes; feature doc written in `docs/features/`                               |

## Testing & verification

- `deriveShape` and `toTypeScript` are pure functions — the strongest candidates in the client for real unit tests (vitest; same call as in the Query Builder plan, phase 1 of whichever builds first).
- Compile-check emitted interfaces by pasting into a scratch `.ts` file under `tsc --strict` — cheap and catches emitter bugs precisely.
- Manual: verify coverage numbers against a dataset where you know the raggedness (e.g. count `deathdate` occurrences in [futurama.json](../../../server/api/futurama.json)).

## Out of scope (v1)

- Fetching beyond the sample for exact coverage (sample-size trade-off is [D1](./response-shape-viewer-decisions.md#d1--sample-size)).
- JSON Schema / Zod / other emitters unless D2 says otherwise.
- Persisting or diffing shapes over time.

## Key files

- [client/src/pages/APIDetails/APIDetails.tsx](../../../client/src/pages/APIDetails/APIDetails.tsx) — host page
- [client/src/components/Playground/JsonTree.tsx](../../../client/src/components/Playground/JsonTree.tsx) — rendering base to borrow from
- `client/src/utils/deriveShape.ts` — the shared utility (to be created)

## Related

- [Response Shape Viewer — Decisions](./response-shape-viewer-decisions.md)
- [Proposal](../response-shape-viewer.md) · [Roadmap](./README.md)
- [Query Builder plan](./query-builder-implementation.md) — co-owner of `deriveShape()`
- [Endpoint JSON Format](../../data/endpoint-json-format.md) — why datasets are ragged
