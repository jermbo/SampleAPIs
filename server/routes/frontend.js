const express = require("express");
const router = express.Router();

const { getAPIListData } = require("../utils/getAPIListData");

let APIListData = [];

router.get("/", async (req, res) => {
  if (!APIListData.length) {
    APIListData = await getAPIListData();
  }

  res.json({
    status: 200,
    data: {
      APIListData,
    },
  });
});

router.get("/:name", async (req, res) => {
  if (!APIListData.length) {
    APIListData = await getAPIListData();
  }

  res.json({
    data: 200,
    id: req.params.name,
  });
});

module.exports = router;
