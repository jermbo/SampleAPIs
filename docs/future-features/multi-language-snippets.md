---
title: Multi-Language Snippets
description: Copy-ready curl, Python, and Node tabs templated with the current endpoint URL
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# Multi-Language Snippets

**Status: proposed.** Medium impact, small effort — the cheapest way to widen the audience beyond JavaScript learners.

## Problem

The Playground's starter snippets ([snippets.ts](../../client/src/components/Playground/snippets.ts)) cover three JavaScript variants. But people learn REST from Python courses, shell tutorials, and mobile bootcamps too — for them the site is a data source with no on-ramp. Every major API's docs ship multi-language examples for exactly this reason.

## Proposal

Add language tabs for the current endpoint, following the existing snippet-template pattern:

- **curl** — GET, GET with query params, POST
- **Python** — `requests` (and/or stdlib `urllib` for zero-install)
- **Node** — built-in `fetch`, plus an `axios` variant

These are **copy-only**: a syntax-highlighted block with a copy button, clearly separated from the runnable JavaScript tabs (only JS runs in the browser sandbox — the UI must not blur that line). Templates interpolate the active endpoint URL exactly as `Snippet.build(url)` does today, so switching endpoints updates every language at once.

## Fit with current code

- The snippet abstraction already separates definition from rendering; this adds a `runnable: boolean` (or a parallel copy-only list) and a tab-group UI split.
- Syntax highlighting for non-JS languages can reuse CodeMirror language packages in read-only views, or a lighter static highlighter — the Playground's CodeMirror chunk is already lazy-loaded, so weight lands off the critical path either way.

## Effort & risk

**Small.** Main risk is drift: snippets must track the documented query syntax and CRUD behavior ([REST Conventions](../api/rest-conventions.md)), so keep templates few and canonical rather than exhaustive. Copy-only tabs need no sandbox or security work.

## Open questions

- Which languages make the first cut? (curl + Python covers most non-JS demand; each addition is maintenance.)
- Do copy-only tabs live inside the Playground tab bar or as a separate "In other languages" block below it?

## Key files

- [client/src/components/Playground/snippets.ts](../../client/src/components/Playground/snippets.ts) — template pattern to extend
- [client/src/components/Playground/Playground.tsx](../../client/src/components/Playground/Playground.tsx) — tab UI

## Related

- [Playground](../features/playground.md)
- [REST Conventions](../api/rest-conventions.md)
