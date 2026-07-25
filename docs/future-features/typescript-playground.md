---
title: TypeScript Playground
description: Default TypeScript in the Playground editor with live type-checking, auto-injected endpoint types, and a JS fallback
audience: [developer, architect]
status: proposed
---

[Wiki Home](../README.md) › [Future Features](./README.md)

# TypeScript Playground

**Status: proposed.** High learning impact, medium–large effort. Depends on [Response Shape Viewer](./response-shape-viewer.md) / Explore for endpoint types.

## Problem

The [Playground](../features/playground.md) runs JavaScript only. Beginners who move toward typed code — or who copy interfaces from the Shape Viewer — have no place to practice: the editor doesn't understand types, and there's no feedback when they mistype a field name. TypeScript is the default mental model for modern API client code, but the site's core coding surface still teaches JS.

## Proposal

Make **TypeScript the default** in the single shared `Playground` component (API Details and Learn), with a **JavaScript toggle** for learners who want the simpler path.

### Editor

- CodeMirror TypeScript mode with **live type-checking** (squiggles, diagnostics) and autocomplete where the language service can provide it — not syntax highlighting alone.
- **Transpile-on-run**: user code is compiled to JS in the parent page, then executed in the existing null-origin sandbox unchanged. The security model stays the same.

### Endpoint types (beginner-friendly)

- When a shape is available (from Explore / Shape Viewer), **inject generated interfaces** into the editor as a visible, **editable** block at the top — separated from user code.
- Starters and "Send to Playground" use those types (e.g. `const data: Character[] = await resp.json()`).
- On endpoint switch, regenerate types **only if the learner hasn't edited them** (`typesSource: generated | edited`). A "Reset types" action restores the generated block.

### TS / JS modes

- **Separate buffers** per endpoint and per mode (TS default). Switching modes loads the other saved buffer; starters differ per language.
- **Run gating**: hard transpile failures block Run; soft type errors (wrong property, type mismatch) show squiggles but still allow Run so learners can compare checker feedback with runtime/Network output.

### Persistence

- Replace ad-hoc `localStorage` strings with a structured **IndexedDB** store for playground state (code, types, mode, `typesSource`) and lesson progress/code. One-time migration from existing keys.

### Send to Playground

- From Query Builder: inject **types block + typed fetch snippet** (not just a fetch line). Must include an **obvious visual cue** that the editor changed — scroll into view, highlight/pulse, brief banner (exact treatment in the [decision log](./plans/typescript-playground-decisions.md)).

## Fit with current code

- One component already serves both hosts: [Playground.tsx](../../client/src/components/Playground/Playground.tsx) on [APIDetails.tsx](../../client/src/pages/APIDetails/APIDetails.tsx) and [LearnTrack.tsx](../../client/src/pages/Learn/LearnTrack.tsx). TS work lands once.
- The sandbox runner ([sandboxBootstrap.ts](../../client/src/components/Playground/sandboxBootstrap.ts)) stays JS-only; transpilation happens before `postMessage`.
- [toTypeScript()](../../client/src/utils/toTypeScript.ts) and [deriveShape()](../../client/src/utils/deriveShape.ts) (Explore / Shape Viewer) feed the injected types block — same emitter, not a second schema path.
- Challenge checks grade **runtime behavior** via `onRunEvent`; they don't need to change when TS is added, though challenge **starters** may get TS variants as content work.

## Effort & risk

**Medium–large.** The browser TS language service (via `@codemirror/lang-javascript` + TS worker or equivalent) and a transpiler (likely lazy-loaded `esbuild-wasm`) are real bundle and integration work, but established patterns exist (TypeScript Playground, Sandpack, Monaco). IndexedDB adds an async persistence layer and migration. The main product risk is overwhelming beginners — mitigated by editable-but-regeneratable types, JS fallback, and soft-errors-don't-block-run.

## Open questions

- Transpiler choice (`esbuild-wasm` vs `typescript` `transpileModule`) — see [D8 in the decision log](./plans/typescript-playground-decisions.md#d8--transpiler).
- Exact visual treatment for code injection — see [D9](./plans/typescript-playground-decisions.md#d9--injection-visual-cue).

## Key files

- [client/src/components/Playground/Playground.tsx](../../client/src/components/Playground/Playground.tsx) — editor, run pipeline, mode toggle
- [client/src/components/Playground/sandboxBootstrap.ts](../../client/src/components/Playground/sandboxBootstrap.ts) — unchanged JS runner
- [client/src/components/Playground/snippets.ts](../../client/src/components/Playground/snippets.ts) — TS + JS starter templates
- [client/src/utils/toTypeScript.ts](../../client/src/utils/toTypeScript.ts) — types block emitter
- [client/src/pages/APIDetails/APIDetails.tsx](../../client/src/pages/APIDetails/APIDetails.tsx) — Send to Playground host
- [client/src/challenges/rest-basics.ts](../../client/src/challenges/rest-basics.ts) — optional TS starter content

## Related

- **Planning:** [Implementation plan](./plans/typescript-playground-implementation.md) · [Decision log](./plans/typescript-playground-decisions.md)
- [Playground](../features/playground.md) · [Explore panel](../features/explore-panel.md)
- [Response Shape Viewer](./response-shape-viewer.md) · [Query Builder](./query-builder.md) — types and Send bridge
- [Guided Challenges](./guided-challenges.md) — second Playground host
