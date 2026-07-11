---
title: Client Features
description: What the React site does and how each piece works
audience: [developer, architect]
---

[Wiki Home](../README.md)

# Client Features

The React site's moving parts, one concept per page.

| Page | One-liner |
| --- | --- |
| [Pages & Routing](./pages-and-routing.md) | File-based routes, layout, view transitions, code-splitting |
| [Data Fetching & State](./data-fetching-and-state.md) | TanStack Query for server state, minimal context for UI state |
| [API Details Page](./api-details-page.md) | Per-API page with endpoint switcher and lazy Playground |
| [Playground](./playground.md) | CodeMirror editor + sandboxed iframe runner |
| [HTTP Inspector](./http-inspector.md) | The Playground's Network tab — every fetch, with status, timing, headers |
| [Guided Challenges](./guided-challenges.md) | /learn — ordered exercises that run in the Playground and grade themselves |
| [Challenge Checks](./challenge-checks.md) | How a run gets graded — event stream, check specs, timing rules |
| [JSON Tree Viewer](./json-tree-viewer.md) | Collapsible DevTools-style output rendering |
| [Styling](./styling.md) | Plain-CSS design system — tokens, import chain, naming |

The endpoints these features consume are described in [API Surface](../api/README.md).
