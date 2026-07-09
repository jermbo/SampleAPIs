const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const directoryPath = path.join(__dirname, "../custom");

// Only allow simple, filesystem-safe names. This is the primary guard against
// path traversal (e.g. "../../sampleapis") since the value ends up in a file path.
const NAME_PATTERN = /^[a-z0-9_-]{1,50}$/i;

const isValidName = (name) => typeof name === "string" && NAME_PATTERN.test(name);

router.get("/", (req, res) => {
  res.render("create");
});

router.post("/", (req, res) => {
  const { endpointName, endpoints } = req.body;

  if (!isValidName(endpointName)) {
    return res.status(400).json({
      error: 400,
      message:
        "Invalid endpoint name. Use 1-50 letters, numbers, hyphens or underscores only.",
    });
  }

  if (!Array.isArray(endpoints) || endpoints.length === 0 || !endpoints.every(isValidName)) {
    return res.status(400).json({
      error: 400,
      message:
        "'endpoints' must be a non-empty array of names (1-50 letters, numbers, hyphens or underscores each).",
    });
  }

  // Ensure the target directory exists so writes don't blow up on a fresh clone.
  fs.mkdirSync(directoryPath, { recursive: true });

  // path.basename strips any directory components as a defence-in-depth measure
  // on top of the NAME_PATTERN check above.
  const fileName = `${path.basename(endpointName)}.json`;
  const filePath = path.join(directoryPath, fileName);

  if (fs.existsSync(filePath)) {
    return res.status(409).json({
      error: 409,
      message: `File with name: '${endpointName}' already exists. Please try a different name.`,
    });
  }

  const baseData = endpoints.reduce((acc, name) => {
    acc[name] = [{ id: 0, name: "test" }];
    return acc;
  }, {});

  fs.writeFileSync(filePath, JSON.stringify(baseData, null, 2));

  res.status(201).json({
    status: 201,
    message: "File was created!",
  });
});

module.exports = router;
