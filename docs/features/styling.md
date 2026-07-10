---
title: Styling
description: The plain-CSS design system — tokens, import chain, and naming
audience: developer
---

[Wiki Home](../README.md) › [Client Features](./README.md)

# Styling

The client is styled with **plain CSS** — no preprocessor, no CSS-in-JS. A former Sass setup was flattened into hand-authored custom properties.

## Structure

`styles/styles.css` is the single entry, imported once by the root route. It chains everything in cascade order: fonts → `tokens.css` → `base.css` → `typography.css` → component styles → `responsive.css` → `transitions.css`.

- **`tokens.css`** — all design tokens as CSS custom properties: color scales (primary/secondary/text/background), a six-color accent palette cycled across cards and tags, and font-size scales for text/headings/display
- **Component styles** — one file per UI area (`api-card.css`, `nav.css`, …); components with heavy self-contained styling ([Playground](./playground.md)) import their own CSS file instead
- **`transitions.css`** — the View Transition animations used by [routing](./pages-and-routing.md)
- Fonts are **self-hosted via Fontsource** — no third-party font request, no layout shift

## Naming

BEM-flavored: `block__element` with leading-dash modifiers (`-active`, `-collapsed`, `-api-details`).

A living reference of the system renders at **`/style-guide`** in the app.

## Key files

- [client/src/styles/styles.css](../../client/src/styles/styles.css) — the import chain
- [client/src/styles/tokens.css](../../client/src/styles/tokens.css) — the tokens
- [client/src/pages/StyleGuide/StyleGuide.tsx](../../client/src/pages/StyleGuide/StyleGuide.tsx)

## Related

- [Pages & Routing](./pages-and-routing.md)
- [Code Style](../contributing/code-style.md)
