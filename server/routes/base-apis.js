const express = require("express");
const router = express.Router();
const path = require("path");
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server");

const { apiLimits } = require("../utils/rateLimiterDefaults");
const { getFromFile } = require("../utils/utils");

const { verifyData } = require("../utils/verifyData");
const GeneratedAPIList = require("../GeneratedAPIList");

const init = async () => {
  GeneratedAPIList.forEach(({ link }) => {
    const dataPath = path.join(__dirname, `../api/${link}.json`);
    const data = getFromFile(dataPath);

    try {
      router.use(`/${link}/graphql`, apiLimits, jsonGraphqlExpress.default(data));
    } catch (err) {
      console.log(`Unable to set up /${link}/graphql`);
      console.error(err);
    }

    router.use(`/${link}`, verifyData, apiLimits, jsonServer.router(dataPath));
  });
};

init();

module.exports = router;
