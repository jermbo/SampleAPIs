const express = require("express");
const router = express.Router();
const path = require("path");

const { apiLimits } = require("../utils/rateLimiterDefaults");
const { createJsonRouter } = require("../utils/jsonRouter");

const { verifyData } = require("../utils/verifyData");
const GeneratedAPIList = require("../GeneratedAPIList");

const init = async () => {
  GeneratedAPIList.forEach(({ link }) => {
    const dataPath = path.join(__dirname, `../api/${link}.json`);
    router.use(`/${link}`, verifyData, apiLimits, createJsonRouter(dataPath));
  });
};

init();

module.exports = router;
