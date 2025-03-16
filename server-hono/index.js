import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Import routes
import frontend from "./routes/frontend.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Hono app
const app = new Hono();
const port = process.env.PORT || 7777;

// Middleware
app.use("*", cors());

// Serve static files
// app.use("/assets/*", serveStatic({ root: "./public" }));
// app.use("/scripts/*", serveStatic({ root: "./public" }));
app.use("*", serveStatic({ root: "./public" }));

// Add a more general static file handler
app.use("/public/*", serveStatic({ root: path.join(__dirname) }));

// Routes
app.route("/frontend", frontend);

// Serve index.html
app.get("/", async (c) => {
  try {
    const indexPath = path.join(__dirname, "views/index.html");
    const content = await fs.promises.readFile(indexPath, "utf8");
    return c.html(content);
  } catch (error) {
    console.error("Error serving index.html:", error);
    return c.text("Error serving the page", 500);
  }
});

// 404 handler
app.notFound((c) => {
  try {
    const notFoundPath = path.join(__dirname, "views/404.html");
    const content = fs.readFileSync(notFoundPath, "utf8");
    return c.html(content, 404);
  } catch (error) {
    console.error("Error serving 404.html:", error);
    return c.text("404 - Not Found", 404);
  }
});

// Start the server
console.log(`Starting Hono server on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port: port,
});

// Log when server is ready
console.log(`Server is running on http://localhost:${port}`);
