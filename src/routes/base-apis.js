const express = require("express");
const path = require("path");
const router = express.Router();
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server")
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const { getFromFile } = require("../utils");

const ApiList = require("../apiList");

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

// API EndPoint Route
ApiList.forEach(({ link }) => {
  router.use(
    `/${link}/api`,
    jsonServer.router(path.join(__dirname, `../api/${link}.json`))
  );

  let data = getFromFile(path.join(__dirname, `../api/${link}.json`));
  try {
    router.use(`/${link}/graphql`, jsonGraphqlExpress.default(data));
  } catch (err) {
    console.log(`Unable to set up /${link}/graphql`);
    console.error(err);
  }
});

module.exports = router;