---
title: Sorting & Pagination
description: Ordering and slicing collection results
audience: developer
---

[Wiki Home](../README.md) › [API Surface](./README.md)

# Sorting & Pagination

Applied to collection `GET` results after [filtering](./querying-and-filtering.md), in this order: sort, then slice.

## Sorting

```
GET /coffee/hot?_sort=title&_order=desc
```

- `_sort` takes a comma-separated list of fields (dot paths work)
- `_order` pairs with it positionally: `_sort=price,title&_order=desc,asc`
- Default order is ascending

## Pagination

```
GET /coffee/hot?_page=2&_limit=5
```

- `_page` with optional `_limit` (default **10** per page)
- `_page` responses set a **`Link` header** with `first` / `prev` / `next` / `last` URLs — only the applicable ones (no `first`/`prev` on page 1, no `next`/`last` on the last page, no header at all when everything fits on one page)

## Ranges

```
GET /coffee/hot?_start=10&_end=20
GET /coffee/hot?_limit=3
```

- `_start` / `_end` slice by index; `_start` + `_limit` also works
- `_limit` alone caps the result from the beginning

Every collection response carries `X-Total-Count` with the total **before** slicing, so clients can compute page counts.

## Key files

- [server/utils/jsonRouter.js](../../server/utils/jsonRouter.js) — `applySort()`, `applySlice()`, `setLinkHeader()`

## Related

- [Querying & Filtering](./querying-and-filtering.md)
- [REST Conventions](./rest-conventions.md)
