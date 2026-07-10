---
title: Shareable Playground Links
description: Encode the Playground buffer into the URL so an exact exercise can be shared with a link
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# Shareable Playground Links

**Status: proposed.** Medium impact alone, small effort — and it multiplies the classroom value of [Guided Challenges](./guided-challenges.md).

## Problem

Playground code persists only to `localStorage`, per browser. A teacher who writes a worked example, or a learner who wants to show someone their broken code, has no way to hand it over. Copy-pasting into chat loses the endpoint context.

## Proposal

A **Share** button in the Playground toolbar that compresses the current buffer (e.g. `lz-string`) and puts it in the URL fragment:

```
/api-list/futurama#code=N4IgdghgtgpiBcIQBoQ...
```

Opening such a link loads the encoded code into the editor instead of the stored/starter snippet — **without overwriting the visitor's saved buffer until they edit**, so a shared link never silently clobbers someone's work. The fragment is client-side only (never sent to the server, nothing stored), which matches the site's no-accounts posture. TypeScript Playground and Svelte REPL both use this exact pattern.

## Fit with current code

- The Playground already has per-URL load/persist logic in [Playground.tsx](../../client/src/components/Playground/Playground.tsx); this adds one more code source with clear precedence: URL fragment → localStorage → starter snippet.
- Routing is TanStack Router ([Pages & Routing](../features/pages-and-routing.md)); the fragment sits outside route state, so no route changes are needed — read it on mount, clear or keep it on edit.

## Effort & risk

**Small.** One dependency (~1.5 kB compressor), a Share button with clipboard copy, and the precedence rule above. Risks: URL length limits for very long code (compress + warn past a threshold), and the standard shared-code caveat that the link runs in the recipient's sandbox exactly like typed code — the existing null-origin sandbox is the defense, and it's already the trust model for all Playground code.

## Open questions

- Should the shared link also pin the selected endpoint and snippet tab, or is code + current page enough?
- Keep the fragment in the address bar after load (re-shareable) or replace it once loaded (clean URL)?

## Key files

- [client/src/components/Playground/Playground.tsx](../../client/src/components/Playground/Playground.tsx) — buffer load/persist precedence

## Related

- **Planning:** [Implementation plan](./plans/shareable-playground-links-implementation.md) · [Decision log](./plans/shareable-playground-links-decisions.md)
- [Playground](../features/playground.md)
- [Guided Challenges](./guided-challenges.md)
- [Why a Sandboxed Playground](../decisions/why-sandboxed-playground.md) — the trust model shared links rely on
