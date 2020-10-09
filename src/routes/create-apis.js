const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("create");
});

router.get("/verify/:name", async (req, res) => {
  const name = req.params.name.toLowerCase();
  if(!name) {
    return res.json({
      status: 404,
      message: "Please submit a name."
    })
  }

  const directoryPath = path.join(__dirname, "../custom");
  const files = await fs.readdirSync(directoryPath);
  const exists = files.filter(file => {
    const fileName = file.split('.')[0].toLowerCase();
    return fileName == name;
  })[0];

  if (!exists) {
    return res.json({
      status: 200,
      message: "Endpoint name is available to create."
    })
  }

  return res.json({
    status: 409,
    message: "Endpoint name already exists, please use a unique name."
  })
})

module.exports = router;