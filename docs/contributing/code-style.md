---
title: Code Style
description: Conventions on each side of the repo and the tools that enforce them
audience: developer
---

[Wiki Home](../README.md) › [Contributing](./README.md)

# Code Style

Match the code around you — the two apps have different idioms on purpose.

## Server (`server/`)

- **CommonJS JavaScript** (`require`/`module.exports`) — no build step, runs directly on Node
- Routers live in `routes/`, shared logic in `utils/`; each router exports an `express.Router()`
- Comments explain *constraints* (security guards, ordering requirements), not what the next line does

## Client (`client/`)

- **TypeScript + function components** typed as `React.FC<Props>`, one folder per component (`Component/Component.tsx`); pages live in `pages/` with a matching route file in `routes/`
- Server data goes through [TanStack Query hooks](../features/data-fetching-and-state.md), not contexts or effects
- Linting is **oxlint** (`npm run lint`); an `.editorconfig` covers whitespace basics
- CSS follows the [styling conventions](../features/styling.md) — tokens, BEM-flavored names

## Docs (`docs/`)

Wiki pages follow the house format: YAML front matter, breadcrumb, one concept per page, a Related section — see the [wiki home](../README.md) for the template.

## Related

- [Styling](../features/styling.md)
- [Pull Request Flow](./pull-request-flow.md)
