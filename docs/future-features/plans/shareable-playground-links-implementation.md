---
title: Shareable Playground Links — Implementation Plan
description: User stories, architecture, and build phases for encoding Playground code in the URL
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Shareable Playground Links — Implementation Plan

Plan for the [Shareable Playground Links proposal](../shareable-playground-links.md): a Share button that compresses the editor buffer into the URL fragment, and load logic that opens such links without clobbering anyone's saved work. Open choices live in the [decision log](./shareable-playground-links-decisions.md).

## User stories

1. **Teacher hands out an exercise.** As a teacher, I write a worked example in the Playground, click **Share**, and the copied link opens the exact same code for every student on the right API page.
2. **Learner asks for help.** As a learner with broken code, I can send someone a link that reproduces my exact editor state instead of pasting code with no endpoint context.
3. **No clobbering.** As a visitor opening a shared link, my own saved code for that endpoint is untouched until I deliberately start editing the shared code — and I'm told that's the deal.
4. **Nothing is uploaded.** As a privacy-conscious user, sharing stores nothing server-side; the code lives entirely in the URL (the fragment is never even sent in the HTTP request).

## Architecture

The TypeScript Playground / Svelte REPL pattern: compress, put in the fragment, read on load.

### Encoding

- Dependency: `lz-string` (~1.5 kB), using `compressToEncodedURIComponent` / `decompressFromEncodedURIComponent` — URL-safe output, no manual escaping.
- Fragment format is versioned from day one: `#v1=<payload>` where the payload encodes `{ code, ep? }` (endpoint per [D1](./shareable-playground-links-decisions.md#d1--what-a-link-pins)). A bad or truncated payload decodes to null → fall back to normal load, show a small "couldn't load shared code" notice, never a crash.
- Length guard: if the resulting URL exceeds ~6,000 chars, still copy but warn ("very long links may not survive some chats"). No hard block.

### Load precedence (the core rule)

Today [Playground.tsx](../../../client/src/components/Playground/Playground.tsx) loads `localStorage[key] ?? starter`. The new order, evaluated once on mount and on endpoint change:

**URL fragment → localStorage → starter snippet.**

Shared code is held as a distinct "viewing shared code" mode:

- The editor shows the shared code, but **nothing is written to localStorage yet** — the existing change-listener persistence is suspended in this mode.
- On the first real edit, the shared code is adopted as the buffer for that endpoint (normal persistence resumes). This _does_ replace the visitor's previously saved code for that endpoint — which is why the mode ships with a banner (see [D3](./shareable-playground-links-decisions.md#d3--shared-mode-banner)) offering "restore my code" before the point of no return.
- Fragment handling after load (keep vs. strip) is [D2](./shareable-playground-links-decisions.md#d2--fragment-lifecycle).

### Share button

In the Playground toolbar next to Run: builds the fragment from the current buffer (+ pinned state per D1), writes the full URL to the clipboard, confirms with a brief "Copied" state. Uses `history.replaceState` to also place the fragment in the address bar so the visible URL matches what was copied.

### Routing & security notes

- TanStack Router state is untouched — the fragment lives outside route matching; read it via `window.location.hash` on mount.
- Trust model is unchanged: a shared link executes in the recipient's null-origin sandbox exactly like typed code, which is already the Playground's threat model ([Why a Sandboxed Playground](../../decisions/why-sandboxed-playground.md)). Code from a fragment is never `eval`'d on the host page and never rendered as HTML.

## Build phases

| Phase                            | Scope                                                                       | Done when                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1. Encode/decode module          | `lz-string` dep, versioned payload, decode-failure fallback                 | Round-trip property holds for unicode, emoji, 10 kB buffers; garbage fragments fall back cleanly |
| 2. Load precedence + shared mode | Fragment read on mount, persistence suspension, adopt-on-edit               | User story 3 walkthrough passes, incl. endpoint switching while in shared mode                   |
| 3. Share button + banner         | Toolbar button, clipboard, banner + restore action (per D3), length warning | Full teacher→student round trip on two different browsers                                        |
| 4. Polish                        | D1/D2 behaviors, copy review, feature doc in `docs/features/`               | Proposal page marked accepted                                                                    |

## Testing & verification

- Encode/decode round-trip is a pure function — unit-test it if vitest lands (see [Query Builder plan](./query-builder-implementation.md)); otherwise a manual matrix: normal code, unicode, very long buffer, corrupted fragment, empty fragment.
- Manual: shared link into a browser with existing saved code (no clobber until edit), private window (no saved code), wrong-endpoint link (per D1 behavior).
- Check the copied URL survives Slack/Discord/email paste — the encodedURIComponent variant exists precisely for this.

## Out of scope (v1)

- Server-side short links or a link database (contradicts the no-storage posture).
- Sharing anything beyond buffer + pinned endpoint state (no theme, no split-pane layout).
- Any "gallery" of shared snippets.

## Key files

- [client/src/components/Playground/Playground.tsx](../../../client/src/components/Playground/Playground.tsx) — load precedence, persistence, toolbar
- [client/src/pages/APIDetails/APIDetails.tsx](../../../client/src/pages/APIDetails/APIDetails.tsx) — endpoint selection, if D1 pins it

## Related

- [Shareable Playground Links — Decisions](./shareable-playground-links-decisions.md)
- [Proposal](../shareable-playground-links.md) · [Roadmap](./README.md)
- [Guided Challenges plan](./guided-challenges-implementation.md) — links as classroom distribution for exercises
- [Why a Sandboxed Playground](../../decisions/why-sandboxed-playground.md)
