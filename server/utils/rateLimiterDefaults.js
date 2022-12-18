const rateLimit = require("express-rate-limit");

const allowlist = ["170.55.81.98"];

const apiLimits = rateLimit({
  windowMs: 15 * 60 * 1000, // 5 minutes
  max: 5000,
  message: "Too many requests, please try again after five minutes.",
  skip: (req, res) => allowlist.includes(req.ip),
});

module.exports = {
  apiLimits,
};
