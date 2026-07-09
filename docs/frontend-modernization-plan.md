# Frontend Modernization Plan

> Scope: **client only** (`client/`). Backend work is planned separately and comes after this.
> Goal: adopt the TanStack ecosystem, remove Sass in favor of modern CSS, and bring tooling current — without changing the app's behavior for users.

## Guiding decisions

- **Routing:** TanStack Router, **file-based** routes (Vite plugin generates the type-safe route tree). `pages/` becomes `routes/`.
- **Data:** TanStack Query owns all server state. `useFetch` and the fetch logic in `GlobalContext` are retired.
- **Styling:** Delete the Sass pipeline entirely. Tokens become hand-written CSS custom properties; components use native CSS (nesting, `clamp()`, `color-mix()`, `light-dark()`, container queries).
- **No intermediate React Router 7 bump** — we skip straight to TanStack Router.
- Each phase should land as its own PR (or small stack of PRs) and stay green on lint + typecheck.

## Current state (baseline)

| Area | Now |
|---|---|
| Framework | Vite 5.2 + React 18.3 + TS 5.4 + SWC |
| Routing | `react-router-dom` 6.23, hand-rolled `routes.tsx` array + `.map()` in `App.tsx` |
| Server state | `useFetch.tsx` (no abort, no refetch-on-url-change) + `GlobalContext` |
| Styling | Sass — 23 `.scss` files, `vars/` + `mixins/` + `functions/`, custom-property generation from Sass maps |
| State | `GlobalContext` holds both server data (apiList, categories) and UI state (navVisible) |

Known issues to fix along the way:
- `useFetch` never re-fetches when `url` changes and has no `AbortController` cleanup.
- Routes are untyped (`route: any`, untyped `:id` param).
- Sass is largely used to emit CSS custom properties that modern CSS provides natively.

---

## Phase 1 — Tooling + TanStack Query (data layer)

Do the data layer first so routing migration in Phase 2 can lean on Query loaders.

1. **Bump tooling:** Vite 5→8, TypeScript to latest, `@types/*`, `@vitejs/plugin-react-swc`. Pin `engines.node` (Vite 8 raises the minimum Node version — confirm and pin accordingly). Confirm build + dev still run.
2. **Add TanStack Query:** install `@tanstack/react-query` (+ devtools). Wrap the app in `QueryClientProvider`.
3. **Replace `useFetch`:** create typed query hooks (e.g. `useApiList`, `useApiDetails`) that call `fetch` with proper typing and error handling. Delete `hooks/useFetch.tsx`.
4. **Shrink `GlobalContext`:** move the `/frontend` fetch + category derivation into a Query (`select` derives categories). Context keeps **only** UI state (`navVisible`), or move that to a small `useState`/store. Retire the server-state half of the context.
5. Verify: API list, details, and category filter all still work off Query.

**Exit criteria:** no component imports `useFetch`; server state flows through Query; app behaves identically.

## Phase 2 — TanStack Router (file-based)

1. **Install** `@tanstack/react-router` + `@tanstack/router-plugin` (Vite) + devtools. Wire the plugin into `vite.config.ts`.
2. **Restructure** `src/pages/*` → `src/routes/*` in the file-based convention:
   - `/` → `routes/index.tsx`
   - `/about`, `/docs`, `/style-guide`, `/api-list` → matching route files
   - `/api-list/:id` → `routes/api-list/$id.tsx` (typed param)
   - 404 → `routes/__root.tsx` notFound / catch-all
3. **Root layout:** move `Header` + `<main>` shell from `App.tsx` into `__root.tsx`. Code-splitting is automatic; drop the manual `lazy()` + `<Suspense>` map.
4. **Loaders + Query:** use route loaders that prefetch via the QueryClient so data is ready on navigation (kills the loading flash on the details page).
5. **Remove** `react-router-dom`, `router/routes.tsx`, and the `.map()` in `App.tsx`. Update all `<Link>`/navigation to TanStack equivalents (now type-checked).

**Exit criteria:** `react-router-dom` uninstalled; all routes/params type-safe; generated `routeTree.gen.ts` committed/ignored per convention.

## Phase 3 — Sass removal → modern CSS

1. **Tokens:** convert `styles/vars/_colors.scss`, `_fonts.scss`, `_screens.scss` and `_custom-properties.scss` into a single hand-written `styles/tokens.css` `:root` block of custom properties. (The Sass maps were only generating these anyway.)
2. **Global styles:** convert `_base.scss`, `_typography.scss`, `styles.scss` → plain CSS, organized with `@layer` (reset / tokens / base / components / utilities).
3. **Per-component CSS:** convert each `components/**/**.scss` and `routes/**/**.css`:
   - Sass nesting → **native CSS nesting**
   - mixins/functions → custom properties + `clamp()`, `min()`/`max()`, `color-mix()`
   - `vars/_screens` breakpoints → media/**container queries**
4. **Enhancements while in here:** add `light-dark()` theming and a documented token layer (feeds the existing `StyleGuide` page).
5. **Remove** `sass` from dependencies; delete `styles/vars/`, `mixins/`, `functions/` and all `.scss` files. Confirm no `@use`/`@import` of Sass remains.

**Exit criteria:** zero `.scss` files; `sass` uninstalled; visual parity confirmed against current UI.

## Phase 4 — TanStack Table + Form (feature polish)

Optional-but-planned; unlocks nicer UX and pairs with the future backend pagination/filtering.

1. **TanStack Table** for the API browser (`APIList` + `APIFilter` + `APISearch`): client-side sort/filter/paginate now, ready to switch to server-side when the backend gains pagination.
2. **TanStack Form** for any search/CRUD forms (typed + validated), staged for when the backend exposes writes.

**Exit criteria:** endpoint browser uses TanStack Table; forms (if any) use TanStack Form.

---

## Dependency summary

**Add:** `@tanstack/react-query`, `@tanstack/react-query-devtools`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-router-devtools`, later `@tanstack/react-table`, `@tanstack/react-form`.

**Remove:** `react-router-dom`, `sass`.

**Upgrade:** `vite`, `typescript`, `@types/*`, `@vitejs/plugin-react-swc`.

## Sequencing rationale

Query before Router (Router loaders depend on the QueryClient). Routing before Sass removal (avoids restyling files that are about to move `pages/` → `routes/`). Table/Form last (feature layer on a stable foundation).

## Known caveat: Sandpack examples can't hit local data

The runnable code examples on the API details page execute inside a Sandpack iframe
served from a **public HTTPS origin** (`https://…sandpack.codesandbox.io`). Browsers
(Chrome's **Private Network Access** policy) block a public origin from fetching a
loopback address like `http://localhost:5555`, so the examples point at the live public
API (`PUBLIC_API_LINK` in `utils/Config.ts`), not the dev server.

- This is a **browser policy**, not caused by the React/Vite/Sandpack upgrades — PNA
  enforcement has been tightening in Chrome independently.
- **Consequence:** while developing against local/new server data, the live Sandpack
  examples still show **production** data. The clickable "Endpoint:" link on the page
  does use the local dev server, so that path is testable.
- If we ever need examples to exercise local data in dev, options are: expose the dev
  server over a public HTTPS tunnel (ngrok/cloudflared) and feed that URL to the sample,
  or render examples non-interactively (static code) in dev. Revisit if it becomes a pain.

## Out of scope (tracked for backend plan)

- Replacing `json-server` (Express 5 handlers vs. Prisma + SQLite).
- API pagination/filtering/sorting endpoints (Table will consume these later).
- Auth / API keys / usage metering.
