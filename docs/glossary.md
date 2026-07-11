---
title: Glossary
description: Shared vocabulary — project terms defined once so sessions and newcomers don't need re-explaining
audience: [developer, architect]
---

[Wiki Home](./README.md)

# Glossary

Terms we use as if everyone knows them. Each entry is one or two sentences with a link to the page that owns the concept; if a term isn't here and caused confusion, add it. Grouped by area, alphabetical within each.

## The site and its data

- **API (a SampleAPIs API)** — one themed dataset (e.g. _futurama_) served as a group of REST endpoints. One JSON file per API in [server/api](../server/api/); see [Endpoint Data](./data/README.md).
- **Backup twin** — the `.json.backup` file next to each dataset; the pristine copy that [resets](./data/data-reset.md) restore from. Never served directly.
- **Collection vs. singular resource** — a top-level dataset key holding an **array** is a collection (`/futurama/characters`, `/characters/:id`); one holding an **object** is a singular resource served whole. See [Endpoint JSON Format](./data/endpoint-json-format.md).
- **Custom endpoint** — a dataset file created at runtime through the `/create` route, as opposed to one contributed by PR. See [Custom Endpoints](./data/custom-endpoints.md).
- **Dataset** — the JSON file behind an API; its top-level keys become endpoints.
- **Registry** — the generated list ([GeneratedAPIList.js](../server/GeneratedAPIList.js)) of every API and its metadata; drives both server route mounting and the client's API list via `/frontend`. See [API Registry](./data/api-registry.md).
- **Reset** — restoring datasets from their backup twins, via `/resetit/:api` or `/resetit/all`, on a schedule or manually. The reason writes are consequence-free; see [Data Reset](./data/data-reset.md) and [Why Persistent Writes + Resets](./decisions/why-weekly-resets.md).

## Server

- **Control keys** — query parameters with reserved meaning (`_sort`, `_order`, `_page`, `_limit`, `_start`, `_end`, `q`); everything else is treated as a field filter. See [Querying & Filtering](./api/querying-and-filtering.md).
- **Error shape** — the standard JSON error body `{ error: <status>, message: "…" }` every non-2xx response follows. See [Error Responses](./api/error-responses.md).
- **jsonRouter** — the ~240-line owned replacement for json-server: a router factory giving any dataset full CRUD + querying with json-server-0.17-compatible behavior. [jsonRouter.js](../server/utils/jsonRouter.js); rationale in [Why a Custom JSON Router](./decisions/why-custom-json-router.md).
- **Link header** — pagination navigation (`first`/`prev`/`next`/`last` URLs) set on `_page` requests. See [Sorting & Pagination](./api/sorting-and-pagination.md).
- **Operator suffix** — filter modifiers appended to a field name: `_gte`, `_lte`, `_ne`, `_like` (case-insensitive substring).
- **Rate limiters** — two express-rate-limit instances: the **global** safety net over every route and the more generous **per-API** limiter on data routes; an IP **allowlist** skips both. See [Rate Limiting](./api/rate-limiting.md).
- **Service routes** — the non-data routes: `/health`, `/frontend`, `/resetit`, `/create`, `/generate`, `/test`, and the legacy site at `/`. See [Service Routes](./api/service-routes.md). (Not to be confused with the _practice routes_ proposal.)
- **Shape validation** — [verifyData.js](../server/utils/verifyData.js)'s middleware check that write bodies match the dataset's first record's keys; failures return a 400 with `expected` vs. `received`.
- **Write lock** — jsonRouter's per-file promise queue that serializes read-modify-write cycles so concurrent mutations can't produce lost updates.
- **X-Total-Count** — response header carrying the pre-pagination total for collection GETs.

## Client and Playground

- **Bootstrap (script)** — the HTML/JS injected into the sandbox iframe via `srcdoc` before user code runs; it wraps `console.*` and `fetch`, relays messages, and executes the user's code. Lives inside [Playground.tsx](../client/src/components/Playground/Playground.tsx).
- **Check spec** — one declarative assertion in a challenge (`requestMade`, `responseStatus`, `consoleIncludes`, `consoleCount`, `noUncaughtError`), carrying its own `label` and `failMessage`. Evaluated page-side against run events; see [Challenge Checks](./features/challenge-checks.md).
- **Fetch wrapper / `__net` events** — the bootstrap's `window.fetch` replacement that reports every request as `request`/`response`/`error` events over the tokened channel while handing user code an untouched Response. Powers the [HTTP Inspector](./features/http-inspector.md) and network checks.
- **JsonTree** — the collapsible JSON viewer component used for console output objects. See [JSON Tree Viewer](./features/json-tree-viewer.md).
- **Null-origin sandbox / opaque origin** — the Playground iframe runs with `sandbox="allow-scripts"` and _without_ `allow-same-origin`, so user code has no origin: it can't touch cookies, storage, or the parent DOM. See [Why a Sandboxed Playground](./decisions/why-sandboxed-playground.md).
- **PNA (Private Network Access)** — the browser rule blocking public pages from fetching private/localhost addresses. Why embedded third-party code editors (e.g. Sandpack) can't hit a local dev server, and why the Playground's same-page iframe can.
- **Playground** — the CodeMirror editor + sandboxed runner on every API details page. See [Playground](./features/playground.md).
- **Run events** — the stream a challenge host observes via the Playground's `onRunEvent` prop: `start`, `console`, `net`, `uncaught`, `done` (top-level code returned), `end` (sandbox torn down). See [Challenge Checks](./features/challenge-checks.md).
- **Run timeout** — the 5-second cap on a Playground run; the iframe is torn down after it (kills infinite loops).
- **Starter snippet** — a code template (`build(url)`) offered as a tab above the editor, interpolated with the active endpoint URL. [snippets.ts](../client/src/components/Playground/snippets.ts).
- **TanStack Query / TanStack Router** — the client's data-fetching-cache and file-based routing libraries. See [Data Fetching & State](./features/data-fetching-and-state.md) and [Pages & Routing](./features/pages-and-routing.md).
- **Tokened postMessage channel** — the parent↔iframe messaging protocol where every message carries a per-run random token; messages without the current token are ignored. The one bridge across the sandbox boundary.

## Docs and planning

- **Breadcrumb** — the `[Wiki Home](…) › [Section](…)` line above every page's H1.
- **Decision log (per feature)** — the maintainer-facing list of open choices for a proposed feature, each with options, a recommendation, and a fill-in **Decision** line. Lives in [plans](./future-features/plans/README.md); distinct from a _decision page_.
- **Decision page** — a permanent record in [Decisions](./decisions/README.md) of why the system is built a certain way: forces, costs accepted, revisit triggers. Decision logs graduate into these when features ship or get rejected.
- **Front matter** — the YAML block (`title`, `description`, `audience`, optional `status`) atop every wiki page. No timestamps — git history covers that.
- **Implementation plan** — a per-feature working doc (user stories, architecture, build phases, verification) under [plans](./future-features/plans/README.md); the bridge between a proposal and code.
- **Proposal** — a [future-features](./future-features/README.md) page: problem, approach, effort/risk, open questions. `status: proposed` until accepted or rejected.
- **Roadmap** — the [review dashboard](./future-features/plans/README.md) tracking every plan's decision status and build order.
- **Track / challenge / check** — [Guided Challenges](./features/guided-challenges.md) vocabulary: a _track_ is an ordered set of _challenges_; each challenge validates via declarative _checks_ evaluated against a run's console/network events. Authoring: [Authoring a Track](./contributing/authoring-a-track.md).
- **User story** — a one-sentence requirement from a specific person's viewpoint ("As a learner, I can …"), used in implementation plans to keep architecture answerable to someone.
- **Wiki page** — one concept, readable in ~60 seconds, front matter + breadcrumb + Key files + Related. The [home page](./README.md) states the conventions.

## Related

- [Wiki Home](./README.md) — page conventions this glossary complements
- [Implementation Roadmap](./future-features/plans/README.md) — where the planning vocabulary is used
