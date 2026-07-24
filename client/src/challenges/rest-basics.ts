import type { Track } from "./types";

/**
 * The pilot track: REST basics as a concept sequence (GET → read the response →
 * query filter → handle a 404 → POST → verify the write), running on Futurama
 * (decision D3). Content is written to teach; failMessages guide, never scold.
 */
export const restBasics: Track = {
  id: "rest-basics",
  title: "REST basics",
  description:
    "Learn the request/response loop every API works on: fetch a collection, read into the JSON, filter with query params, survive a 404, and write data back with POST.",
  apiLink: "futurama",
  endpoint: "characters",
  challenges: [
    {
      id: "fetch-all",
      title: "Fetch all the characters",
      prompt:
        "Use fetch() to GET the characters collection and log what comes back.",
      starter: (url) => `// 1 of 6 — Fetch all the characters, then Run (⌘/Ctrl + Enter).
// The endpoint: ${url}

`,
      checks: [
        {
          kind: "requestMade",
          method: "GET",
          urlIncludes: "/futurama/characters",
          label: "A GET request hit the characters endpoint",
          failMessage:
            "No GET request to the characters endpoint was seen — call fetch() with the endpoint URL from the comment.",
        },
        {
          kind: "responseStatus",
          status: 200,
          urlIncludes: "/futurama/characters",
          label: "The API answered 200 OK",
          failMessage:
            "The request didn't come back 200 — open the Network tab and check the URL you actually requested.",
        },
        {
          kind: "consoleCount",
          min: 1,
          label: "Something was logged",
          failMessage:
            "Nothing hit the console — log the parsed data with console.log().",
        },
      ],
      hints: [
        "fetch(url) returns a promise — await it to get a Response object.",
        "The Response body needs parsing: await resp.json() gives you the actual data.",
      ],
      solution: (url) => `const resp = await fetch("${url}");
const data = await resp.json();
console.log(data);`,
    },
    {
      id: "read-response",
      title: "Read into the response",
      prompt:
        "Fetch the characters again, but this time log only the FIRST character's first name.",
      starter: (url) => `// 2 of 6 — Log the first character's first name (just the name, not the whole object).
const resp = await fetch("${url}");
const data = await resp.json();

`,
      checks: [
        {
          kind: "responseStatus",
          status: 200,
          urlIncludes: "/futurama/characters",
          label: "The characters were fetched",
          failMessage:
            "The collection GET didn't succeed — keep the fetch from the starter code.",
        },
        {
          kind: "consoleIncludes",
          pattern: "Philip",
          label: "The first character's first name was logged",
          failMessage:
            "Expected to see the first character's first name in the output — it's nested: data[0], then one level deeper.",
        },
        {
          kind: "noUncaughtError",
          label: "No uncaught errors",
          failMessage:
            "The run threw — check for a typo in the property path (undefined in the middle of a chain throws).",
        },
      ],
      hints: [
        "The response is an array — data[0] is the first character.",
        "Names are nested objects here: data[0].name has first, middle, and last.",
      ],
      solution: (url) => `const resp = await fetch("${url}");
const data = await resp.json();
console.log(data[0].name.first);`,
    },
    {
      id: "query-filter",
      title: "Filter with a query param",
      prompt:
        "Get ONLY Bender — but let the server do the filtering with a query parameter instead of filtering the array in JavaScript.",
      note: "Server-side filtering is how real APIs avoid shipping you data you'll throw away.",
      starter: (url) => `// 3 of 6 — Add a query parameter so the server returns only Bender.
// Equality filters look like: ?field=value (dot paths reach nested fields)
const resp = await fetch("${url}");
const data = await resp.json();
console.log(data);`,
      checks: [
        {
          kind: "requestMade",
          method: "GET",
          urlIncludes: "name.first=Bender",
          label: "The request used a name.first query param",
          failMessage:
            "The request URL didn't include ?name.first=Bender — check the query-string spelling (dot path, capital B).",
        },
        {
          kind: "responseStatus",
          status: 200,
          urlIncludes: "name.first",
          label: "The filtered request succeeded",
          failMessage:
            "The filtered GET didn't come back 200 — inspect the final URL in the Network tab.",
        },
        {
          kind: "consoleIncludes",
          pattern: "bender",
          label: "Bender showed up in the output",
          failMessage:
            "Bender wasn't in the console output — log the data the filtered request returned.",
        },
      ],
      hints: [
        "Query params go after a ? at the end of the URL: ?field=value.",
        "Nested fields use dot paths — the field you want is name.first.",
      ],
      solution: (url) => `const resp = await fetch("${url}?name.first=Bender");
const data = await resp.json();
console.log(data);`,
    },
    {
      id: "handle-404",
      title: "Handle the 404",
      prompt:
        "Request a character that doesn't exist (try id 9999) and log a friendly message instead of letting an error escape.",
      note: "fetch() does NOT throw on a 404 — a missing resource is still a successful HTTP exchange. You have to check the status yourself.",
      starter: (url) => `// 4 of 6 — Single items live at /characters/<id>. Request id 9999,
// then check the response status and log a friendly message if it's missing.
const resp = await fetch("${url}/9999");

`,
      checks: [
        {
          kind: "responseStatus",
          status: 404,
          urlIncludes: "9999",
          label: "The API answered 404 for the missing id",
          failMessage:
            "No 404 response was seen for id 9999 — keep the /9999 on the end of the URL.",
        },
        {
          kind: "consoleCount",
          min: 1,
          label: "A message was logged",
          failMessage:
            "Nothing was logged — branch on the status and console.log a message for the missing-character case.",
        },
        {
          kind: "noUncaughtError",
          label: "No uncaught errors",
          failMessage:
            "The run threw — a 404 body may not be the shape your code expects; check the status BEFORE reading into the data.",
        },
      ],
      hints: [
        "resp.ok is true only for 2xx statuses; resp.status gives you the exact code.",
        "if (!resp.ok) { console.log(...) } else { ...parse and use the data }",
      ],
      solution: (url) => `const resp = await fetch("${url}/9999");
if (!resp.ok) {
  console.log("No character with that id (status " + resp.status + ")");
} else {
  console.log(await resp.json());
}`,
    },
    {
      id: "create-character",
      title: "Create a character with POST",
      prompt:
        "POST a new character to the collection and log the record the API echoes back.",
      note: "Writes are safe here — the data resets on a schedule, so your character vanishing later is by design.",
      starter: (url) => `// 5 of 6 — POST a new character. Give it at least a name.
// A write needs three things: the method, a Content-Type header, and a JSON body.
const resp = await fetch("${url}", {

});
`,
      checks: [
        {
          kind: "requestMade",
          method: "POST",
          urlIncludes: "/futurama/characters",
          label: "A POST hit the characters endpoint",
          failMessage:
            "No POST request was seen — set method: \"POST\" in fetch's second argument.",
        },
        {
          kind: "responseStatus",
          status: 201,
          method: "POST",
          label: "The API answered 201 Created",
          failMessage:
            "The POST didn't come back 201 — make sure the body is JSON.stringify'd and the Content-Type header is application/json.",
        },
        {
          kind: "consoleCount",
          min: 1,
          label: "The created record was logged",
          failMessage:
            "Nothing was logged — the API echoes the created record back; parse and log it to see the id it was given.",
        },
      ],
      hints: [
        'fetch\'s second argument is an options object: { method: "POST", headers: {...}, body: ... }.',
        'The body must be a string — JSON.stringify your object — and headers needs "Content-Type": "application/json".',
      ],
      solution: (url) => `const resp = await fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: { first: "Lrrr", last: "of Omicron Persei 8" } }),
});
console.log("Status:", resp.status);
console.log(await resp.json());`,
    },
    {
      id: "verify-write",
      title: "Verify your write",
      prompt:
        "POST another character, then GET the collection again and log the last item — proof your write really landed.",
      note: "Never trust a write you didn't read back. (Assert on YOUR new record, not on the collection's size — other learners write here too.)",
      starter: (url) => `// 6 of 6 — Two requests in sequence: POST a character, then GET the
// collection and log the last item.
// The endpoint: ${url}

`,
      checks: [
        {
          kind: "responseStatus",
          status: 201,
          method: "POST",
          urlIncludes: "/futurama/characters",
          label: "The POST created a record (201)",
          failMessage:
            "No successful POST was seen — challenge 5's shape works here unchanged.",
        },
        {
          kind: "requestMade",
          method: "GET",
          urlIncludes: "/futurama/characters",
          label: "The collection was fetched again",
          failMessage:
            "No GET followed the write — fetch the collection a second time, after the POST resolves.",
        },
        {
          kind: "responseStatus",
          status: 200,
          method: "GET",
          urlIncludes: "/futurama/characters",
          label: "The verification GET succeeded",
          failMessage:
            "The follow-up GET didn't come back 200 — check the Network tab for what was actually requested.",
        },
        {
          kind: "noUncaughtError",
          label: "No uncaught errors",
          failMessage:
            "The run threw — await the POST before starting the GET so the two don't race.",
        },
      ],
      hints: [
        "Two awaited fetches, one after the other — the await on the first guarantees the order.",
        "New records are appended, so data[data.length - 1] is your character.",
      ],
      solution: (url) => `await fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: { first: "Morbo", last: "the Annihilator" } }),
});

const resp = await fetch("${url}");
const data = await resp.json();
console.log(data[data.length - 1]);`,
    },
  ],
};
