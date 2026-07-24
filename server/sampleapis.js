const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { globalLimits } = require("./utils/rateLimiterDefaults");

// Express App
const app = express();
const port = process.env.PORT || 5555;
const isProduction = process.env.NODE_ENV === "production";

// Behind Docker/nginx/other reverse proxies the client IP arrives via
// X-Forwarded-For. Trusting the first hop lets express-rate-limit key on the
// real client IP (and makes the allowlist work) instead of the proxy address.
app.set("trust proxy", 1);

// Request logging. Concise in production, verbose in development, silent in tests.
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(isProduction ? "combined" : "dev"));
}

// Global rate limiter — a safety net across every route, including the
// unauthenticated admin/reset/create routes that would otherwise be unlimited.
app.use(globalLimits);

// JSON Parser — cap body size so oversized payloads can't exhaust memory.
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

// Security headers. CSP is disabled because the legacy Pug site renders inline
// data/scripts; the API itself is public so the remaining helmet defaults apply.
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — public sample API, permissive but explicit about what is allowed.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Health check (used by docker-compose and uptime monitors)
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Routes
const reset = require("./routes/reset");
const baseApis = require("./routes/base-apis");
const frontend = require("./routes/frontend");
const test = require("./routes/testApis");

app.use("/frontend", frontend);

const create = require("./routes/create-apis");

const { generateAPIListData } = require("./utils/getAPIListData");
const generateNewAPIListData = async (req, res) => {
  await generateAPIListData();

  res.json({
    response: 200,
    data: {
      message: "Created",
    },
  });
};

//! Deprecation Notice
//* This is to serve the old static design site.
//* The `apiList.js` will be removed in future versions.
const ApiList = require("./apiList");
app.get("/", (req, res) => {
  res.render("index", {
    apiList: JSON.stringify(ApiList),
  });
});

app.use("/resetit", reset);
app.use("/create", create);
app.use("/generate", generateNewAPIListData);
app.use("/test",test);
app.use("/", baseApis);

// 404 — no route matched
app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler. Express 5 forwards rejected async handlers here,
// so route failures return consistent JSON instead of an HTML stack trace.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.status || 500,
    message: "Something went wrong handling that request.",
  });
});

// Starting App
app.listen(port, () => {
  console.log(`App is listening on: http://localhost:${port}`);
});
