export const URLS = {
  // Target for all requests, including the in-page Playground. Points at the local
  // server in dev — the Playground's sandboxed iframe is same address space (loopback),
  // so its fetch is not blocked by Private Network Access.
  API_LINK: import.meta.env.PROD ? "https://api.sampleapis.com" : "http://localhost:5555"
};
