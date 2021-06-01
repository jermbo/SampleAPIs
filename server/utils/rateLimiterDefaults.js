const rateLimit = require("express-rate-limit");

const apiLimits = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500,
  message: "Too many requests, please try again after five minutes.",
  skip: (req,res) => { req.ip =="170.55.81.98" ? true : false }
});

module.exports = {
  apiLimits
}
