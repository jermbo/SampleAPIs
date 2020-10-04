const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const jsonServer = require("json-server");
// const jsonGraphqlExpress = require("json-graphql-server");
// const { getFromFile } = require("../utils");

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500,
  message: "Too many requests, please try again after five minutes."
});

router.use(
  '/custom/jermbo',
  apiLimiter,
  // jsonServer.router(path.join(__dirname, '../custom/jermbo.json'))
  jsonServer.router(path.join(__dirname, `../custom/jermbo.json`))
);


module.exports = router;