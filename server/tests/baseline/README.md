# Response baseline

Captured snapshots of representative REST endpoints that act as a regression oracle for
the public response contract. They were captured on Node 26 against `json-server@0.17`
(the stack the custom router replaced), which is exactly why they matter: the in-house
router in `server/utils/jsonRouter.js` promises json-server-0.17-compatible payloads. If
a change alters any of these payloads, that change must be intentional and called out in
the PR.

| File               | Request                                    |
| ------------------ | ------------------------------------------ |
| `beers-ale.json`   | `GET /beers/ale` — REST list               |
| `beers-ale-1.json` | `GET /beers/ale/1` — REST single resource  |

A GraphQL snapshot was also captured at the time but was removed along with the GraphQL
layer itself — see `docs/decisions/why-custom-json-router.md`.

## How to re-verify after a change

```sh
cd server
PORT=5599 node ./sampleapis.js &
curl -s http://localhost:5599/beers/ale | diff - tests/baseline/beers-ale.json
curl -s http://localhost:5599/beers/ale/1 | diff - tests/baseline/beers-ale-1.json
```

No `diff` output = payload unchanged. Reset the data first (`GET /resetit/beers`) if the
live file may have drifted from the backup.
