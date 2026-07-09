const express = require("express");
const GeneratedAPIList = require("../GeneratedAPIList");
const router = express.Router();

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });

// Smoke-test every generated endpoint and stream a simple HTML report.
router.get("/", async (req, res) => {
  res.set("Content-Type", "text/html");
  res.write("<html><head><title>Testing...</title></head><body>");
  res.write("Testing all endpoints...<br>");

  // Flatten every (api, endpoint) pair into a single list of fetch promises so
  // Promise.all actually waits on the requests instead of on nested arrays.
  const checks = GeneratedAPIList.flatMap((api) =>
    api.endpoints.map(async (endpoint) => {
      const url = `http://${req.headers.host}/${api.link}/${endpoint}`;
      try {
        const response = await fetch(url);
        const collection = await response.json();
        const count = Array.isArray(collection) ? collection.length : collection ? 1 : 0;
        if (count) {
          res.write(`calling ${escapeHtml(url)}: ${count} records found<br>`);
        } else {
          res.write(`calling ${escapeHtml(url)}: <font color=red>FAIL!!!!</font><br>`);
        }
        return count;
      } catch (err) {
        console.error(`Error fetching ${url}`, err);
        res.write(`Error fetching ${escapeHtml(url)}<br>`);
        return 0;
      }
    })
  );

  await Promise.all(checks);
  res.end("Done.</body></html>");
});

module.exports = router;
