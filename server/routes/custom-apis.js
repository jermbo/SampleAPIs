const express = require("express");
const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server");

const { apiLimits } = require("../utils/rateLimiterDefaults");
const { getFromFile } = require("../utils/utils");

const router = express.Router();

let CustomEndpoints = [];
const directoryPath = path.join(__dirname, "../custom");

const init = async () => {
  CustomEndpoints = [];
  await createFileMetaData();
  registerCustomLandingPages();
  registerCustomEndPoints();
};

const createFileMetaData = async () => {
  const files = await fs.readdirSync(directoryPath);
  CustomEndpoints = files.map((file) => {
    if (file.includes(".json")) {
      console.log("Custom url:" + file);
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, `../custom/${file}`)));
      const endPoints = Object.keys(data);
      const name = file.split(".")[0].toLowerCase();

      return {
        name,
        link: name,
        endPoints,
      };
    } else {
      return null;
    }
  });

  //TODO - do something with "CustomEndpoints"...
};

const registerCustomLandingPages = () => {
  router.get("/:id", (req, res) => {
    const id = req.params.id.toLowerCase();
    const data = CustomEndpoints.filter((endpoint) => endpoint.name === id)[0];

    if (data) {
      res.render("custom", {
        ...data,
      });
    } else {
      init();
      res.render("404-custom", {
        id,
      });
    }
  });
};

const registerCustomEndPoints = () => {
  CustomEndpoints.forEach((endpoint) => {
    if (endpoint) {
      const { name } = endpoint;
      const file = path.join(__dirname, `../custom/${name}.json`);
      router.use(`/${name}/api`, apiLimits, jsonServer.router(file));

      let data = getFromFile(file);
      try {
        router.use(`/${name}/graphql`, apiLimits, jsonGraphqlExpress.default(data));
      } catch (err) {
        console.log(`Unable to set up /custom/${name}/graphql`);
        console.error(err);
      }
    }
  });
};

init();
module.exports = router;
