const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const ApiList = require("../apiList");
const { checkJSONDifference } = require("../utils/checkJSONDifference");

// Reset API Route
router.get("/all", async (req, res) => {
  let anyDifferent = false;

  await ApiList.forEach(async (page) => {
    const api = page.link;

    const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
    const mainFile = path.join(__dirname, `../api/${api}.json`);

    anyDifferent = await checkJSONDifference(mainFile, backupFile);

    if (anyDifferent) {
      console.log(api + " was different, changing now");
      fs.copyFile(backupFile, mainFile, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });

  if (anyDifferent) {
    console.log("there were differences, i should reset");
    process.exit(1);
  } else {
    console.log("nothing changed... dont reset");
    res.render("api-reset", {
      title: "Reset Everything",
    });
  }
});

// Main EndPoint Route
router.get("/:id", async (req, res) => {
  const id = req.params.id.toLowerCase();
  const data = ApiList.filter((api) => id == api.link.toLowerCase())[0];
  const api = data.link;

  const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
  const mainFile = path.join(__dirname, `../api/${api}.json`);

  const anyDifferent = await checkJSONDifference(mainFile, backupFile);

  if (anyDifferent) {
    fs.copyFile(backupFile, mainFile, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.render("api-reset", {
    ...data,
  });

  if (anyDifferent) {
    // console.log("there were differences, i should reset");
    process.exit(1);
  } else {
    // console.log("nothing changed... dont reset");
    res.render("api-reset", {
      ...data,
    });
  }
});

module.exports = router;
