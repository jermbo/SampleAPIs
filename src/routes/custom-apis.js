const express = require("express");
const fs = require("fs");
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

// router.use(
//   '/:id',
//   apiLimiter,
//   // jsonServer.router(path.join(__dirname, '../custom/jermbo.json'))
//   jsonServer.router(path.join(__dirname, `../custom/jermbo.json`))
// );


let customFiles = [];
const directoryPath = path.join(__dirname, "../custom");
async function init() {
  console.log('getting files')
  customFiles = await fs.readdirSync(directoryPath);
  console.log(customFiles)
}
init();



module.exports = router;