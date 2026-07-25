---
title: Multi-Language Snippets — Decisions
description: Open decisions to resolve before building the copy-only language tabs
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Multi-Language Snippets — Decisions

Decisions needed before the [implementation plan](./multi-language-snippets-implementation.md) is buildable.

## D1 — Placement

**Question:** Do copy-only language tabs join the Playground's existing tab bar, or live in a separate "In other languages" block?

**Why it matters:** The Playground's tab bar currently means "click to load runnable code into the editor". Mixing in tabs that _can't run_ changes what the bar means.

| Option                                                    | Pros                                                                                                         | Cons                                                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **A. Separate block below the Playground (recommended)**  | Runnable vs. copy-only stays structurally separate — no explaining needed; block can be collapsed by default | Less discoverable than the tab bar; some duplication of tab-styling                                             |
| B. Same tab bar, visually marked (copy glyph, dimmed Run) | One snippet home; maximum discoverability                                                                    | Clicking "Python" next to a Run button implies it runs; disabling Run per-tab is a fiddly state to keep correct |

**Recommendation:** A — a titled block ("Use this endpoint from other languages") preserves the tab bar's meaning and needs no caveats.

**Decision:** _Pending_

## D2 — Language set for v1

**Question:** Which languages/variants make the first cut? Each addition is permanent maintenance surface (drift against query-syntax and CRUD docs).

| Option                                                       | Pros                                                                                                   | Cons                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **A. curl + Python `requests` + Node `fetch` (recommended)** | Covers shell, the biggest non-JS learner group, and backend JS; three languages ≈ three tabs, clean UI | No zero-install Python (`requests` needs pip); no axios                                                       |
| B. curl + Python only                                        | Smallest maintenance                                                                                   | Node users copy browser JS anyway, but omitting it makes the site look browser-only                           |
| C. A plus `urllib` and `axios` variants                      | Zero-install Python; axios remains common in tutorials                                                 | Five variants per operation starts feeling like a docs site; axios is a dependency lesson, not an HTTP lesson |

**Recommendation:** A. Add variants later only on demonstrated demand — removal is much harder than addition.

**Decision:** _Pending_

## D3 — Syntax highlighting

**Question:** How are copy-only snippets rendered?

| Option                                                                       | Pros                                                       | Cons                                                                                                                                 |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **A. Plain `<pre><code>` with the site's mono styling (recommended for v1)** | Zero new dependencies, zero bundle cost, trivially correct | No colors; slightly less polished next to the CodeMirror editor                                                                      |
| B. CodeMirror read-only with `@codemirror/lang-python` etc.                  | Consistent look with the editor; proper highlighting       | New language packages in the bundle (lazy-loadable, but real weight) for read-only text; shell has no first-party CodeMirror package |
| C. A lightweight static highlighter dependency                               | Colors at small cost                                       | A new dependency category for a cosmetic gain                                                                                        |

**Recommendation:** A for v1 — these snippets are 5–10 lines; upgrade to B/C later purely as polish if it grates.

**Decision:** _Pending_

## Ready-to-build checklist

- [ ] D1–D3 answered
- [ ] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./multi-language-snippets-implementation.md) · [Proposal](../multi-language-snippets.md) · [Roadmap](./README.md)
