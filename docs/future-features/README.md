---
title: Future Features
description: Proposed features under consideration — one proposal per page, each independently evaluable
audience: [developer, architect]
---

[Wiki Home](../README.md)

# Future Features

Feature proposals for taking SampleAPIs from "a place to fetch sample data" to a genuine learning tool. Each page stands alone: the problem it solves, a proposed approach grounded in the current code, effort and risk, and open questions to settle before building. Nothing here is committed work — pages carry `status: proposed` until one is accepted (move it into the relevant section and document what was built) or rejected (record why in [Decisions](../decisions/README.md)).

## Proposals

| Page | One-liner | Learning impact | Effort |
| --- | --- | --- | --- |
| [HTTP Inspector](./http-inspector.md) | Mini Network tab next to the Playground console | High | Small |
| [Query Builder](./query-builder.md) | Visual UI for the filter/sort/pagination syntax | High | Small–Medium |
| [Guided Challenges](./guided-challenges.md) | Per-API exercises with validated solutions | Very high | Large |
| [Shareable Playground Links](./shareable-playground-links.md) | Encode playground code in a URL | Medium | Small |
| [Response Shape Viewer](./response-shape-viewer.md) | Derived field/type view per endpoint, copy as TypeScript | Medium | Small–Medium |
| [Multi-Language Snippets](./multi-language-snippets.md) | curl / Python / Node tabs for the current endpoint | Medium | Small |
| [Error Practice Routes](./error-practice-routes.md) | httpbin-style delay/status/flaky endpoints | High | Medium |
| [Auth Training Wheels](./auth-training-wheels.md) | Opt-in demo API that teaches token auth | Medium–High | Medium–Large |
| [Scratch Endpoints](./scratch-endpoints.md) | User-supplied temporary CRUD endpoints | High | Large |

## Suggested sequence

1. **[HTTP Inspector](./http-inspector.md)** — contained, reuses the sandbox messaging pattern, upgrades the core Playground immediately.
2. **[Query Builder](./query-builder.md)** — surfaces server capabilities that already exist but are invisible in the UI.
3. **[Guided Challenges](./guided-challenges.md)** — the flagship; benefits from both of the above landing first.
4. **[Shareable Playground Links](./shareable-playground-links.md)** — cheap on its own, multiplies the classroom value of challenges.

The remaining proposals are independent and can be picked up in any order; [Scratch Endpoints](./scratch-endpoints.md) carries real abuse surface and deserves the most scrutiny before a commitment.

## Related

- [Client Features](../features/README.md) — what exists today
- [API Surface](../api/README.md) — the server capabilities several proposals build on
- [Decisions](../decisions/README.md) — where accepted/rejected proposals get their rationale recorded
