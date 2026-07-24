---
title: TypeScript Playground — Decisions
description: Decisions for TypeScript-default Playground with live checking, injected types, and IndexedDB persistence
audience: [developer, architect]
status: ready-to-build
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# TypeScript Playground — Decisions

Decisions for the [TypeScript Playground proposal](../typescript-playground.md). Resolved in a design session (2026-07-11).

## D1 — Editor depth

**Question:** What does "TypeScript in the Playground" mean at v1?

| Option | What the learner gets |
| ------ | --------------------- |
| A. Syntax + transpile-on-run | Highlighting; types stripped before run; compile errors in Output only |
| **B. Full editor type-checking (chosen)** | A + live diagnostics (squiggles) and autocomplete where feasible |
| C. Types as copy-only docs | Separate read-only TS panel; editor stays JS |

**Decision:** **B** — full editor type-checking. Browser playgrounds already wire the TS language service; the extra work is integration and bundle size, not inventing a new model. (2026-07-11)

## D2 — Type sources

**Question:** Where do types for the checker come from?

| Option | What the learner sees |
| ------ | --------------------- |
| A. Standard libs only | `fetch` works; `data.name` is `any` unless they write interfaces |
| **B. Auto-inject endpoint types (chosen)** | Shape Viewer / `toTypeScript()` feeds a virtual types block for the active endpoint |
| C. Learner writes everything | Snippets show `interface` boilerplate as the lesson |

**Decision:** **B** — auto-inject from Explore when shape is available; fallback to learner-written interfaces when not. (2026-07-11)

## D3 — Types in the editor

**Question:** Are injected types visible to the learner?

| Option | Behavior |
| ------ | -------- |
| A. Hidden virtual file | Checker-only preamble; invisible to the learner |
| B. Visible, read-only | Greyed generated block at top |
| **C. Visible and editable (chosen)** | Generated interfaces in the buffer; learner can tweak them |

**Decision:** **C**, with split persistence to avoid silent loss on endpoint switch — see D4. (2026-07-11)

## D4 — Types overwrite on endpoint switch

**Question:** When the active endpoint changes, what happens to the types block?

**Decision:** Persist `{ userCode, types, typesSource: "generated" | "edited", lang }` per storage record (IndexedDB — D6). On endpoint switch, regenerate `types` **only when** `typesSource === "generated"`. If the learner edited types, keep their version and optionally show a banner ("Types may not match this endpoint — Reset types"). A **Reset types** action restores the generated block from the current shape. (2026-07-11)

## D5 — TS / JS toggle

**Question:** How does the language toggle behave?

| Option | Behavior |
| ------ | -------- |
| A. Same buffer | One document; mode switch is messy when syntax differs |
| **B. Separate buffers (chosen)** | Independent TS and JS saved code per endpoint/mode; separate starters |
| C. TS-only; JS is read-only transpiled view | No true JS editing |

**Decision:** **B** — separate buffers. TS is the default mode for new visitors. (2026-07-11)

## D6 — Persistence backend

**Question:** localStorage vs IndexedDB for playground and lesson state?

| Option | Tradeoff |
| ------ | -------- |
| A. Structured localStorage | Smallest diff; sync API |
| **B. IndexedDB for playground + lessons (chosen)** | Structured records; async API; natural migration moment while redesigning persistence shape |
| C. IndexedDB site-wide | Larger scope; delays TS feature |

**Decision:** **B** — IndexedDB for playground code/types/mode and lesson progress/code. One-time migration from existing `localStorage` keys. Not driven by shareable links (that proposal is rejected — see [Future Features README](../README.md)). (2026-07-11)

## D7 — Run gating

**Question:** Do type errors block Run?

| Option | Behavior |
| ------ | -------- |
| A. Block on any type error | Run disabled until checker is clean |
| B. Warn but allow always | Squiggles only; never block |
| **C. Block transpile failure only (chosen)** | Soft type errors warn; hard syntax/transpile failures block Run |

**Decision:** **C**. Beginners learn from squiggles *and* can still Run to inspect Network/output. (2026-07-11)

## D8 — Transpiler

**Question:** What compiles TS to JS before the sandbox runs?

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **A. esbuild-wasm (recommended)** | Fast; small API; good error messages; lazy-loadable | ~2–3 MB wasm on first Run |
| B. `typescript` `transpileModule` | Already in devDependencies | Heavy in browser bundle; slower |

**Decision:** _Pending implementation detail — default recommendation A._

## D9 — Injection visual cue

**Question:** How does "Send to Playground" (and other host injections) signal that the editor changed?

**Requirement (from design session):** Injection must be **obvious** — today's silent buffer swap is insufficient.

| Option | Treatment |
| ------ | --------- |
| **A. Combined cue (recommended)** | Scroll Playground into view + brief banner ("Query loaded") + short editor highlight/pulse |
| B. Banner only | Text announcement |
| C. Focus only | `focus()` on editor (status quo, insufficient alone) |

**Decision:** _Pending — must satisfy the "obvious change" requirement; recommendation A._

## D10 — Scope across Playground hosts

**Question:** API Details only, or Learn too?

**Decision:** **Both** — one `Playground` component; TS default everywhere it renders. Learn challenge *content* (TS starters in `rest-basics.ts`) can follow the machinery; checks grade runtime, not types. (2026-07-11)

## D11 — Send to Playground payload

**Question:** What does Query Builder inject in TS mode?

| Option | Payload |
| ------ | ------- |
| A. Typed fetch snippet only | e.g. `const data: Character[] = …` |
| B. Respect active mode | TS or JS snippet matching toggle |
| **C. Types + typed snippet (chosen)** | Full types block from shape + fetch using those types |

**Decision:** **C** when shape is available; fall back to typed snippet without types block when shape isn't ready. Switches to / loads TS buffer. (2026-07-11)
