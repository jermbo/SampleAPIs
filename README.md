# Sample APIs

![Screenshot](/SampleAPI-3.0-Screenshot.png)

## Purpose

Understanding RESTful APIs is hard enough without wrestling with authentication at the same time. SampleAPIs is a free playground of sample REST endpoints for learning: no keys, no tokens, no sign-up. Pick an endpoint and start fetching. If you don't find data you like, [contribute your own](CONTRIBUTING.md).

## How to use the service

Choose an API, say `futurama`, then choose a resource, say `characters`:

```javascript
const resp = await fetch("https://api.sampleapis.com/futurama/characters");
const data = await resp.json();
console.log(data);
```

Want to search? Filter by any field, including nested ones:

```javascript
const resp = await fetch("https://api.sampleapis.com/futurama/characters?name.first=Bender");
const data = await resp.json();
console.log(data);
```

You also have full CRUD — `POST`, `PUT`, `PATCH`, and `DELETE` all work and actually persist. The data resets to its original state on a regular basis (and whenever new endpoints ship), so experiment freely. The full query syntax, pagination, and error shapes are documented in the [API docs](docs/api/README.md).

## Documentation

The [project wiki](docs/README.md) covers the whole system in short, linked pages — architecture, the API surface, the data lifecycle, the React client, operations, and the reasoning behind the design.

## Running locally

Requires Node.js ≥ 26.

```bash
npm install && npm install --prefix server && npm install --prefix client
npm run dev
```

API at `http://localhost:5555`, site at `http://localhost:4444`. Details (including the Docker setup) live in [Local Development](docs/operations/local-development.md).

## Contributing

The most valued contribution is a new dataset. Start with the [Contributing guide](docs/contributing/getting-started.md) and [Adding an Endpoint](docs/data/adding-an-endpoint.md). For history, see the [Change Log](Change_log.md).

## Disclaimers

- The data on this site is for educational purposes only and is not owned by SampleAPIs.com.
- Data is reset back to its original state on a regular basis. If you want your additions to persist as part of the collection, contribute them via pull request.
- By using SampleAPIs.com you agree to the following terms: this service is provided as-is. It might change or be discontinued without prior notice. The maker of this service can't be held liable in any way for any reason.
