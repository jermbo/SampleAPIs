---
title: Scratch Endpoints — Decisions
description: Build/defer/reject call plus open decisions for user-supplied temporary endpoints
audience: [developer, architect]
status: awaiting-decisions
---

[Wiki Home](../../README.md) › [Future Features](../README.md) › [Plans](./README.md)

# Scratch Endpoints — Decisions

Decisions for the [implementation plan](./scratch-endpoints-implementation.md). **D0 is the real decision** — this is the only proposal where "don't build it" is a fully respectable outcome, and the proposal itself said so. D1–D4 only matter if D0 says build.

## D0 — Build, defer, or reject

**Question:** Does SampleAPIs take on user-supplied content at all?

**Why it matters:** Every other proposal serves _our_ data to learners. This one serves _their_ data from _our_ domain — a permanent abuse-response duty (and occasional takedown request) lands on the maintainer the day it ships. The learner need is real but partially covered elsewhere: [Guided Challenges](./guided-challenges-implementation.md) gives structured practice, and dedicated services (mockapi.io, beeceptor, mocki) offer exactly this with staff on call.

| Option                                                               | Pros                                                                                                                                                                                        | Cons                                                                                                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Build now                                                         | The single most-requested capability class for mock-API tools; deepens "practice here" into "prototype here"; the jsonRouter reuse makes our version unusually cheap mechanically           | Abuse surface + support surface are forever; effort competes with the challenges flagship; moderate-traffic caps mean the feature can be "full" and disappoint |
| **B. Defer — revisit after Guided Challenges ships (recommended)**   | Sequencing matches the roadmap anyway; challenges data will show whether "my own shape" demand survives; the adapter refactor (phase 1) can still be done early since it's pure improvement | The need goes unmet for a while; "defer" can quietly mean "never" (mitigate: give it a revisit date)                                                           |
| C. Reject — add a docs page recommending dedicated mock-API services | Zero risk, zero effort, honest to users                                                                                                                                                     | Sends learners off-site for a thing adjacent to the mission; hard to un-reject later with a straight face                                                      |

**Recommendation:** B, with a named revisit trigger: _when the pilot challenge track has shipped and there's evidence (issues, requests) that learners want custom shapes_. Record the outcome in [Decisions](../../decisions/README.md) either way — this one's rationale deserves permanence.

**Decision:** _Pending_

## D1 — Storage model (if building)

**Question:** Memory-only, or spill to disk?

| Option                           | Pros                                                                                                                                                             | Cons                                                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Memory-only (recommended)** | "Temporary" is enforced by physics — a restart or deploy clears everything, which is the promise anyway; no cleanup of orphaned files; caps are trivially global | Deploys mid-afternoon delete someone's afternoon endpoint (acceptable: the 410 explains); memory is the scarcest resource in small containers |
| B. Disk-backed (temp files)      | Survives restarts; memory pressure moves to disk                                                                                                                 | Files named by user input on our filesystem; cleanup machinery; "temporary" now needs enforcing in code rather than by nature                 |

**Recommendation:** A — it is also what keeps the worst case boring: global byte-cap × 1 = maximum possible memory cost, ever.

**Decision:** _Pending_

## D2 — Client UI in v1 (if building)

**Question:** Does v1 ship a "make your own endpoint" page, or is it API-only?

| Option                                                   | Pros                                                                                                                                                                   | Cons                                                                                                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **A. API-only + a docs page (recommended)**              | The target user (someone with their own JSON, building an app) is exactly the user who can POST; keeps v1 focused on the risky part (the server); UI can follow demand | Less discoverable; no Playground attached to your namespace out of the box (mitigate: the docs page shows a copy-paste snippet)            |
| B. Full page: paste JSON → get URL → attached Playground | Great demo moment; the Playground attachment is genuinely useful                                                                                                       | Doubles the feature's surface in the same release as its riskiest parts; invites drive-by (non-learner) usage the caps then have to absorb |

**Recommendation:** A for v1; B becomes attractive only if usage proves out.

**Decision:** _Pending_

## D3 — TTL and cap values (if building)

**Question:** Concrete numbers for expiry and caps. Proposed defaults to accept or edit:

| Knob                      | Proposed                         | Rationale                                                                            |
| ------------------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| TTL                       | 4 hours, fixed                   | "This afternoon", not hosting; fixed beats a parameter (nothing to abuse or explain) |
| Payload / namespace size  | 100 kb (the existing body limit) | One limit everywhere; plenty for practice datasets                                   |
| Resources per namespace   | 5                                | A todo app, not a warehouse                                                          |
| Records per resource      | 500                              | Enough to make pagination meaningful                                                 |
| Per-IP active namespaces  | 3                                | A classroom NAT gets 3 — acceptable; raise if it bites                               |
| Global namespaces / bytes | 500 / ~50 MB                     | Bounded worst case on a small container; 503 beyond                                  |
| Creation rate             | ~10/hour/IP                      | Creation is the expensive act; iteration happens _inside_ a namespace                |

**Recommendation:** Accept as written; every value is a config constant so tuning is a one-line change later.

**Decision:** _Pending_

## D4 — Abuse-posture sign-off (if building)

**Question:** Explicit sign-off on the security posture in the plan — specifically that the defense is **structural** (JSON-only + nosniff, no HTML rendering, unguessable + unlisted URLs, tight caps and TTL) and that **content scanning / word filters are deliberately not part of it** (evadable, false-positive-prone, and implying a moderation duty we can't staff).

| Option                                             | Pros                                                                                                                                                                                                   | Cons                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **A. Accept the structural posture (recommended)** | Every defense is testable and can't be evaded by rewording; the residual risk (someone points a victim at raw JSON on our domain) is low-value for attackers and answerable by the takedown note below | Residual risk is nonzero and lands on the maintainer                                                               |
| B. Require content scanning too                    | Feels safer                                                                                                                                                                                            | Isn't: filters catch nothing determined and add a false-security story; still requires the structural layer anyway |

**Either way:** ship with a documented manual kill switch (clear one namespace / clear all, e.g. via the existing reset pathway) and an abuse-contact note in the docs page — that's the whole incident-response plan, and it should be written before launch, not during an incident.

**Recommendation:** A.

**Decision:** _Pending_

## Ready-to-build checklist

- [ ] D0 answered (if defer/reject: record in [Decisions](../../decisions/README.md) and close this plan)
- [ ] D1–D4 answered (if building)
- [ ] Roadmap status updated in [Plans](./README.md)

## Related

- [Implementation plan](./scratch-endpoints-implementation.md) · [Proposal](../scratch-endpoints.md) · [Roadmap](./README.md)
- [Why Persistent Writes + Resets](../../decisions/why-weekly-resets.md)
