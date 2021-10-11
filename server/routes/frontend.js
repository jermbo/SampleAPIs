const express = require("express");
const router = express.Router();

const GeneratedAPIList = require("../GeneratedAPIList");

router.get("/", async (req, res) => {
  res.json({
    status: 200,
    data: {
      APIListData: GeneratedAPIList,
    },
  });
});

router.get("/:name", async (req, res) => {
  res.json({
    data: 200,
    id: req.params.name,
  });
});

module.exports = router;
