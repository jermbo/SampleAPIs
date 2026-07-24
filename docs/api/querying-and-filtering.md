---
title: Querying & Filtering
description: Query parameters for filtering collection results
audience: developer
---

[Wiki Home](../README.md) › [API Surface](./README.md)

# Querying & Filtering

Collection `GET` requests accept json-server-style query parameters. All filtering happens in memory after the file is read.

## Equality

```
GET /futurama/characters?name.first=Bender
```

- Field names support **dot paths** into nested objects (`name.first`)
- Repeating a parameter is an **OR** match: `?id=1&id=2` returns both records

## Operator suffixes

Append an operator to the field name:

| Suffix  | Meaning                    | Example             |
| ------- | -------------------------- | ------------------- |
| `_gte`  | greater than or equal      | `?price_gte=10`     |
| `_lte`  | less than or equal         | `?price_lte=20`     |
| `_ne`   | not equal                  | `?id_ne=1`          |
| `_like` | case-insensitive substring | `?title_like=latte` |

`_like` is a literal substring match, **not** a regex — user input is never compiled into a `RegExp`, which would expose the server to ReDoS from a crafted pattern.

## Full-text search

```
GET /coffee/hot?q=espresso
```

`q` matches the needle anywhere in the JSON-serialized record, case-insensitively.

## Key files

- [server/utils/jsonRouter.js](../../server/utils/jsonRouter.js) — `applyFilters()`

## Related

- [Sorting & Pagination](./sorting-and-pagination.md)
- [REST Conventions](./rest-conventions.md)
