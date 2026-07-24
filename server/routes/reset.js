const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const { getAPIListData } = require("../utils/getAPIListData");

let APIListData = [];

const restore = (api) => {
  const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
  const mainFile = path.join(__dirname, `../api/${api}.json`);
  fs.copyFileSync(backupFile, mainFile);
};

// Reset every endpoint
router.get("/all", async (req, res) => {
  if (!APIListData.length) {
    APIListData = await getAPIListData();
  }

  APIListData.forEach((page) => restore(page.link));

  res.render("api-reset", { title: "Reset Everything" });
});

// Reset a single endpoint
router.get("/:id", async (req, res) => {
  if (!APIListData.length) {
    APIListData = await getAPIListData();
  }

  const id = req.params.id.toLowerCase();
  const data = APIListData.find((api) => id === api.link.toLowerCase());

  if (!data) {
    return res.status(404).json({
      error: 404,
      message: `No endpoint named '${req.params.id}' to reset.`,
    });
  }

  restore(data.link);

  res.render("api-reset", { ...data });
});

module.exports = router;
