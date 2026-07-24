---
title: Why a Sandboxed Playground
description: Running untrusted user code in a null-origin iframe
audience: architect
---

[Wiki Home](../README.md) › [Decisions](./README.md)

# Why a Sandboxed Playground

The [Playground](../features/playground.md) executes whatever JavaScript the visitor types. That is untrusted code running inside our site, so where it runs is a security decision.

## The chosen design

An invisible iframe with `sandbox="allow-scripts"` and **no** `allow-same-origin`:

- The iframe gets an **opaque (null) origin** — user code cannot read the host page's DOM, cookies, or `localStorage`, and can't make same-origin authenticated requests
- The only channel is `postMessage`, gated by a **per-run random token**, with console output sanitized to JSON-safe values before crossing
- A **5-second timeout** destroys the iframe, so infinite loops can't wedge the page
- Code is compiled with `AsyncFunction`, giving learners top-level `await` for free

## Alternatives rejected

- **`eval()` / `new Function()` on the page** — user code would run with full access to the site's origin; a pasted malicious snippet becomes self-XSS
- **Hosted sandboxes (Sandpack/CodeSandbox-style)** — those run on a *public* origin, and Chrome's **Private Network Access** blocks public pages from fetching `localhost`. Snippets would work in production yet silently fail against a local dev server. Because the iframe here is hosted by the page itself, its fetches are loopback-to-loopback in dev and keep working (see the note in [client/src/utils/Config.ts](../../client/src/utils/Config.ts))
- **Server-side execution** — heavy infrastructure, and pointless when the thing being taught is *browser* `fetch`

## Related

- [Playground](../features/playground.md)
- [Data Fetching & State](../features/data-fetching-and-state.md)
