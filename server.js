const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const server = jsonServer.create();
const middleware = jsonServer.defaults();
const port = process.env.PORT || 5000;
const pages = ["futurama", "avatar", "baseball", "recipes", "fakebank"];

server.use(middleware);

pages.forEach(page => {
  server.use(`/${page}`, express.static(path.join(__dirname, `${page}`)));
  server.use(`/${page}`, jsonServer.router(`./${page}/${page}.json`));
});

server.listen(port, () => {
  console.log(`JSON Server is now running on port: ${port}`);
});
