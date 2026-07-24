---
title: Getting Started
description: From clone to running app to first contribution
audience: developer
---

[Wiki Home](../README.md) › [Contributing](./README.md)

# Getting Started

```bash
git clone https://github.com/jermbo/SampleAPIs.git
cd SampleAPIs
npm install && npm install --prefix server && npm install --prefix client
npm run dev
```

Server at `http://localhost:5555`, site at `http://localhost:4444` — details in [Local Development](../operations/local-development.md).

## Orient yourself

- New to the system? Read the [System Overview](../architecture/system-overview.md) first (2 minutes)
- Working on data? [Endpoint JSON Format](../data/endpoint-json-format.md) and [Adding an Endpoint](../data/adding-an-endpoint.md)
- Working on the site? [Client Features](../features/README.md)
- Working on the server? [Request Lifecycle](../architecture/request-lifecycle.md) and [API Surface](../api/README.md)

## Contribution ideas

The most valued contribution is **new or improved datasets** — the project exists to give learners interesting data to play with. Process-wise, start with an issue before you code (see [Pull Request Flow](./pull-request-flow.md)).

## Related

- [Pull Request Flow](./pull-request-flow.md)
- [Code Style](./code-style.md)
- [Local Development](../operations/local-development.md)
