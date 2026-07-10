# Contributing to Sample APIs

Thanks for taking the time to contribute!

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgement, and feel free to propose changes to this document in a pull request.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

When contributing to this repository, please first discuss the change you wish to make via an [issue](https://github.com/jermbo/SampleAPIs/issues) with the owners of this repository before making a change.

For a deeper understanding of how everything works, see the [project wiki](docs/README.md) — short, linked pages covering the architecture, the API, and the data lifecycle.

## Code of Conduct

Before we get any further, please take the time to review our [Code of Conduct](CODE_OF_CONDUCT.md). This project and everyone participating in it will be governed by the Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to us. Be polite to everyone. If you are not in your best day, take a deep breath and try again. Smile 😄!

## New Issues

Before you submit an issue:

- Search the current list of issues, bug reports, or feature requests.
- If the issue already exists, add a 👍 or a ❤️, and you can click the `Subscribe` or `Watching` button to get notifications via email.
- Please, do not use the issue tracker for support questions.

## Contributing

When you are looking for an issue to work on:

- Search the current list of issues, bug reports, or feature requests.
- When you find something you are interested in and assign it to you.
- Give it a label of `Doing`.
- Create a branch with issue number and title. ( ie. `1-create-contributing-documentation`)
- Make the changes in your branch.
- Submit a PR to `main` branch when ready. ( Please follow PR Comment Guide )

## PR Comment Guide

The title of the pull request should contain only the issue number and issue title. ( ie `#1 Create Contributing Documentation`)

The body's first line should be a link to the issue for quick reference. The rest of the body should be a brief explanation of what changes were made. Each issue should have a list for Acceptance Criteria, this should be addressed in the PR comment.

## Code Review Process

The core team looks a Pull Request on a regular basis. Each PR will be reviewed and tested. Feedback will be provided via file comments or general comments. We will be clear if further action is required. It is the contributors responsibility their code does not have breaking changes or merge conflicts.

## Example of adding a new Endpoint

Our project is all about great data to play with!
And I know of no one better than YOU (yes YOU) that knows what data YOU'D like to play with.

In this section we'll learn how to add a new dataset (or "endpoint" as we'll call them). The full walkthrough lives in the wiki at [Adding an Endpoint](docs/data/adding-an-endpoint.md); here is the short version. For a real-world reference, see [this PR that added a new endpoint](https://github.com/jermbo/SampleAPIs/pull/89).

1. Create a `server/api/<endpointName>.json` file (eg. `baseball.json` for `api.sampleapis.com/baseball`) following the [endpoint JSON format](docs/data/endpoint-json-format.md) — each top-level array becomes a resource (so a `homeRuns` array becomes `https://api.sampleapis.com/baseball/homeRuns`).
2. Create a `.backup` file which is an exact copy of the original (eg. `baseball.json.backup`) — this is the pristine copy the [weekly data reset](docs/data/data-reset.md) restores from.
3. Ensure your newly created json file has a `metaData` key at the top of the file.
4. Regenerate the [API registry](docs/data/api-registry.md) by hitting `GET /generate` on your running local server, and commit the updated `server/GeneratedAPIList.js` along with your two data files.

The JSON file should look something like:

```JavaScript
{
  "metaData": [
    {
      "title": "", // The display title of the data
      "desc": "", // A short explanation about this data
      "longDesc": "", // A longer explanation about this data
      "featured": false, // This should always be false to start with
      "categories": [] // An array of strings for whatever categories fit your data
    }
  ],
  "dataset1": [...],
  "dataset2": [...],
  "dataset3": [...],
}
```

### How the system works

Every JSON file in `server/api/` is served by a small Express router ([server/utils/jsonRouter.js](server/utils/jsonRouter.js)) as a full-CRUD REST API. Each top-level array in your file becomes a resource supporting `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`, plus filtering, sorting, and pagination out of the box. Writes persist to the file on disk, and the data is regularly restored from the `.backup` twins. The details are in the wiki: [REST Conventions](docs/api/rest-conventions.md), [CRUD & Validation](docs/api/crud-and-validation.md).

#### Data Structure

The first level children of the JSON Object will be your main entry points for the server. For example:

```JavaScript
// Fav-Show.json
{
  "metaData": [...],
  "characters": [...],
  "questions": [...],
  "inventory": [...],
}
```

This API will have `characters`, `questions`, and `inventory` for its available sources. Resulting in `https://api.sampleapis.com/fav-show/characters`, `https://api.sampleapis.com/fav-show/questions`, and `https://api.sampleapis.com/fav-show/inventory`.

**_We strip out `metaData` from the available endpoints list, as we use this for populating the website. But you can still reach the data if you wanted to._**

_Important:_ Each resource must be an **array of objects**, and the objects should be consistent with each other — the first object in the array acts as the schema that [write validation](docs/api/crud-and-validation.md) checks incoming data against.

_Important:_ Every object in a dataset needs a **unique `id`** — single-record routes and all write operations match on it.

### API Documentation

When adding a new endpoint, please include the following information in your PR:

1. **Endpoint Overview**

   - Brief description of the data
   - Example use case
   - Any special considerations

2. **Example Request/Response**

   ```javascript
   // Example: Fetching data
   const response = await fetch("https://api.sampleapis.com/your-endpoint/collection");
   const data = await response.json();
   console.log(data); // a plain array of your records
   ```

3. **Available Operations**

   - GET: Retrieve data
   - POST: Add new items
   - PUT / PATCH: Update existing items
   - DELETE: Remove items

4. **Query Parameters** (full reference: [Querying & Filtering](docs/api/querying-and-filtering.md) and [Sorting & Pagination](docs/api/sorting-and-pagination.md))

   - `_page` + `_limit`: Pagination (e.g., `?_page=1&_limit=10`)
   - `_sort` + `_order`: Sorting (e.g., `?_sort=name&_order=asc`)
   - Field filters, including nested fields (e.g., `?name.first=Bender`)
   - Operator suffixes `_gte`, `_lte`, `_ne`, `_like` and full-text `q`

5. **Response Format** — collection responses are plain JSON arrays (single resources are plain objects):

   ```json
   [
     {
       "id": 1,
       "field": "value"
     }
   ]
   ```
