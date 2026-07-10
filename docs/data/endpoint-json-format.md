---
title: Endpoint JSON Format
description: The file format every API dataset must follow
audience: developer
---

[Wiki Home](../README.md) › [Endpoint Data](./README.md)

# Endpoint JSON Format

Every API is a single JSON file in `server/api/`. The file name becomes the API name in the URL, and each **top-level key becomes a resource** (see [REST Conventions](../api/rest-conventions.md)).

```json
{
  "metaData": [
    {
      "title": "Coffee",
      "desc": "API for popular coffee drinks",
      "longDesc": "Basic list of descriptions and ingredients...",
      "featured": false,
      "categories": ["food & beverage", "list"]
    }
  ],
  "hot": [{ "title": "Latte", "id": 1 }],
  "iced": [{ "title": "Cold Brew", "id": 1 }]
}
```

## Rules

- **`metaData` is required** — an array with one object describing the API. It powers the website's [API list](../features/data-fetching-and-state.md) and is stripped from the endpoint list shown to users (though `/api-name/metaData` is still reachable).
- **Collections are arrays of objects**, and every object needs a **unique `id`** — `GET /:resource/:id` and all [write operations](../api/crud-and-validation.md) match on it.
- Objects within a collection should share the same keys — the first record acts as the schema for [validation](../api/crud-and-validation.md).
- Every file has a **`.json.backup` twin**, the pristine copy used by the [data reset](./data-reset.md).

## Key files

- [server/api/coffee.json](../../server/api/coffee.json) — a good example to copy
- [server/utils/getAPIListData.js](../../server/utils/getAPIListData.js) — how `metaData` is consumed

## Related

- [Adding an Endpoint](./adding-an-endpoint.md)
- [API Registry](./api-registry.md)
- [REST Conventions](../api/rest-conventions.md)
