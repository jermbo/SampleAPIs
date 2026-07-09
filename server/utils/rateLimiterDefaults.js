const rateLimit = require("express-rate-limit");

const allowlist = ["170.55.81.98", "12.220.63.124"];

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Per-API limiter for the sample data endpoints (generous, this is the main
// surface students hammer against).
const apiLimits = rateLimit({
  windowMs: WINDOW_MS,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 429, message: "Too many requests, please try again after fifteen minutes." },
  skip: (req) => allowlist.includes(req.ip),
});

// Global safety net applied before any route so unauthenticated admin/reset/
// create routes can't be abused without limit. Kept higher than apiLimits so it
// never trips before the per-API limiter for normal usage.
const globalLimits = rateLimit({
  windowMs: WINDOW_MS,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 429, message: "Too many requests, please try again after fifteen minutes." },
  skip: (req) => allowlist.includes(req.ip),
});

module.exports = {
  apiLimits,
  globalLimits,
};
