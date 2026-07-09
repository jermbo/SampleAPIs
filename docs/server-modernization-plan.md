# Server Modernization

> Scope: **server** (`server/`), with the client and docs updated where the API surface changed.
> Approach: originally a risk-ordered phased plan, but since nothing ships until the whole
> effort is done, it was executed as **one push to the end state** rather than incrementally.

## End-state decisions

- **Node 26** everywhere — pinned in `engines`, `.nvmrc`, CI, and the Dockerfile (previously drifted across 16 / 22 / 24).
- **Express 5.** Brought the framework and all middleware to current majors in one move.
- **json-server removed, replaced with a custom router.** json-server 1.0 became a CLI-only, ESM, tinyhttp-based tool with no embeddable Express router, so it can't be mounted per-file the way this server needs. `server/utils/jsonRouter.js` is a small Express router providing the same REST contract (full CRUD + filter/sort/paginate/`q`), reading each `api/*.json` per request and persisting writes back to disk.
- **GraphQL dropped entirely.** Removed from the server, the client UI, and the docs. (json-graphql-server 3.x still works via its `json-graphql-server/node` subpath export if it's ever wanted back, but the endpoints, links, and copy were removed.)
- **Public REST contract preserved.** Baseline snapshots in `server/tests/baseline/` are the regression oracle; live responses still match them.
- **Legacy static site kept, cleaned.** The Pug site + `apiList.js` served at `/` stays, but its GraphQL links/fields were stripped.

## What changed

**Runtime & tooling**
- `engines: node >=26`, `.nvmrc` `26`, Dockerfile `node:26-alpine`.
- CI now installs and runs the server Jest suite (it previously only built the client) on Node 26.

**Dependencies**
- Removed: `body-parser` (covered by `express.json()`), `node-fetch` (native `fetch`), `json-server`, `json-graphql-server`.
- Added: `helmet`.
- Upgraded to current majors: `express` 5, plus `morgan`, `express-rate-limit`, `express-slow-down`, `pug`, `jest`, `nodemon`.
- `npm audit`: from 24 vulnerabilities (1 critical / 7 high) to **0**.

**Data layer**
- `server/utils/jsonRouter.js` — json-server-compatible CRUD router, read-per-request, write-through persistence.
- `routes/base-apis.js` mounts it per API; GraphQL registration removed.

**Express 5 fallout**
- `utils/verifyData.js` — Express 5 leaves `req.body` undefined on bodyless requests; GET/DELETE now short-circuit before touching it, and query strings are stripped from the resource lookup.

**Architecture & robustness**
- `routes/reset.js` — removed both `process.exit(1)` calls; restores from the `.json.backup` twins in place (the router reads per request, so no restart is needed) and 404s on unknown ids.
- `sampleapis.js` — added `helmet` (CSP off for the legacy inline-script site), explicit CORS, a `/health` endpoint, a JSON 404 fallback, and a centralized error handler.
- `docker-compose.yml` healthcheck points at `/health`.
- Deleted dead code: `routes/custom-apis.js`, `views/custom.pug`.

## Verification

- Boot: zero errors.
- Reads: `/beers/ale` and `/beers/ale/1` byte-match the Phase 0 baseline.
- CRUD: POST→201, PUT/PATCH→200, DELETE→`{}`, unknown id→404.
- Query: `_sort` / `_order` / `_page` / `_limit` / filters / `q`.
- Reset: returns 200 **and the server stays alive**; data restored.
- `/health` → 200; helmet headers present; unknown routes → JSON 404.
- `npm test` green; `npm audit` clean.

## Still open

- **Broader docs accuracy pass.** `server-documentation.md` and `PRD.md` still describe json-server and "custom APIs"; only the GraphQL references were removed here.
- **Optional:** ESM / TypeScript migration to match the client (not started).
