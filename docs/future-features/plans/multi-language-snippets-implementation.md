---
title: Multi-Language Snippets — Implementation Plan
description: User stories, architecture, and build phases for copy-only curl/Python/Node snippet tabs
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Multi-Language Snippets — Implementation Plan

Plan for the [Multi-Language Snippets proposal](../multi-language-snippets.md): copy-ready curl / Python / Node examples templated with the active endpoint URL, clearly separated from the runnable JavaScript tabs. Open choices live in the [decision log](./multi-language-snippets-decisions.md).

## User stories

1. **Python learner gets an on-ramp.** As someone learning REST from a Python course, I can copy a working `requests` example for the endpoint I'm looking at instead of translating JavaScript by hand.
2. **Terminal user tests instantly.** As a shell user, I can copy a curl command — plain GET, GET with a query string, and a POST with a JSON body — and run it as-is.
3. **Endpoint switching updates everything.** As a user switching endpoints on the details page, every language tab updates to the new URL at once, exactly like the JS starters do today.
4. **No false affordance.** As a user, I can immediately tell which tabs _run in the browser_ and which are _copy-only_ — the UI never suggests Python will execute.

## Architecture

An extension of the existing snippet-template pattern, plus a copy-only presentation surface.

### Data model

[snippets.ts](../../../client/src/components/Playground/snippets.ts) currently exports `SNIPPETS: { id, label, build(url) }[]`, all runnable JavaScript. Add a parallel export rather than a flag on the existing list — the two lists feed different UIs and shouldn't be accidentally mixed:

`COPY_SNIPPETS: { id, label, language, variants: { id, label, build(url) }[] }[]`

One entry per language; variants are the 2–3 canonical examples per language (GET / GET + query / POST). Language set is [decision D2](./multi-language-snippets-decisions.md#d2--language-set). Templates must track the documented [REST Conventions](../../api/rest-conventions.md) and [query syntax](../../api/querying-and-filtering.md) — the same drift risk the JS starters already carry, so keep them **few and canonical**, mirroring the three JS starters (GET-async, GET-then, POST) in spirit.

Template content guidelines (part of the review bar for this feature):

- curl: real flags people should learn (`-X POST -H "Content-Type: application/json" -d '…'`), no gratuitous ones.
- Python: `requests` (the community default); whether a zero-install `urllib` variant is included is part of D2.
- Node: built-in `fetch` (Node ≥18) — identical to browser code, which is itself the lesson; `axios` variant only if D2 keeps it.
- POST bodies must satisfy the server's shape validation ([verifyData.js](../../../server/utils/verifyData.js) rejects bodies missing dataset keys) — same constraint the JS POST starter has. Keep bodies generic-but-valid or note the expected-shape error as part of the snippet comment.

### Presentation

Copy-only snippets render as a syntax-highlighted, read-only block with a copy button. Placement (inside the Playground tab bar vs. a separate block) is [D1](./multi-language-snippets-decisions.md#d1--placement); highlighting approach (plain block vs. CodeMirror read-only) is [D3](./multi-language-snippets-decisions.md#d3--syntax-highlighting). Whatever D1 picks, copy-only tabs get a distinct visual treatment (e.g. a "copy" glyph in the tab label and no Run button in scope) so runnable vs. copyable is legible at a glance — that's user story 4 and the one hard UI requirement.

## Build phases

| Phase           | Scope                                                                                                                                                            | Done when                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1. Templates    | `COPY_SNIPPETS` with the D2 language set; each variant hand-run against a live endpoint                                                                          | Every emitted snippet executes successfully as-is (curl in a shell, Python in a venv, Node in a REPL) |
| 2. UI block     | Placement per D1, highlighting per D3, copy button + feedback                                                                                                    | Endpoint switching re-templates all tabs; runnable/copy-only distinction obvious to a fresh viewer    |
| 3. Docs & guard | Feature doc in `docs/features/`; note in [code-style](../../contributing/code-style.md) or the feature doc that query-syntax changes must update these templates | Drift responsibility is written down somewhere findable                                               |

## Testing & verification

- The honest test is executing the emitted snippets — do it once per template change (phase 1 gate), not in CI.
- Templating itself (URL interpolation) is trivial; verify by switching endpoints and eyeballing.
- No sandbox or security surface: nothing here executes in the browser.

## Out of scope (v1)

- Running non-JS code (no pyodide, no server-side execution — ever, per the sandbox decision).
- Exhaustive per-operation snippets (PUT/PATCH/DELETE variants) — the three canonical operations teach the pattern; the [REST Conventions](../../api/rest-conventions.md) page covers the rest.
- Auto-generated snippets from an OpenAPI spec (there is no spec; templates are the source of truth).

## Key files

- [client/src/components/Playground/snippets.ts](../../../client/src/components/Playground/snippets.ts) — pattern to extend
- [client/src/components/Playground/Playground.tsx](../../../client/src/components/Playground/Playground.tsx) — tab UI host
- [server/utils/verifyData.js](../../../server/utils/verifyData.js) — constraint on POST snippet bodies

## Related

- [Multi-Language Snippets — Decisions](./multi-language-snippets-decisions.md)
- [Proposal](../multi-language-snippets.md) · [Roadmap](./README.md)
- [REST Conventions](../../api/rest-conventions.md) · [Querying & Filtering](../../api/querying-and-filtering.md)
