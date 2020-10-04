const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server");
const { getFromFile } = require("../utils");

const ApiList = require("../apiList");

const router = express.Router();

/// Main EndPoint Route
router.get("/:id", (req, res) => {
  const id = req.params.id.toLowerCase();
  const data = ApiList.filter(api => id == api.link.toLowerCase())[0];

  if (data) {
    res.render("page", {
      ...data
    });
  } else {
    res.render("404");
  }
});

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500,
  message: "Too many requests, please try again after five minutes."
});

// API EndPoint Route
ApiList.forEach(({ link }) => {
  router.use(
    `/${link}/api`,
    apiLimiter,
    jsonServer.router(path.join(__dirname, `../api/${link}.json`))
  );

  let data = getFromFile(path.join(__dirname, `../api/${link}.json`));
  try {
    router.use(
      `/${link}/graphql`,
      apiLimiter, 
      jsonGraphqlExpress.default(data)
    );
  } catch (err) {
    console.log(`Unable to set up /${link}/graphql`);
    console.error(err);
  }
});

module.exports = router;