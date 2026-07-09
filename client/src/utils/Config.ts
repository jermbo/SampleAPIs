export const URLS = {
  // Target for the app's own requests. Points at the local server in dev.
  API_LINK: process.env.NODE_ENV === "production" ? "https://api.sampleapis.com" : "http://localhost:5555",
  // Always the public API. Used inside runnable code samples (Sandpack), which
  // execute in a public sandbox iframe and cannot reach a localhost/loopback URL.
  PUBLIC_API_LINK: "https://api.sampleapis.com"
};
