# Server Modernization Plan

> Scope: **server only** (`server/`). Companion to `frontend-modernization-plan.md`.
> Goal: bring the backend runtime, dependencies, and security current, clear the audit backlog, and remove long-standing architectural smells — **without changing the public API contract** for consumers.

## Guiding decisions

- **One Node version everywhere.** Standardize on **Node 26** (current; maintainer is on 26.5.0) and pin it in `engines`, `.nvmrc`, CI, and the Dockerfile (which today drift across 16 / 22 / 24).
- **Preserve the public API surface.** Endpoint paths, response shapes, and the reset behavior stay compatible. Consumers depend on `/{api}` and `/{api}/{resource}` responses.
- **Keep GraphQL, upgrade it.** `json-graphql-server@2.4` is the source of most of the vulnerability chain, so we move to `3.x` rather than dropping the `/graphql` endpoints (see Phase 3).
- **Native over polyfill.** Node 26 ships global `fetch`; drop `node-fetch`. `express.json()` replaces `body-parser`.
- **Each phase lands as its own PR** and stays green on install + `jest` in CI. No phase should change response payloads (verified by a snapshot baseline captured in Phase 0).

## Current state (baseline)

| Area | Now |
|---|---|
| Runtime | CI **Node 16**, Dockerfile **Node 22**, local **Node 24** — no `engines` field |
| Framework | Express **4.21** (CommonJS), Pug views, `morgan`, `cors` |
| Data APIs | `json-server@0.17.4`, `json-graphql-server@2.4.0` |
| Data store | 51 flat `api/*.json` files, each with a `*.json.backup` twin for resets |
| Rate limiting | `express-rate-limit@7` + `express-slow-down@2` (present, working) |
| Tests | `jest@29` suite in `server/tests/apis.test.js` — **not run in CI** |
| CI | `.github/workflows/node.js.yml` builds the **client** only; never installs/tests the server |

### Known issues to fix along the way

- **`cors` is undeclared.** It's `require`d in `sampleapis.js` but missing from `server/package.json`; it only resolves via a hoisted `node_modules`. A clean install breaks the server. (Phase 1)
- **`process.exit(1)` on the reset success path** (`routes/reset.js`, both `/all` and `/:id`) deliberately kills the process and relies on Docker/PM2 to restart it. Fragile, surprising, and returns a failure exit code for a success. (Phase 4)
- **24 npm audit vulnerabilities** (1 critical, 7 high, 11 moderate, 5 low) — dominated by `json-graphql-server → apollo-test-utils → graphql-tools → uuid`, plus a critical `shell-quote`. (Phases 2–3)
- **Lockfile drift:** `package.json` pins `concurrently ^8.2.2` but `9.1.2` is installed. (Phase 1)
- **Redundant deps:** `body-parser` (superseded by `express.json()`), `node-fetch@3` ESM-only in a CommonJS project (superseded by global `fetch`). (Phase 1)
- **CORS is wide open** (`app.use(cors())` with no options). Acceptable for a public sample API, but should be a deliberate, documented choice. (Phase 4)

---

## Phase 0 — Baseline & safety net (do first)

Nothing here changes behavior; it makes every later phase verifiable.

1. **Pin the runtime.** Add `"engines": { "node": ">=26" }` to `server/package.json`, add a repo-root `.nvmrc` (`26`), and bump the Dockerfile from `node:22-alpine` to `node:26-alpine`.
2. **Fix CI** (`.github/workflows/node.js.yml`): add a server job that runs `npm ci` + `npm test` in `server/`, and bump the matrix off Node 16 to `[26.x]` (add `24.x` if you want a lower-bound guard). The client build step stays.
3. **Capture a response baseline.** Boot the server and snapshot representative endpoints (a REST list, a single resource, and a GraphQL query) into `docs/` or a test fixture. This is the regression oracle for Phases 1–3.
4. Confirm `jest` passes locally against the current code before touching anything.

**Exit criteria:** one Node version across CI/Docker/`.nvmrc`/`engines`; CI runs server tests and is green; a saved response baseline exists.

## Phase 1 — Dependency hygiene (low-risk, high-value)

1. **Declare `cors`** in `server/package.json` (this is a latent clean-install break).
2. **Remove `body-parser`** — `express.json()` / `express.urlencoded()` already cover it in `sampleapis.js`.
3. **Remove `node-fetch`** — replace its use in `routes/testApis.js` with the global `fetch` (Node 22 native). Confirm no remaining `require("node-fetch")`.
4. **Apply safe (non-breaking) bumps:** `express 4.21 → 4.22`, `morgan → 1.11`, `express-rate-limit → 7.5.1`, `pug → 3.0.4`, `nodemon` latest. Align `concurrently` to the installed major.
5. **`npm audit fix`** (non-`--force` only) to clear what's fixable without breaking changes.
6. Regenerate and commit a clean `package-lock.json`. Re-run `jest` + baseline check.

**Exit criteria:** clean install works from scratch; `body-parser`/`node-fetch` gone; lockfile in sync; tests + baseline green; audit count reduced.

## Phase 2 — Clear the critical vulnerability (isolated breaking change)

1. **`shell-quote` (critical):** resolve via the appropriate transitive upgrade / `overrides`. Verify nothing in the tree still pins the vulnerable range.
2. **`uuid` / transitive moderates:** bump where reachable without pulling in the GraphQL breaking change (that's Phase 3).
3. Re-run `npm audit`; document any residual advisories that are blocked solely by `json-graphql-server` so Phase 3 owns them.

**Exit criteria:** zero critical advisories; remaining highs traceable to the GraphQL chain and explicitly deferred to Phase 3.

## Phase 3 — Upgrade GraphQL to 3.x (clears the bulk of the audit backlog)

Most remaining high/moderate advisories chain from `json-graphql-server@2.4` → `apollo-test-utils → graphql-tools → uuid`. **We keep the `/graphql` endpoints and upgrade the library** to cut that subtree out.

1. **Bump `json-graphql-server 2.4 → 3.x`** (breaking — API/config and the `graphql`/apollo internals changed). Review its changelog for the server-setup signature.
2. **Re-wire the registration** in `routes/base-apis.js` — today it calls `jsonGraphqlExpress.default(data)` per API. Confirm the 3.x export/mounting shape and adjust (the default-export/handler contract may differ).
3. **Verify every `/{api}/graphql` endpoint** against the Phase 0 baseline: run the same queries and diff the responses. Pay attention to any schema/type-inference differences between 2.x and 3.x.
4. Re-run `npm audit`; it should be **clean or near-clean** after this bump.

**Exit criteria:** on `json-graphql-server@3.x`; all `/graphql` endpoints verified against baseline; `npm audit` clean (or only accepted low advisories, documented).

## Phase 4 — Architecture & robustness

1. **Replace the `process.exit(1)` reset mechanism** in `routes/reset.js`: restore files in place (copy `*.json.backup → *.json`) and return a normal response **without killing the process**. Guard against invalid `:id`. This removes the dependency on an external supervisor to stay alive.
2. **Add `helmet`** for security headers, and make **CORS explicit** — keep it permissive for a public sample API, but configure it deliberately (documented allowed methods/headers) rather than a bare `cors()`.
3. **Add a real health endpoint** (`/health` or `/healthz`) returning `200` + minimal JSON, and point the docker-compose healthcheck at it instead of `wget --spider /`.
4. **Centralized error handling:** an Express error-handling middleware so route failures return consistent JSON instead of default HTML stacks; remove scattered `console.log(err)` swallowing.
5. **Config via env:** ensure `PORT` and any origins/limits come from env with sane defaults (partially done — audit for hardcoded values).

**Exit criteria:** reset no longer exits the process; `helmet` + explicit CORS in place; `/health` wired into the compose healthcheck; uniform JSON error responses.

## Phase 5 — Framework & tooling upgrades (larger, more testing)

Sequenced last because these are the highest-churn changes and benefit from all prior safety nets.

1. **`express 4 → 5`** — review breaking changes (routing, `req`/`res` API, middleware signatures). Re-verify all routes against baseline.
2. **`express-slow-down 2 → 3`** and **`express-rate-limit 7 → 8`** — config/API changes; re-verify limiter behavior via `utils/rateLimiterDefaults.js`.
3. **`jest 29 → 30`** — update config/matchers as needed.
4. **`json-server 0.17 → 1.0`** — this is a **full rewrite**, not a bump. Treat as its own spike: confirm the `jsonServer.router(dataPath)` usage in `routes/base-apis.js` still maps cleanly, or adapt. Only proceed if 1.0 preserves the response contract; otherwise stay on 0.17.

**Exit criteria:** Express 5 + limiters + Jest 30 upgraded and green; `json-server` 1.0 either migrated with verified parity or a documented decision to hold.

## Phase 6 — Optional: ESM / TypeScript (stretch)

Higher effort, no user-facing change — do only if the maintenance win is wanted.

- **ESM migration:** `require` → `import`, `"type": "module"`, update entry/route files. Pairs naturally with having already dropped CommonJS-only `node-fetch`.
- **TypeScript:** incremental adoption starting at `utils/` and route handlers, mirroring the client's TS setup for consistency.

**Exit criteria:** build/test green under the chosen module system; documented for contributors in `CONTRIBUTING.md`.

---

## Sequencing summary

| Phase | Theme | Risk | Breaking? |
|---|---|---|---|
| 0 | Runtime pin, CI, baseline | none | no |
| 1 | Dependency hygiene | low | no |
| 2 | Critical vuln (shell-quote/uuid) | low | isolated |
| 3 | GraphQL upgrade to 3.x | medium | yes (isolated) |
| 4 | Architecture & robustness | medium | no (behavior-compatible) |
| 5 | Express 5 / limiters / Jest / json-server | high | yes |
| 6 | ESM / TypeScript (optional) | high | no (internal) |

**Invariant across all phases:** the public API response contract stays stable, verified against the Phase 0 baseline. Any intentional change to it is called out explicitly in that phase's PR.
