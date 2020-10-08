const express = require("express");
const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server");
const { getFromFile } = require("../utils");

const { apiLimits } = require("../utils/rateLimiterDefaults");
const router = express.Router();

let CustomEndpoints = [];
const directoryPath = path.join(__dirname, "../custom");

const init = async () =>  {
  CustomEndpoints = [];
  await createFileMetaData();
  registerCustomLandingPages();
  registerCustomEndPoints();
}

const createFileMetaData = async () => {
  const files = await fs.readdirSync(directoryPath);
  CustomEndpoints = files.map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, `../custom/${file}`)));
    const endPoints = Object.keys(data);
    const name = file.split('.')[0].toLowerCase();
    
    return {
      name,
      link: name,
      endPoints
    }
  });
}

const registerCustomLandingPages = () => {
  router.get("/:id", (req, res) => {
    const id = req.params.id.toLowerCase();
    const data = CustomEndpoints.filter(endpoint => endpoint.name === id)[0];

    if (data) {
      res.render("custom", {
        ...data
      });
    } else {
      res.render("404");
    }
  });
}

const registerCustomEndPoints = () => {
  CustomEndpoints.forEach((endpoint) => {
    const { name } = endpoint;
    router.use(
      `/${name}/api`,
      apiLimits,
      jsonServer.router(path.join(__dirname, `../custom/${name}.json`))
    );

    let data = getFromFile(path.join(__dirname, `../api/${link}.json`));
    try {
      router.use(
        `/${link}/graphql`,
        apiLimits, 
        jsonGraphqlExpress.default(data)
      );
    } catch (err) {
      console.log(`Unable to set up /${link}/graphql`);
      console.error(err);
    }
  });
}

router.get("/create/:name", async (req, res) => {
  const name = req.params.name.toLowerCase();
  const files = await fs.readdirSync(directoryPath);
  const exists = files.filter(file => {
    const fileName = file.split('.')[0].toLowerCase();
    return fileName == name;
  })[0];

  const baseData = {
    info: { name }
  }

  if (!exists) {
    fs.writeFileSync(
      path.join(__dirname, `../custom/${name}.json`), 
      JSON.stringify(baseData)
    );
    init();
  }

  res.redirect(`/custom/${name}`);
})

init();
module.exports = router;