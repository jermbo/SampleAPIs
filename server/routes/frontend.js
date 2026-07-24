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
  const name = req.params.name.toLowerCase();
  const api = GeneratedAPIList.find((entry) => entry.link.toLowerCase() === name);

  if (!api) {
    return res.status(404).json({
      error: 404,
      message: `No API named '${req.params.name}'.`,
    });
  }

  res.json({
    status: 200,
    data: api,
  });
});

module.exports = router;
