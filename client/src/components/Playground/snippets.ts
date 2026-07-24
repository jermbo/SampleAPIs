export interface Snippet {
  id: string;
  label: string;
  build: (url: string) => string;
}

/** Starter templates offered above the editor. Each takes the current endpoint URL. */
export const SNIPPETS: Snippet[] = [
  {
    id: "async",
    label: "async / await",
    build: (url) => `// Edit me, then Run (⌘/Ctrl + Enter). Top-level await works.
const resp = await fetch("${url}");
const data = await resp.json();

console.log(Array.isArray(data) ? \`Got \${data.length} items\` : "Got response");
console.log(data);`,
  },
  {
    id: "then",
    label: ".then()",
    build: (url) => `// Same request using promise chaining instead of await.
fetch("${url}")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.error(err.message));`,
  },
  {
    id: "post",
    label: "POST",
    build: (url) => `// Create a record. SampleAPIs accepts writes and echoes the result back.
const resp = await fetch("${url}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "My new item" }),
});

console.log("Status:", resp.status);
console.log(await resp.json());`,
  },
];

export const DEFAULT_SNIPPET = SNIPPETS[0];
