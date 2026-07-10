---
title: API Surface
description: The REST interface the server exposes to the world
audience: [developer, architect]
---

[Wiki Home](../README.md)

# API Surface

Everything the Express server exposes over HTTP — conventions, query features, writes, limits, and errors.

| Page | One-liner |
| --- | --- |
| [REST Conventions](./rest-conventions.md) | URL shape, collections vs. singular resources, json-server compatibility |
| [Querying & Filtering](./querying-and-filtering.md) | Equality, dot paths, operator suffixes, full-text `q` |
| [Sorting & Pagination](./sorting-and-pagination.md) | `_sort`/`_order`, `_page`/`_limit`, ranges, `Link` header |
| [CRUD & Validation](./crud-and-validation.md) | Write semantics, shape validation, per-file locking |
| [Rate Limiting](./rate-limiting.md) | The global and per-API limiters |
| [Error Responses](./error-responses.md) | Every error shape and what triggers it |
| [Service Routes](./service-routes.md) | `/health`, `/frontend`, `/resetit`, `/create`, `/generate`, `/test`, legacy `/` |

The data these endpoints serve is described in [Endpoint Data](../data/README.md).
