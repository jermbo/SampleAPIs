const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const fs = require("fs");
const server = jsonServer.create();
const middleware = jsonServer.defaults();
const port = process.env.PORT || 5001;
const pages = [
  "futurama",
  "avatar",
  "baseball",
  "recipes",
  "fakebank",
  "football",
  "countries",
  "presidents",
  "simpsons",
  "hurricanes",
  "movies",
  "wines",
  "health",
  "beers",
  "switch",
  "playstation"
];

server.get("/reset", (req, res) => {
  pages.forEach(page => {
    fs.copyFile(`./${page}/${page}.json.backup`, `./${page}/${page}.json`, err => {
      if (err) {
        console.error(err);
      }
    });
  });
  res.end("ok");
});

server.use(middleware);

pages.forEach(page => {
  server.use(`/${page}`, express.static(path.join(__dirname, `${page}`)));
  server.use(`/${page}`, jsonServer.router(`./${page}/${page}.json`));
});

server.listen(port, () => {
  console.log(`JSON Server is now running : http://localhost:${port}`);
});
