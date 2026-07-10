---
title: Why a Custom JSON Router
description: Replacing json-server (and the GraphQL layer) with ~240 owned lines
audience: architect
---

[Wiki Home](../README.md) › [Decisions](./README.md)

# Why a Custom JSON Router

The server originally ran on **json-server** with **json-graphql-server** alongside it. Today both are gone, replaced by a single in-house router factory: [server/utils/jsonRouter.js](../../server/utils/jsonRouter.js).

## Why replace json-server

- The needed feature set is a **small, stable subset**: CRUD, filters, sort, pagination — roughly 240 lines once written down
- Owning the router removes a dependency treadmill on the project's most critical path, and lets project-specific behavior (per-file write locking, fresh-from-disk reads that make [resets](../data/data-reset.md) instant, [ReDoS-safe `_like`](../api/querying-and-filtering.md)) live directly in the code instead of in workarounds
- **Compatibility was the constraint**: response shapes and query params deliberately mirror json-server 0.17, because years of tutorials point students at this API

## Why GraphQL went away

The GraphQL layer rode along with the json-server era. When the data layer was rewritten, it was not carried over — the REST surface is the product, and the supported interface today is REST only. (Old references to it survive in places like `CONTRIBUTING.md`.)

## Revisit when

json-server compatibility stops mattering, or a feature (relations, schemas) would mean re-implementing a real framework.

## Related

- [REST Conventions](../api/rest-conventions.md)
- [CRUD & Validation](../api/crud-and-validation.md)
- [Why Flat JSON Files](./why-flat-json-files.md)
