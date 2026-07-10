---
title: Testing
description: The test layers — unit, live smoke, request collection, lint
audience: developer
---

[Wiki Home](../README.md) › [Operations](./README.md)

# Testing

Five lightweight layers, each catching a different class of problem.

## Server unit tests (jest)

`npm test` in `server/` validates the data catalog: every entry has an id, link, title, descriptions, at least one endpoint, and — most usefully — that the `<name>.json` **and** `<name>.json.backup` files actually exist. Note these tests currently assert against the deprecated `apiList.js`, not the [generated registry](../data/api-registry.md).

CI runs this suite automatically: a GitHub Actions workflow ([.github/workflows/node.js.yml](../../.github/workflows/node.js.yml)) executes `npm ci && npm test` in `server/` on Node 26 for every push and PR to `main`.

## Response baseline snapshots

`server/tests/baseline/` holds captured responses from representative endpoints (`GET /beers/ale`, `GET /beers/ale/1`), taken against the original `json-server@0.17` stack. They are the **regression oracle for the public response contract**: the [custom router](../decisions/why-custom-json-router.md) promises json-server-compatible payloads, so any change to `jsonRouter.js` should be `curl | diff`-checked against these files (instructions in the folder's [README](../../server/tests/baseline/README.md)) and payload changes called out in the PR.

## Live smoke test

`GET /test` on a running server fetches **every registered endpoint** and streams an HTML pass/fail report — the fastest way to verify [a new endpoint](../data/adding-an-endpoint.md) actually serves data.

## Request collection

`endpoint-test/` is a **Bruno** (OpenCollection format) collection of saved requests for exercising endpoints by hand during development.

## Lint

The client uses **oxlint** (`npm run lint` in `client/`); TypeScript itself gates the build via `tsc` in the build script.

## Key files

- [server/tests/apis.test.js](../../server/tests/apis.test.js)
- [server/tests/baseline/README.md](../../server/tests/baseline/README.md)
- [server/routes/testApis.js](../../server/routes/testApis.js)
- [endpoint-test/opencollection.yml](../../endpoint-test/opencollection.yml)

## Related

- [Adding an Endpoint](../data/adding-an-endpoint.md)
- [API Registry](../data/api-registry.md)
