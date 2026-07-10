---
title: System Overview
description: What SampleAPIs is and how its two apps fit together
audience: [developer, architect]
---

[Wiki Home](../README.md) › [Architecture](./README.md)

# System Overview

SampleAPIs is a free, no-authentication playground of RESTful sample APIs for people learning to work with APIs. One repository, two deployable apps, zero databases.

```mermaid
graph LR
    Browser((Browser))
    subgraph "client/ · sampleapis.com"
        Client[React 19 + Vite<br/>:4444]
    end
    subgraph "server/ · api.sampleapis.com"
        Server[Express 5<br/>:5555]
        Files[("server/api/*.json")]
        Backups[("*.json.backup")]
    end
    Browser --> Client
    Client -- "fetch" --> Server
    Server -- "read / write" --> Files
    Backups -- "restore on reset" --> Files
```

## The two apps

- **Server** — an Express 5 app that serves every JSON file in `server/api/` as a full-CRUD REST API. See [REST Conventions](../api/rest-conventions.md) for the API surface.
- **Client** — a React site that lists the available APIs, shows details for each, and embeds a code [Playground](../features/playground.md) for trying requests in the browser.

## The datastore is the filesystem

Each API is one JSON file, read fresh on every request. Mutations are written back to the same file, and every file has a `.json.backup` twin used to [reset the data](../data/data-reset.md). This is a deliberate choice — see [Why Flat JSON Files](../decisions/why-flat-json-files.md).

## Defining traits

- **No auth** — anyone can read and write; that is the point of the service.
- **Rate limited** — abuse is contained by [two request limiters](../api/rate-limiting.md).
- **Self-healing** — data is periodically restored from the backup twins.
- A legacy Pug-rendered site still ships inside the server at `/` (see [Service Routes](../api/service-routes.md)).

## Key files

- [server/sampleapis.js](../../server/sampleapis.js) — server entry point
- [client/src/main.tsx](../../client/src/main.tsx) — client entry point

## Related

- [Project Structure](./project-structure.md)
- [Tech Stack](./tech-stack.md)
- [Request Lifecycle](./request-lifecycle.md)
