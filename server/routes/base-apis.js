const express = require("express");
const path = require("path");
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server");

const { apiLimits } = require("../utils/rateLimiterDefaults");
const { getFromFile } = require("../utils/utils");

const ApiList = require("../apiList");

const router = express.Router();

// API EndPoint Route
ApiList.forEach(({ link }) => {
  const dataPath = path.join(__dirname, `../api/${link}.json`);
  const data = getFromFile(dataPath);
  try {
    router.use(`/${link}/graphql`, apiLimits, jsonGraphqlExpress.default(data));
  } catch (err) {
    console.log(`Unable to set up /${link}/graphql`);
    console.error(err);
  }

  router.use(`/${link}`, apiLimits, jsonServer.router(dataPath));
});

module.exports = router;
