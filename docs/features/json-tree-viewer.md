---
title: JSON Tree Viewer
description: The collapsible tree that renders Playground output
audience: developer
---

[Wiki Home](../README.md) › [Client Features](./README.md)

# JSON Tree Viewer

`JsonTree` renders any JSON-safe value from the [Playground](./playground.md) sandbox as a collapsible tree, DevTools-style, instead of a wall of stringified JSON.

## Behavior

- **Recursive** — each object/array node is another `JsonTree` with `depth + 1`
- **Auto-open depth 1** — the root level starts expanded, everything deeper starts collapsed
- **Primitive styling** — strings (quoted), numbers, booleans, and `null` each get a CSS modifier class for syntax-color output
- Primitives at the console line level are printed as plain text; only containers get the tree

The values it receives were already sanitized inside the sandbox (functions become `ƒ name()`, circular references become `[Circular]`, errors become `Name: message`), so the component can assume plain JSON.

## Key files

- [client/src/components/Playground/JsonTree.tsx](../../client/src/components/Playground/JsonTree.tsx)
- [client/src/components/Playground/Playground.css](../../client/src/components/Playground/Playground.css)

## Related

- [Playground](./playground.md)
