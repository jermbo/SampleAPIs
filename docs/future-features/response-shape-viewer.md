---
title: Response Shape Viewer
description: A derived fields-and-types view for each endpoint, with copy-as-TypeScript
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# Response Shape Viewer

**Status: proposed.** Medium impact, small–medium effort. Shares machinery with the [Query Builder](./query-builder.md).

## Problem

Before writing a line of code, a learner wants to know: _what fields do these records have, and what types are they?_ Today the only way to find out is to fetch the endpoint and read raw JSON. That also gates the query syntax — you can't filter on `name.first` if you don't know the field exists.

## Proposal

On the [API Details Page](../features/api-details-page.md), fetch a sample of the active endpoint and derive its shape client-side:

- **Fields table**: dot-path, inferred type, an example value, and how many sampled records carry the field (datasets are heterogeneous — surfacing "12/50 records have `deathdate`" teaches optionality honestly)
- **Copy as TypeScript** button emitting an `interface` with optional members where coverage is partial — a bridge for learners moving into typed code
- Nested objects and arrays derived recursively, capped at a sane depth

Derivation is a pure function over a sample (say, the first 50 records) — no server changes and no stored schemas that could drift from the data.

## Fit with current code

- The details page already knows the active endpoint URL ([APIDetails.tsx](../../client/src/pages/APIDetails/APIDetails.tsx)); fetching a sample through TanStack Query follows the existing [data-fetching pattern](../features/data-fetching-and-state.md).
- The [Query Builder](./query-builder.md) needs the same field-path derivation for its field picker; if both land, extract one shared `deriveShape()` utility.

## Effort & risk

**Small–medium.** Type inference over messy real-world JSON has edge cases (nulls, mixed types in one field, empty arrays) — the honest answer is a union like `string | null`, which is itself a good lesson. Keep the emitted TypeScript deliberately simple; this is a teaching aid, not a codegen product.

## Open questions

- Sample size vs. accuracy: first page only, or fetch more for rare-field coverage?
- Also emit JSON Schema, or is TypeScript the one format worth maintaining?

## Key files

- [client/src/pages/APIDetails/APIDetails.tsx](../../client/src/pages/APIDetails/APIDetails.tsx) — host page
- [client/src/components/Playground/JsonTree.tsx](../../client/src/components/Playground/JsonTree.tsx) — possible rendering base

## Related

- **Planning:** [Implementation plan](./plans/response-shape-viewer-implementation.md) · [Decision log](./plans/response-shape-viewer-decisions.md)
- [Query Builder](./query-builder.md) — shared field derivation
- [Endpoint Data](../data/README.md) — dataset format and heterogeneity
