---
title: SampleAPIs Wiki
description: Single-concept, 60-second pages documenting the SampleAPIs system
audience: [developer, architect]
---

# SampleAPIs Wiki

Documentation for [SampleAPIs](https://sampleapis.com) — a free, no-auth playground of RESTful sample APIs for learning. Each page covers **one concept in about 60 seconds** and links onward, wiki-style. Everything here is written against the current code; when a page names a file, the link goes to the source.

## Start here

- **Architect / evaluating the system?** [System Overview](./architecture/system-overview.md) → [Request Lifecycle](./architecture/request-lifecycle.md) → [Decisions](./decisions/README.md)
- **Developer / contributing?** [Getting Started](./contributing/getting-started.md) → [Adding an Endpoint](./data/adding-an-endpoint.md)
- **Just want to use the API?** [REST Conventions](./api/rest-conventions.md) → [Querying & Filtering](./api/querying-and-filtering.md)

## Sections

| Section | What it covers |
| --- | --- |
| [Architecture](./architecture/README.md) | The two apps, the tech stack, and how a request flows |
| [API Surface](./api/README.md) | REST conventions, queries, CRUD, rate limits, errors, service routes |
| [Endpoint Data](./data/README.md) | The JSON datasets — format, registry, resets, custom endpoints |
| [Client Features](./features/README.md) | Routing, state, the Playground, styling |
| [Operations](./operations/README.md) | Local dev, Docker, deployment, testing |
| [Contributing](./contributing/README.md) | Setup, code style, pull request flow |
| [Decisions](./decisions/README.md) | Why it's built this way — trade-offs and revisit triggers |
| [Future Features](./future-features/README.md) | Proposed features under consideration, one evaluable proposal per page |

## Page conventions

Every page has YAML front matter (`title`, `description`, `audience`), a breadcrumb back to its section, one concept in the body (with a Mermaid diagram where a picture explains it faster), source links under **Key files**, and onward links under **Related**. When a topic deserves more than a sentence of explanation, it gets its own page and an inline link — if you can't link to it, it isn't documented yet.
