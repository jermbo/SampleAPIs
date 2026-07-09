# Response baseline (Phase 0)

Captured snapshots of representative endpoints **before** the Phase 1+ dependency and
framework upgrades, to act as a regression oracle. If a later phase changes any of these
payloads, that change must be intentional and called out in the PR.

Captured on Node 26 against `json-graphql-server@2.4` / `json-server@0.17`, server on `PORT=5599`:

| File | Request |
|---|---|
| `beers-ale.json` | `GET /beers/ale` — REST list |
| `beers-ale-1.json` | `GET /beers/ale/1` — REST single resource |
| `beers-graphql-ales.json` | `POST /beers/graphql` body `{"query":"{ allAles(perPage: 2) { id name price } }"}` |

## How to re-verify after an upgrade

```sh
cd server
PORT=5599 node ./sampleapis.js &
curl -s http://localhost:5599/beers/ale | diff - tests/baseline/beers-ale.json
curl -s http://localhost:5599/beers/ale/1 | diff - tests/baseline/beers-ale-1.json
curl -s -X POST http://localhost:5599/beers/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ allAles(perPage: 2) { id name price } }"}' \
  | diff - tests/baseline/beers-graphql-ales.json
```

No `diff` output = payload unchanged.
