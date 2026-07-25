---
title: Auth Training Wheels — Decisions
description: Go/no-go framing plus open decisions for the token-auth demo API
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Auth Training Wheels — Decisions

Decisions needed before the [implementation plan](./auth-training-wheels-implementation.md) is buildable. **D0 comes first** — the proposal itself flagged the tension with the site's founding "no auth" premise, and that call belongs to the maintainer, made once, in writing. If D0 is _no_, the rest are moot.

## D0 — Go/no-go, and the promise-protection guardrails

**Question:** Build an auth-teaching demo at all — and if so, under which non-negotiable guardrails?

**Why it matters:** "No keys, no sign-up" is the identity of the site. A feature that _teaches_ auth can coexist with that identity only if it can never be mistaken for the site _acquiring_ auth.

| Option                                                                            | Pros                                                                                                                                                                                    | Cons                                                                                             |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A. Build, with written guardrails (recommended)**                               | Auth is the #1 wall learners hit right after leaving SampleAPIs; a consequence-free practice ground is squarely on-mission; tokens-without-accounts keeps the anonymous posture literal | Even labeled well, it's one more concept on the site; guardrail discipline must outlive this doc |
| B. Don't build                                                                    | Zero risk to the promise; effort goes to challenges instead                                                                                                                             | The gap stays; learners' first 401 happens on a real API with real stakes                        |
| C. Defer until Guided Challenges ships, then build as a challenge track's backend | Arrives with its curriculum attached; sequencing matches the roadmap anyway                                                                                                             | Same work later; the standalone demo has value before challenges exist                           |

**Proposed guardrails (accepting option A means accepting these, edit as needed):**

1. Exactly **one** demo API requires a token; every other endpoint stays keyless, forever.
2. It is never presented as a feature of the platform — always as a _lesson_. Naming, badges, and copy say "demo"/"practice"; it never appears in hero/landing copy.
3. Minting requires no input whatsoever: no email, no name, no captcha. One click / one POST.
4. Tokens carry no identity and nothing about minting is logged beyond standard request logs.
5. If any future change would require auth on a regular endpoint, that's a different decision page, not an extension of this one.

**Recommendation:** A. The guardrails, not the code, are what this decision is really about; once accepted they should be recorded as a page in [Decisions](../../decisions/README.md) when the feature ships.

**Decision:** _Pending_

## D1 — Credential mechanisms

**Question:** Bearer header only, or also an `?api_key=` query-param variant?

| Option                                    | Pros                                                                                                                   | Cons                                                                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **A. Bearer only (recommended)**          | One clear lesson; the header is the pattern that generalizes (and the one beginners fumble); smaller middleware matrix | Query-param keys are still common in the wild (maps, weather APIs) and go untaught                                     |
| B. Bearer + `api_key` on the same dataset | Two ubiquitous patterns, one vault; cheap to add mechanically                                                          | Two ways to succeed muddies the teaching 401s ("which method was I supposed to use?"); doubles the failure-copy matrix |

**Recommendation:** A for v1. If a challenges auth-track later wants the api-key lesson, add it _then_, as a separate exercise stage.

**Decision:** _Pending_

## D2 — Token implementation

**Question:** Hand-rolled JWT-format HMAC (Node `crypto`, zero deps) or the `jsonwebtoken` library?

| Option                                                      | Pros                                                                                                                                                                             | Cons                                                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **A. Hand-rolled JWT-shape, ~40 owned lines (recommended)** | Zero dependencies (matches the custom-router philosophy); the whole mechanism is readable by contributors — itself documentation; surface is tiny (HS256 sign/verify, exp check) | Owned crypto-adjacent code demands careful tests (timing-safe compare, base64url edges); no library hardening |
| B. `jsonwebtoken` dependency                                | Battle-tested verification, familiar API                                                                                                                                         | A dependency (plus transitive) for two functions; version churn; the site uses none of its breadth            |

**Recommendation:** A — with `crypto.timingSafeEqual` for signature comparison and the phase-1 test matrix from the plan. The demo protects fake lab inventory that resets weekly; the threat model is a teaching aid's, but write it as if it weren't.

**Decision:** _Pending_

## D3 — Token lifetime

**Question:** Default TTL, given the goal that learners should _experience_ expiry?

| Option                                                                           | Pros                                                                                                                               | Cons                                                                               |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **A. 45 min default + `?ttl=` param, 30 s floor / 60 min ceiling (recommended)** | Long enough to never interrupt a normal session; the `ttl` param makes expiry a deliberate 60-second exercise instead of an ambush | Two things to document (default + param)                                           |
| B. Short default (~10 min)                                                       | Everyone hits expiry organically                                                                                                   | Expiry mid-exercise reads as "the site is broken" to the very audience this serves |
| C. Long default (24 h)                                                           | Never interrupts                                                                                                                   | Nobody experiences expiry; half the lesson evaporates                              |

**Recommendation:** A — expiry as an invited exercise (the starter snippet mints with `ttl=60` in its expiry act), not a surprise.

**Decision:** _Pending_

## D4 — Client UI scope for v1

**Question:** How much client surface ships with the server pieces?

| Option                                                                     | Pros                                                                                                  | Cons                                                                                             |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A. Badge + mint button with countdown + starter snippets (recommended)** | The one-click promise is literal; the countdown makes expiry visible; snippets carry the whole lesson | Medium client work (registry flag plumbing, new details-page affordance)                         |
| B. Server + docs only; mint via POST from the Playground                   | Ships fastest; the POST _is_ arguably part of the lesson                                              | "One click, no signup" becomes "read the docs first" — weakens exactly the framing D0 depends on |
| C. A plus a dedicated lesson page walking the whole flow                   | Strongest pedagogy                                                                                    | That page is really a Guided Challenges track wearing a costume — wait and build it there        |

**Recommendation:** A, treating C as the future challenges track.

**Decision:** _Pending_

## Ready-to-build checklist

- [ ] D0 answered (and guardrails edited/accepted)
- [ ] D1–D4 answered
- [ ] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./auth-training-wheels-implementation.md) · [Proposal](../auth-training-wheels.md) · [Roadmap](./README.md)
- [Decisions](../../decisions/README.md) — where the accepted D0 guardrails get their permanent page
