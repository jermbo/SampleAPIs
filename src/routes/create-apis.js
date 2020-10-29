const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const directoryPath = path.join(__dirname, "../custom");

router.get("/", (req, res) => {
  res.render("create");
});

router.post("/", async (req, res) => {
  const {endpointName, endpoints} = req.body;
  console.log({endpointName, endpoints});

  const files = await fs.readdirSync(directoryPath);
  const exists = files.filter(file => {
    const fileName = file.split(".")[0].toLowerCase();
    return fileName == endpointName;
  })[0];

  if (exists) {
    res.json({
      status: 409,
      message: `File with name: '${endpointName}' already exists. Please try a different name.`
    });
    return;
  }

  const baseData = endpoints.reduce((acc, name) => {
    const obj = acc;
    obj[name] = [{"id":0,"name":"test"}];
    return obj;
  }, {});

  if (!exists) {
    fs.writeFileSync(
      path.join(__dirname, `../custom/${endpointName}.json`),
      JSON.stringify(baseData)
    );
  }

  res.json({
    status: 201,
    message: "File was created!"
  });
});

module.exports = router;
