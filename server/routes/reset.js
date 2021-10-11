const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const { getAPIListData } = require("../utils/getAPIListData");

let APIListData = [];

// Reset API Route
router.get("/all", async (req, res) => {
  if (!APIListData.length) {
    APIListData = await getAPIListData();
  }

  APIListData.forEach((page) => {
    const api = page.link;

    const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
    const mainFile = path.join(__dirname, `../api/${api}.json`);

    fs.copyFile(backupFile, mainFile, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  res.render("api-reset", {
    title: "Reset Everything",
  });
  process.exit(1);
});

// Main EndPoint Route
router.get("/:id", async (req, res) => {
  if (!APIListData.length) {
    APIListData = await getAPIListData();
  }

  const id = req.params.id.toLowerCase();
  const data = APIListData.filter((api) => id == api.link.toLowerCase())[0];
  const api = data.link;

  const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
  const mainFile = path.join(__dirname, `../api/${api}.json`);

  fs.copyFile(backupFile, mainFile, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.render("api-reset", {
    ...data,
  });

  process.exit(1);
});

module.exports = router;
